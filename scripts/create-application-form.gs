/**
 * Paste this into https://script.google.com as a new project, then click Run.
 * The execution log prints the form link, the three role links, and the spreadsheet link.
 */
function buildApplicationForm() {
  const form = FormApp.create("RemoteStaff Hub application");

  form.setDescription(
    "Tell us how to reach you and what relevant experience you have. If your application is a fit, we will email the assessment link for this role.",
  );
  form.setConfirmationMessage(
    "Application received. We will review and send your assessment link within 24 hours.",
  );
  form.setAllowResponseEdits(false);
  form.setShowLinkToRespondAgain(false);
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setProgressBar(true);

  form.addTextItem().setTitle("Full name").setRequired(true);

  const email = form.addTextItem().setTitle("Email").setRequired(true);
  email.setValidation(
    FormApp.createTextValidation()
      .requireTextIsEmail()
      .setHelpText("Enter a valid email address.")
      .build(),
  );

  form.addTextItem().setTitle("Phone").setRequired(true);
  form.addTextItem().setTitle("Country").setRequired(true);
  form.addTextItem().setTitle("City").setRequired(true);

  form
    .addMultipleChoiceItem()
    .setTitle("Hours available per week")
    .setChoiceValues(["10–20", "20–30", "30–40", "40+"])
    .setRequired(true);

  form
    .addMultipleChoiceItem()
    .setTitle("When you can start")
    .setChoiceValues(["Immediately", "Within 1 week", "Within 2 weeks", "Within a month"])
    .setRequired(true);

  form
    .addMultipleChoiceItem()
    .setTitle("Home internet")
    .setChoiceValues(["Reliable", "Sometimes drops", "Unreliable"])
    .setRequired(true);

  const role = form
    .addMultipleChoiceItem()
    .setTitle("Role")
    .setChoiceValues(["Data Entry Specialist", "Transcriptionist", "Virtual Assistant"])
    .setRequired(true);

  form
    .addParagraphTextItem()
    .setTitle("Relevant experience")
    .setHelpText("Tools you use, similar work you have done, and languages you work in.")
    .setRequired(true);

  const spreadsheet = SpreadsheetApp.create("RemoteStaff Hub applications");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

  const links = [
    ["Public form", form.getPublishedUrl()],
    ["Edit form", form.getEditUrl()],
    ["Spreadsheet", spreadsheet.getUrl()],
    ["Data Entry", prefilledUrl_(form, role, "Data Entry Specialist")],
    ["Transcriptionist", prefilledUrl_(form, role, "Transcriptionist")],
    ["Virtual Assistant", prefilledUrl_(form, role, "Virtual Assistant")],
  ];

  links.forEach(function (row) {
    console.log(row[0] + ": " + row[1]);
  });

  return links;
}

function prefilledUrl_(form, roleItem, roleName) {
  const response = form.createResponse();
  response.withItemResponse(roleItem.createResponse(roleName));
  return response.toPrefilledUrl();
}
