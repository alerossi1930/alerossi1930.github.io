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

  setupLightbox(project.images, project.title);
});

function setupLightbox(images, title) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.querySelector(".lightbox-close");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");
  const imagesWrap = document.getElementById("projectImages");
  if (!lightbox || !lightboxImg || !imagesWrap) return;

  const showNav = images.length > 1;
  prevBtn.hidden = !showNav;
  nextBtn.hidden = !showNav;

  let current = 0;

  function show(index) {
    current = (index + images.length) % images.length;
    lightboxImg.src = images[current];
    lightboxImg.alt = title;
  }

  function open(index) {
    show(index);
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  imagesWrap.querySelectorAll("img").forEach((img, index) => {
    img.addEventListener("click", () => open(index));
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(current - 1));
  nextBtn.addEventListener("click", () => show(current + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft" && showNav) show(current - 1);
    if (e.key === "ArrowRight" && showNav) show(current + 1);
  });
}
