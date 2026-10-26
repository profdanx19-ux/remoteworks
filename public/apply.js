const forms = {
  data: "Data Entry Specialist",
  transcription: "Transcriptionist",
  assistant: "Virtual Assistant",
};

const formId = "1FAIpQLSe_kIrZCdpMBnteb-XyspzRpfpxDHKoivH02b6AKL-UkAlIlg";
const roleEntry = "entry.479843959";

const roleKey = new URLSearchParams(window.location.search).get("role");
const roleName = forms[roleKey] || "";
const unknown = document.querySelector("#unknown");
const apply = document.querySelector("#apply");
const frame = document.querySelector("#application-form");

let formReady = false;
frame.addEventListener("load", () => {
  if (!formReady) {
    formReady = true;
    return;
  }
  frame.classList.add("form-frame-done");
  const top = apply.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "instant" });
});

if (!roleName) {
  unknown.hidden = false;
} else {
  const src = new URL(`https://docs.google.com/forms/d/e/${formId}/viewform`);
  src.searchParams.set("embedded", "true");
  src.searchParams.set("usp", "pp_url");
  src.searchParams.set(roleEntry, roleName);
  document.title = `Apply · ${roleName} · ${window.siteConfig.name}`;
  document.querySelector("#role-label").textContent = roleName;
  frame.src = src.toString();
  apply.hidden = false;
}
