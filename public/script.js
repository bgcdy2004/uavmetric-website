const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// Keep technical project work on the homepage and move the photography
// portfolio to its own dedicated page.
const isHomePage = location.pathname === '/' || location.pathname.endsWith('/index.html');
if (isHomePage) {
  const portfolio = document.getElementById('aerial-photography');
  if (portfolio) portfolio.remove();

  if (nav && !nav.querySelector('a[href="aerial-photography.html"]')) {
    const contactLink = [...nav.querySelectorAll('a')].find(a => a.getAttribute('href') === '#contact');
    const photographyLink = document.createElement('a');
    photographyLink.href = 'aerial-photography.html';
    photographyLink.textContent = 'Photography';
    if (contactLink) nav.insertBefore(photographyLink, contactLink);
    else nav.appendChild(photographyLink);
  }

  document.querySelectorAll('.service-detail').forEach(card => {
    if (card.textContent.includes('AERIAL IMAGING')) {
      const link = card.querySelector('.service-link');
      if (link) {
        link.href = 'aerial-photography.html';
        link.textContent = 'View aerial photography →';
      }
    }
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  quoteForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const status = document.getElementById('formStatus');
    const button = quoteForm.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending...';
    if (status) status.textContent = '';

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        body: new FormData(quoteForm),
        headers: { 'Accept': 'application/json' }
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Unable to send your request.');

      window.location.href = '/thank-you.html';
    } catch (error) {
      if (status) status.textContent = error.message || 'Something went wrong. Please email Cody@uavmetric.com.';
      button.disabled = false;
      button.textContent = originalText;
    }
  });
}


// In-page gallery lightbox
const galleryLinks = [...document.querySelectorAll('.aerial-photo-grid .aerial-photo')];
const lightbox = document.getElementById('galleryLightbox');
if (lightbox && galleryLinks.length) {
  const image = lightbox.querySelector('.gallery-lightbox-image');
  const close = lightbox.querySelector('.gallery-lightbox-close');
  const prev = lightbox.querySelector('.gallery-lightbox-prev');
  const next = lightbox.querySelector('.gallery-lightbox-next');
  let current = 0;
  const show = index => {
    current = (index + galleryLinks.length) % galleryLinks.length;
    const link = galleryLinks[current];
    const thumb = link.querySelector('img');
    image.src = link.getAttribute('href');
    image.alt = thumb ? thumb.alt : 'UAVMetric portfolio photograph';
  };
  const open = index => { show(index); lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false'); document.body.classList.add('lightbox-open'); close.focus(); };
  const hide = () => { lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden','true'); document.body.classList.remove('lightbox-open'); image.src=''; };
  galleryLinks.forEach((link,index)=>link.addEventListener('click',e=>{e.preventDefault();open(index);}));
  close.addEventListener('click',hide);
  prev.addEventListener('click',()=>show(current-1));
  next.addEventListener('click',()=>show(current+1));
  lightbox.addEventListener('click',e=>{if(e.target===lightbox)hide();});
  document.addEventListener('keydown',e=>{if(!lightbox.classList.contains('open'))return;if(e.key==='Escape')hide();if(e.key==='ArrowLeft')show(current-1);if(e.key==='ArrowRight')show(current+1);});
}
