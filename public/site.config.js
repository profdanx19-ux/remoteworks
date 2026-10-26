// Change the site name here. Save this file and refresh the page.
// assessmentWebhook is the Google Apps Script web app URL from scripts/save-assessments.gs.
const siteConfig = {
  name: "RemoteStaff Hub",
  assessmentWebhook: "",
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = siteConfig;
}
if (typeof window !== "undefined") {
  window.siteConfig = siteConfig;
}
