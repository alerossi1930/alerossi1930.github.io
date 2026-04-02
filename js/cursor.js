// Disable custom cursor on touch devices
if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
  // stop script execution
  throw new Error("Touch device - cursor disabled");
}

const cursor = document.getElementById('cursor');

window.addEventListener('mousemove', (e)=>{
  cursor.style.top = e.clientY + 'px';
  cursor.style.left = e.clientX + 'px';
});

const interactive = document.querySelectorAll('a, button, .about-image img');

interactive.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('active');
  });

  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
  });
});

// text elements
const textElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6');

textElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('text');
  });

  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('text');
  });
});