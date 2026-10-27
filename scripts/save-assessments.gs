/**
 * Saves skills-assessment answers into the RemoteStaff Hub spreadsheet.
 *
 * 1. Open https://script.google.com and create a new project.
 * 2. Paste this file, save, and run setupAssessmentSheet. Approve access.
 * 3. Deploy > New deployment > Web app.
 *    Execute as: Me
 *    Who has access: Anyone
 * 4. Copy the web app URL into public/site.config.js as assessmentWebhook.
 */
var SHEET_ID = "1AAWsUbvlNQmgloR_jGZBzkMBA-4X_ctqgT5LUskeBGc";
var HEADERS = [
  "Submitted at",
  "Email",
  "Job",
  "Role",
  "Score",
  "Total",
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
  "s1",
  "s2",
];

function setupAssessmentSheet() {
  var spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  var sheet = spreadsheet.getSheetByName("Assessments");
  if (!sheet) sheet = spreadsheet.insertSheet("Assessments");
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  Logger.log("Assessments sheet: " + spreadsheet.getUrl());
}

function assessmentsSheet_() {
  var spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  var sheet = spreadsheet.getSheetByName("Assessments");
  if (!sheet) {
    setupAssessmentSheet();
    sheet = spreadsheet.getSheetByName("Assessments");
  }
  return sheet;
}

function hasAttempt_(email, job) {
  var needle = String(email || "").toLowerCase();
  var roleKey = String(job || "");
  if (!needle || !roleKey) return false;
  var values = assessmentsSheet_().getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    var rowEmail = String(values[i][1] || "").toLowerCase();
    var rowJob = String(values[i][2] || "");
    if (rowEmail === needle && rowJob === roleKey) return true;
  }
  return false;
}

function doGet(e) {
  var email = e && e.parameter ? e.parameter.email : "";
  var job = e && e.parameter ? e.parameter.job : "";
  return ContentService.createTextOutput(
    JSON.stringify({ already: hasAttempt_(email, job) }),
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  var email = String(body.email || "").toLowerCase();
  var job = String(body.job || "");
  if (hasAttempt_(email, job)) {
    return ContentService.createTextOutput(JSON.stringify({ duplicate: true })).setMimeType(
      ContentService.MimeType.JSON,
    );
  }
  var answers = body.answers || {};
  assessmentsSheet_().appendRow([
    new Date(),
    email,
    job,
    body.role || "",
    body.score || 0,
    body.total || 0,
    answers.q1 || "",
    answers.q2 || "",
    answers.q3 || "",
    answers.q4 || "",
    answers.q5 || "",
    answers.q6 || "",
    answers.q7 || "",
    answers.q8 || "",
    answers.q9 || "",
    answers.q10 || "",
    answers.s1 || "",
    answers.s2 || "",
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
    ContentService.MimeType.JSON,
  );
}
