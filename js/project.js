const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxVideo = document.getElementById('lightboxVideo');
const closeBtn = document.getElementById('lightboxClose');

const imgs = document.querySelectorAll('.project-gallery img, .project-gallery video');

imgs.forEach(el => {
  el.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (el.tagName === 'IMG') {
      lightboxImg.src = el.src;
      lightboxImg.style.display = 'block';

      lightboxVideo.style.display = 'none';
      lightboxVideo.pause();
    }

    if (el.tagName === 'VIDEO') {
      lightboxVideo.src = el.src;
      lightboxVideo.style.display = 'block';
      lightboxVideo.play();

      lightboxImg.style.display = 'none';
    }
  });
});

closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
  document.body.style.overflow = '';

  lightboxVideo.pause();
});

lightbox.addEventListener('click', (e) => {
  if(e.target === lightbox){
    lightbox.style.display = 'none';
    document.body.style.overflow = '';

    lightboxVideo.pause();
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