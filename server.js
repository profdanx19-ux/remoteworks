const express = require("express");
const site = require("./site.config.js");
const fs = require("fs");
const path = require("path");

const app = express();
const port = Number(process.env.PORT) || 8765;
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

app.get("/apply", (req, res) => {
  res.sendFile(path.join(__dirname, "apply.html"));
});

app.use(express.static(__dirname));

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

app.get("/api/assessments/:job", (req, res) => {
  const bank = publicBank(text(req.params.job, 40));
  if (!bank) {
    res.status(404).json({ error: "Unknown assessment." });
    return;
  }
  res.json(bank);
});

app.post("/api/assessments", (req, res) => {
  const job = text(req.body?.job, 40);
  const answers = req.body?.answers;
  const result = grade(job, answers);

  if (!result) {
    res.status(400).json({ error: "A valid assessment is required." });
    return;
  }

  const cleaned = {};
  Object.entries(answers).forEach(([key, value]) => {
    cleaned[text(key, 10)] = text(value, 2000);
  });

  const records = readRecords();
  records.assessments.push({
    id: `${Date.now().toString(36)}-${records.assessments.length + 1}`,
    job,
    role: roles[job].name,
    answers: cleaned,
    score: result.score,
    total: result.total,
    submittedAt: new Date().toISOString(),
  });
  writeRecords(records);
  res.status(201).json({ ok: true, score: result.score, total: result.total });
});

app.listen(port, () => {
  const base = `http://127.0.0.1:${port}`;
  console.log(`${site.name} running at ${base}`);
  console.log("Email these assessment links after you review an application:");
  console.log(`  Data Entry Specialist: ${base}/assessment.html?job=data`);
  console.log(`  Transcriptionist: ${base}/assessment.html?job=transcription`);
  console.log(`  Virtual Assistant: ${base}/assessment.html?job=assistant`);
});
