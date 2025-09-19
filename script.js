// Hamburger menu toggle
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Typewriter effect
class TypeWriter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }

  type() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    if(this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    let typeSpeed = 100;

    if(this.isDeleting) {
      typeSpeed /= 2;
    }

    if(!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if(this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Initialize typewriter effect
document.addEventListener('DOMContentLoaded', init);

function init() {
  const txtElement = document.querySelector('.typewrite');
  if(txtElement) {
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');
    new TypeWriter(txtElement, words, wait);
  }
}

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('show');
      
      // Add stagger effect for articles
      if(entry.target.classList.contains('article-container')) {
        const articles = entry.target.querySelectorAll('article');
        articles.forEach((article, index) => {
          article.style.transitionDelay = `${index * 0.1}s`;
          article.classList.add('show');
        });
      }
    }
  });
}, observerOptions);

// Elements to observe
document.addEventListener('DOMContentLoaded', () => {
  // Add animation classes to elements
  const animatedElements = [
    '.section-container',
    '.about-containers',
    '.details-container',
    '.experience-details-container',
    '.article-container',
    '.color-container',
    '.contact-info-upper-container'
  ];

  animatedElements.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('hidden');
      observer.observe(el);
    });
  });

  // Add animation to individual articles
  document.querySelectorAll('article').forEach(el => {
    el.classList.add('hidden');
  });

  // Parallax effect for profile image
  const profileImg = document.querySelector('.section__pic-container');
  if(profileImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * -0.5;
      profileImg.style.transform = `translateY(${parallax}px)`;
    });
  }

  // Smooth scroll behavior for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add magnetic effect to buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translate(0, 0)';
    });
  });

  // Dynamic gradient animation on mouse move
  const hero = document.querySelector('#profile');
  if(hero) {
    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPos = (clientX / innerWidth) * 100;
      const yPos = (clientY / innerHeight) * 100;
      
      hero.style.background = `radial-gradient(circle at ${xPos}% ${yPos}%, rgba(102, 126, 234, 0.1) 0%, transparent 50%)`;
    });
  }

  // Add floating animation to skills
  document.querySelectorAll('article').forEach((article, index) => {
    article.style.animationDelay = `${index * 0.2}s`;
  });

  // Progress bar on scroll
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    z-index: 1001;
    transition: width 0.3s ease;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = `${scrollPercentage}%`;
  });

  // Add cursor trail effect
  const coords = { x: 0, y: 0 };
  const circles = document.querySelectorAll('.circle');

  if(circles.length === 0) {
    // Create cursor trail circles
    for(let i = 0; i < 20; i++) {
      const circle = document.createElement('div');
      circle.className = 'circle';
      circle.style.cssText = `
        position: fixed;
        width: ${(20 - i) * 2}px;
        height: ${(20 - i) * 2}px;
        border-radius: 50%;
        background: rgba(102, 126, 234, ${0.03 * (20 - i)});
        pointer-events: none;
        z-index: 999;
        transform: translate(-50%, -50%);
      `;
      document.body.appendChild(circle);
    }
  }

  const updatedCircles = document.querySelectorAll('.circle');
  
  window.addEventListener('mousemove', (e) => {
    coords.x = e.clientX;
    coords.y = e.clientY;
  });

  function animateCircles() {
    let x = coords.x;
    let y = coords.y;
    
    updatedCircles.forEach((circle, index) => {
      circle.style.left = x - 12 + 'px';
      circle.style.top = y - 12 + 'px';
      
      circle.style.transform = `scale(${(updatedCircles.length - index) / updatedCircles.length})`;
      
      circle.x = x;
      circle.y = y;

      const nextCircle = updatedCircles[index + 1] || updatedCircles[0];
      x += (nextCircle.x - x) * 0.3;
      y += (nextCircle.y - y) * 0.3;
    });

    requestAnimationFrame(animateCircles);
  }

  animateCircles();
});