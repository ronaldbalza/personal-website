/* ═══════════════════════════════════════════════════════
   NAV — scroll state + hamburger
═══════════════════════════════════════════════════════ */
function toggleMenu() {
  document.querySelector('.menu-links').classList.toggle('open');
  document.querySelector('.hamburger-icon').classList.toggle('open');
}

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  document.getElementById('desktop-nav').classList.toggle('scrolled', scrolled);
  document.getElementById('hamburger-nav').classList.toggle('scrolled', scrolled);

  // Scroll progress bar
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  document.getElementById('scrollProgress').style.width = pct + '%';
}, { passive: true });

// Close mobile menu when clicking outside
document.addEventListener('click', e => {
  const nav = document.getElementById('hamburger-nav');
  if (!nav.contains(e.target)) {
    document.querySelector('.menu-links')?.classList.remove('open');
    document.querySelector('.hamburger-icon')?.classList.remove('open');
  }
});

/* ═══════════════════════════════════════════════════════
   HERO CANVAS — particle network
═══════════════════════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth  || canvas.parentElement.offsetWidth;
    canvas.height = canvas.offsetHeight || canvas.parentElement.offsetHeight;
  }

  requestAnimationFrame(resize);
  window.addEventListener('resize', resize, { passive: true });

  const ACCENT = [14, 165, 233];  // rgb of --accent
  const COUNT  = 55;
  const LINK   = 140;
  const SPEED  = 0.35;

  const nodes = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * SPEED,
    vy: (Math.random() - 0.5) * SPEED,
    r:  Math.random() * 1.5 + 0.8,
    o:  Math.random() * 0.35 + 0.15,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update positions
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    // Draw edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK) {
          const alpha = (1 - dist / LINK) * 0.12;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT}, ${n.o})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
})();

/* ═══════════════════════════════════════════════════════
   TYPEWRITER — cycling role titles
═══════════════════════════════════════════════════════ */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const roles = ['Data Analyst', 'BI Developer', 'Data Storyteller', 'Insight Engineer'];
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const word = roles[ri];

    if (deleting) {
      el.textContent = word.slice(0, --ci);
    } else {
      el.textContent = word.slice(0, ++ci);
    }

    let delay = deleting ? 45 : 95;

    if (!deleting && ci === word.length) {
      delay = 2400;
      deleting = true;
    } else if (deleting && ci === 0) {
      deleting = false;
      ri = (ri + 1) % roles.length;
      delay = 320;
    }

    setTimeout(tick, delay);
  }

  // Start after hero entrance animations settle
  setTimeout(tick, 1200);
})();

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════════ */
(function initReveal() {
  const isMobile = window.innerWidth <= 500;
  if (isMobile) return; // CSS disables on mobile

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings by querying parent
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.querySelectorAll('.reveal')]
          : [entry.target];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.08}s`;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ═══════════════════════════════════════════════════════
   SKILL BARS — animate on scroll
═══════════════════════════════════════════════════════ */
(function initSkillBars() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
          setTimeout(() => {
            bar.style.width = bar.dataset.width + '%';
          }, i * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.skills-column').forEach(col => observer.observe(col));
})();

/* ═══════════════════════════════════════════════════════
   COUNT-UP NUMBERS
═══════════════════════════════════════════════════════ */
(function initCountUp() {
  function animateCount(el, target, duration) {
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target, 10);
        animateCount(entry.target, target, 1400);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.count-up').forEach(el => observer.observe(el));
})();

/* ═══════════════════════════════════════════════════════
   SMOOTH SCROLL for anchor links
═══════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
