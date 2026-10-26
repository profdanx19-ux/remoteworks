(function () {
  const name = window.siteConfig.name;

  document.querySelectorAll("[data-site-name]").forEach((element) => {
    const template = element.getAttribute("data-site-name") || "{name}";
    element.textContent = template.replaceAll("{name}", name);
  });

  const title = document.body.getAttribute("data-title");
  if (title) {
    document.title = title.replaceAll("{name}", name);
  }

  const description = document.querySelector('meta[name="description"]');
  const template = description?.getAttribute("data-template");
  if (description && template) {
    description.content = template.replaceAll("{name}", name);
  }
})();
