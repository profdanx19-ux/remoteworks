const express = require("express");
const site = require("./public/site.config.js");
const fs = require("fs");
const path = require("path");

const app = express();
const port = Number(process.env.PORT) || 8765;
const publicDir = path.join(__dirname, "public");
const dataFile = path.join(__dirname, "data", "records.json");

app.use(express.json({ limit: "100kb" }));

const { publicBank, grade } = require("./lib/assessments");

const blockedPrefixes = ["/data", "/node_modules", "/lib"];
const blockedFiles = new Set([
  "/server.js",
  "/package.json",
  "/package-lock.json",
  "/.gitignore",
]);

app.use((req, res, next) => {
  const blocked =
    blockedFiles.has(req.path) ||
    blockedPrefixes.some((prefix) => req.path === prefix || req.path.startsWith(`${prefix}/`));
  if (blocked) {
    res.status(404).end();
    return;
  }
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/apply", (req, res) => {
  res.sendFile(path.join(publicDir, "apply.html"));
});

app.use(express.static(publicDir));

function readRecords() {
  try {
    const parsed = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    return {
      applications: Array.isArray(parsed.applications) ? parsed.applications : [],
      assessments: Array.isArray(parsed.assessments) ? parsed.assessments : [],
    };
  } catch {
    return { applications: [], assessments: [] };
  }
}

function writeRecords(records) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(records, null, 2));
}

function text(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

const roles = {
  data: {
    name: "Data Entry Specialist",
    assessmentPath: "/assessment.html?job=data",
  },
  transcription: {
    name: "Transcriptionist",
    assessmentPath: "/assessment.html?job=transcription",
  },
  assistant: {
    name: "Virtual Assistant",
    assessmentPath: "/assessment.html?job=assistant",
  },
};

app.post("/api/applications", (req, res) => {
  const roleKey = text(req.body?.role, 40);
  const role = roles[roleKey];
  const name = text(req.body?.name, 80);
  const email = text(req.body?.email, 120);
  const phone = text(req.body?.phone, 40);
  const country = text(req.body?.country, 80);
  const city = text(req.body?.city, 80);
  const hours = text(req.body?.hours, 40);
  const start = text(req.body?.start, 40);
  const internet = text(req.body?.internet, 40);
  const experience = text(req.body?.experience, 1000);

  if (!role || !name || !email || !email.includes("@") || !phone || !country || !city || !hours || !start || !internet || !experience) {
    res.status(400).json({ error: "Complete every required field." });
    return;
  }

  const records = readRecords();
  const assessmentUrl = `${req.protocol}://${req.get("host")}${role.assessmentPath}`;
  records.applications.push({
    id: `${Date.now().toString(36)}-${records.applications.length + 1}`,
    role: role.name,
    name,
    email,
    phone,
    country,
    city,
    hours,
    start,
    internet,
    experience,
    assessmentUrl,
    submittedAt: new Date().toISOString(),
  });
  writeRecords(records);
  res.status(201).json({ ok: true });
});

app.get("/api/assessments/status", async (req, res) => {
  const email = text(req.query.email, 120).toLowerCase();
  const jobKey = text(req.query.job, 40);
  if (!email || !email.includes("@") || !roles[jobKey]) {
    res.status(400).json({ error: "A valid email and role are required." });
    return;
  }
  const already = await assessmentExists(email, jobKey);
  res.json({ already });
});

app.get("/api/assessments/:job", (req, res) => {
  const bank = publicBank(text(req.params.job, 40));
  if (!bank) {
    res.status(404).json({ error: "Unknown assessment." });
    return;
  }
  res.json(bank);
});

app.post("/api/assessments", async (req, res) => {
  const job = text(req.body?.job, 40);
  const answers = req.body?.answers;
  const result = grade(job, answers);

  if (!result) {
    res.status(400).json({ error: "A valid assessment is required." });
    return;
  }

  const email = text(req.body?.email, 120).toLowerCase();
  if (!email || !email.includes("@")) {
    res.status(400).json({ error: "A valid email is required." });
    return;
  }

  if (await assessmentExists(email, job)) {
    res.status(409).json({ duplicate: true });
    return;
  }

  const cleaned = {};
  Object.entries(answers).forEach(([key, value]) => {
    cleaned[text(key, 10)] = text(value, 2000);
  });

  const record = {
    id: `${Date.now().toString(36)}-${readRecords().assessments.length + 1}`,
    job,
    email,
    role: roles[job].name,
    answers: cleaned,
    score: result.score,
    total: result.total,
    submittedAt: new Date().toISOString(),
  };

  try {
    await saveAssessment(record);
  } catch (error) {
    if (error.duplicate) {
      res.status(409).json({ duplicate: true });
      return;
    }
    res.status(500).json({ error: "The assessment could not be saved." });
    return;
  }

  res.status(201).json({ ok: true, score: result.score, total: result.total });
});

async function saveAssessment(record) {
  const webhook = process.env.ASSESSMENT_WEBHOOK || site.assessmentWebhook;
  if (webhook) {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    const payload = await response.json().catch(() => ({}));
    if (payload.duplicate) {
      const error = new Error("duplicate");
      error.duplicate = true;
      throw error;
    }
    if (!response.ok) throw new Error("The assessment sheet did not accept the answers.");
    return;
  }

  const records = readRecords();
  records.assessments.push(record);
  writeRecords(records);
}

async function assessmentExists(email, jobKey) {
  const local = readRecords().assessments.some(
    (item) => item.job === jobKey && String(item.email || "").toLowerCase() === email,
  );
  if (local) return true;

  const webhook = process.env.ASSESSMENT_WEBHOOK || site.assessmentWebhook;
  if (!webhook) return false;

  const url = new URL(webhook);
  url.searchParams.set("email", email);
  url.searchParams.set("job", jobKey);
  const response = await fetch(url);
  if (!response.ok) return false;
  const payload = await response.json().catch(() => ({}));
  return Boolean(payload.already);
}

module.exports = app;

if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    const base = `http://127.0.0.1:${port}`;
    console.log(`${site.name} running at ${base}`);
    console.log("Email these assessment links after you review an application:");
    console.log(`  Data Entry Specialist: ${base}/assessment.html?job=data`);
    console.log(`  Transcriptionist: ${base}/assessment.html?job=transcription`);
    console.log(`  Virtual Assistant: ${base}/assessment.html?job=assistant`);
  });
}
