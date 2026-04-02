window.addEventListener("scroll", function() {

  const navbar = document.querySelector(".navbar");
  const heroHeight = document.querySelector(".hero-img").offsetHeight;

  if (window.scrollY > heroHeight - 80) {
    navbar.classList.add("navbar-scrolled");
  } else {
    navbar.classList.remove("navbar-scrolled");
  }

});