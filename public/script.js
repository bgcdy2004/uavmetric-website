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
