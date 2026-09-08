document.addEventListener("DOMContentLoaded", () => {
  const titleEl = document.getElementById("projectTitle");
  const imagesWrap = document.getElementById("projectImages");
  if (!titleEl || !imagesWrap || typeof PROJECTS === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const index = Math.max(
    0,
    PROJECTS.findIndex((p) => p.slug === slug)
  );
  const project = PROJECTS[index];

  document.title = `${project.title} — Alessandro Rossi`;
  titleEl.textContent = project.title;
  document.getElementById("projectYear").textContent = project.year;
  document.getElementById("projectTags").textContent = project.tags.join(", ");

  const pageUrl = `https://alessandroillustra.it/project.html?slug=${encodeURIComponent(project.slug)}`;
  const description = `${project.title} — ${project.tags.join(", ")} illustration project by Alessandro Rossi.`;
  const cover = new URL(project.cover || project.images[0], window.location.href).href;
  document.getElementById("metaDescription")?.setAttribute("content", description);
  document.getElementById("canonicalLink")?.setAttribute("href", pageUrl);
  document.getElementById("ogTitle")?.setAttribute("content", `${project.title} — Alessandro Rossi`);
  document.getElementById("ogDescription")?.setAttribute("content", description);
  document.getElementById("ogUrl")?.setAttribute("content", pageUrl);
  document.getElementById("ogImage")?.setAttribute("content", cover);

  imagesWrap.innerHTML = "";
  project.images.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = project.title;
    imagesWrap.appendChild(img);
  });
});
