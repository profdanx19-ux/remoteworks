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

function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  var answers = body.answers || {};
  var spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  var sheet = spreadsheet.getSheetByName("Assessments");
  if (!sheet) {
    setupAssessmentSheet();
    sheet = spreadsheet.getSheetByName("Assessments");
  }
  sheet.appendRow([
    new Date(),
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
