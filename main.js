// SCROLL PROGRESS
const progress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  progress.style.width = pct + '%';
  // back to top
  const bt = document.getElementById('backTop');
  bt.classList.toggle('visible', window.scrollY > 500);
  // nav active
  const secs = ['hero','about','skills','projects','process','testimonials','contact'];
  secs.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) link.classList.toggle('active', rect.top <= 100 && rect.bottom > 100);
  });
});
document.getElementById('backTop').addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

// HERO PHOTO LOAD
const heroPhoto = document.getElementById('heroPhoto');
if (heroPhoto.complete) heroPhoto.classList.add('loaded');
else heroPhoto.addEventListener('load', () => heroPhoto.classList.add('loaded'));

// SCROLL REVEAL
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// SKILL BARS
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const pct = bar.dataset.pct;
        bar.style.width = pct + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('#skills').forEach(s => skillObserver.observe(s));

// COUNTER ANIMATION
function animateCounter(el, target) {
  let start = 0;
  const step = target / 60;
  const interval = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target + '+'; clearInterval(interval); }
    else el.textContent = Math.floor(start) + '+';
  }, 25);
}
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statsObserver.observe(document.querySelector('.hero-stats'));

// CONTACT FORM
document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button');
  btn.textContent = 'Sending...';
  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      document.getElementById('formSuccess').style.display = 'block';
      btn.textContent = 'Sent ✓';
      btn.style.background = '#1a4a2a';
      form.reset();
    } else {
      btn.textContent = 'Error!';
      btn.style.background = '#7a1a1a';
    }
  } catch (error) {
    btn.textContent = 'Error!';
    btn.style.background = '#7a1a1a';
  }
});

// PROJECT IMAGE HOVER — smooth reveal of full image
document.querySelectorAll('.project-card').forEach(card => {
  const imgContainer = card.querySelector('.project-img');
  const img = card.querySelector('.project-img-bg img');

  card.addEventListener('mouseenter', () => {
    const fullHeight = img.getBoundingClientRect().height ||
                       (img.naturalHeight / img.naturalWidth) * imgContainer.offsetWidth;
    imgContainer.style.height = fullHeight + 'px';
  });

  card.addEventListener('mouseleave', () => {
    imgContainer.style.height = '220px';
  });
});
