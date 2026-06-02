// CURSOR
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});
(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) *.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top = ry + 'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px'; cursor.style.height = '20px';
    cursorRing.style.width = '60px'; cursorRing.style.height = '60px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px'; cursor.style.height = '12px';
    cursorRing.style.width = '40px'; cursorRing.style.height = '40px';
  });
});

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

// PARALLAX HERO
document.getElementById('hero').addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 10;
  heroPhoto.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
});

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
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'Sending...';
  setTimeout(() => {
    document.getElementById('formSuccess').style.display = 'block';
    btn.textContent = 'Sent ✓';
    btn.style.background = '#1a4a2a';
    e.target.reset();
  }, 1200);
});
