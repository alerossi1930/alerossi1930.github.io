const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.getElementById('lightboxClose');

const imgs = document.querySelectorAll('.project-gallery img');

imgs.forEach(img => {
  img.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    lightboxImg.src = img.src;
    document.body.style.overflow = 'hidden';
  });
});

closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
  document.body.style.overflow = '';
});

lightbox.addEventListener('click', (e) => {
  if(e.target === lightbox){
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }
});

const type = document.body.dataset.type;
const title = document.getElementById('project-title');

if(type && title){
  const span = document.createElement('span');
  span.textContent = ' — ' + type;
  span.style.opacity = '0.6';
  span.style.marginLeft = '6px';
  title.appendChild(span);
}