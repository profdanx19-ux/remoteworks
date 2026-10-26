const params = new URLSearchParams(window.location.search);
const job = params.get("job");
const duration = 15 * 60;
const storageKey = `rsh-assessment-${job}`;

const invalid = document.querySelector("#invalid");
const exam = document.querySelector("#exam");
const results = document.querySelector("#results");
const resultsCopy = document.querySelector("#results-copy");
const title = document.querySelector("#exam-title");
const timer = document.querySelector("#timer");
const progressLabel = document.querySelector("#progress-label");
const progressFill = document.querySelector("#progress-fill");
const questionBox = document.querySelector("#question");
const form = document.querySelector("#exam-form");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const submitButton = document.querySelector("#submit");
const saveError = document.querySelector("#save-error");

let questions = [];
let index = 0;
let answers = {};
let startedAt = Date.now();
let remaining = duration;
let clock = 0;
let submitted = false;

function loadState() {
  try {
    return JSON.parse(sessionStorage.getItem(storageKey)) || null;
  } catch {
    return null;
  }
}

function saveState(extra) {
  const current = loadState() || {};
  sessionStorage.setItem(
    storageKey,
    JSON.stringify({
      ...current,
      startedAt,
      index,
      answers,
      ...extra,
    }),
  );
}

function formatTime(seconds) {
  const whole = Math.max(0, seconds);
  const minutes = Math.floor(whole / 60);
  const remainder = whole % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function answered(question) {
  const value = String(answers[question.id] ?? "").trim();
  return value.length > 0;
}

function complete() {
  return questions.every(answered);
}

function showResults(score, total) {
  submitted = true;
  window.clearInterval(clock);
  exam.hidden = true;
  invalid.hidden = true;
  results.hidden = false;
  document.title = "Assessment Complete";
  resultsCopy.textContent = `Assessment Complete — You scored ${score}/${total}. Congratulations, you've passed. Your application has been forwarded to the hiring team. You'll receive next steps within 24 hours.`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function render() {
  const question = questions[index];
  const total = questions.length;
  progressLabel.textContent = `Question ${index + 1} of ${total}`;
  progressFill.style.width = `${((index + 1) / total) * 100}%`;
  prevButton.disabled = index === 0;
  nextButton.hidden = index === total - 1;
  submitButton.hidden = index !== total - 1;
  submitButton.disabled = !complete();

  if (question.type === "mcq") {
    questionBox.innerHTML = `
      <fieldset class="exam-question">
        <legend>${escapeHtml(question.prompt)}</legend>
        ${question.options
          .map(
            (option) => `
          <label class="option">
            <input type="radio" name="choice" value="${escapeHtml(option.id)}" ${
              answers[question.id] === option.id ? "checked" : ""
            } />
            <span>${escapeHtml(option.text)}</span>
          </label>`,
          )
          .join("")}
      </fieldset>`;
    questionBox.querySelectorAll("input").forEach((input) => {
      input.addEventListener("change", () => {
        answers[question.id] = input.value;
        saveState();
        submitButton.disabled = !complete();
      });
    });
    return;
  }

  questionBox.innerHTML = `
    <label class="exam-written">
      ${escapeHtml(question.prompt)}
      <textarea name="written" rows="6">${escapeHtml(answers[question.id] || "")}</textarea>
    </label>`;
  const area = questionBox.querySelector("textarea");
  area.addEventListener("input", () => {
    answers[question.id] = area.value;
    saveState();
    submitButton.disabled = !complete();
  });
}

function tick() {
  remaining = duration - Math.floor((Date.now() - startedAt) / 1000);
  if (remaining <= 0) {
    timer.textContent = "00:00";
    submitExam(true);
    return;
  }
  timer.textContent = formatTime(remaining);
}

async function submitExam(fromTimer) {
  if (submitted) return;
  submitted = true;
  window.clearInterval(clock);
  submitButton.disabled = true;
  saveError.hidden = true;
  try {
    const response = await fetch("/api/assessments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job, answers }),
    });
    if (!response.ok) throw new Error("save failed");
    const data = await response.json();
    saveState({ done: true, score: data.score, total: data.total });
    showResults(data.score, data.total);
  } catch {
    submitted = false;
    saveError.hidden = false;
    submitButton.hidden = false;
    nextButton.hidden = true;
    submitButton.disabled = fromTimer ? false : !complete();
    if (remaining > 0) clock = window.setInterval(tick, 1000);
  }
}

async function start() {
  if (!job) {
    invalid.hidden = false;
    return;
  }

  const saved = loadState();
  if (saved?.done) {
    showResults(saved.score, saved.total || 12);
    return;
  }

  let payload;
  try {
    const response = await fetch(`/api/assessments/${encodeURIComponent(job)}`);
    if (!response.ok) throw new Error("missing");
    payload = await response.json();
  } catch {
    invalid.hidden = false;
    return;
  }

  questions = payload.questions;
  title.textContent = `Skills Assessment — ${payload.role}`;
  document.title = `Skills Assessment — ${payload.role}`;
  if (saved) {
    startedAt = saved.startedAt || Date.now();
    index = Math.min(saved.index || 0, questions.length - 1);
    answers = saved.answers || {};
  } else {
    startedAt = Date.now();
    saveState();
  }

  exam.hidden = false;
  render();
  tick();
  if (remaining <= 0) return;
  clock = window.setInterval(tick, 1000);
}

prevButton.addEventListener("click", () => {
  if (index === 0) return;
  index -= 1;
  saveState();
  render();
});

nextButton.addEventListener("click", () => {
  if (index >= questions.length - 1) return;
  index += 1;
  saveState();
  render();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!complete()) return;
  submitExam(false);
});

start();
