// Sagar Shivaji Portfolio Website JS Logic

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initCommandPalette();
  initCustomCursor();
  initScrollAnimations();
  initProgressAndHeader();
  initAiWorkflow();
  
  // Initialize metrics if they exist on the page
  if (document.querySelectorAll('.metric-card').length > 0) {
    initMetricAnimations();
  }
});

/* ==========================================================================
   THEME SWITCHER
   ========================================================================== */
function initTheme() {
  const themeToggles = [
    document.getElementById('themeToggle'),
    document.getElementById('themeToggleMobile')
  ];
  const html = document.documentElement;

  // Retrieve theme from localStorage or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  themeToggles.forEach(toggle => {
    if (!toggle) return;
    toggle.addEventListener('click', (e) => {
      const btn = e.target.closest('.theme-toggle-btn');
      if (!btn) return;
      const targetTheme = btn.getAttribute('data-theme');
      setTheme(targetTheme);
    });
  });

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Sync all toggle button UI states
    themeToggles.forEach(toggle => {
      if (!toggle) return;
      const buttons = toggle.querySelectorAll('.theme-toggle-btn');
      buttons.forEach(btn => {
        if (btn.getAttribute('data-theme') === theme) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    });
  }
}

/* ==========================================================================
   NAVIGATION ACTIVE TAB STATE
   ========================================================================== */
function initNavigation() {
  const path = window.location.pathname;
  const navLinks = document.querySelectorAll('nav .nav-links a, .mobile-menu a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Check path alignments (root matches '/index.html' or '/')
    const isHomePath = path === '/' || path === '/index.html' || path.endsWith('/');
    const isLinkHome = href === '/' || href === '/index.html';
    
    if (isHomePath && isLinkHome) {
      link.classList.add('active');
    } else if (!isLinkHome && (path.includes(href) || (path.startsWith(href.replace('.html', ''))))) {
      link.classList.add('active');
    } else if (path.includes('/work/') && href === '/work.html') {
      // Keep 'Work' nav item highlighted when inside deep case study directories
      link.classList.add('active');
    } else if (path.includes('/research/') && href === '/research.html') {
      // Keep 'Research' nav item highlighted when inside deep research article directories
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   COMMAND PALETTE (⌘K)
   ========================================================================== */
function initCommandPalette() {
  const overlay = document.getElementById('commandOverlay');
  const input = document.getElementById('commandInput');
  const resultsContainer = document.getElementById('commandResults');
  if (!overlay || !input || !resultsContainer) return;
  
  // Event: Toggle command menu
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openCommand();
    }
  });

  // Close command palette
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeCommand();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeCommand();
    }
  });

  // Filter commands on typing
  input.addEventListener('input', () => {
    const filter = input.value.toLowerCase().trim();
    const items = resultsContainer.querySelectorAll('.command-item');
    let firstVisible = null;

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(filter)) {
        item.style.display = 'flex';
        if (!firstVisible) firstVisible = item;
      } else {
        item.style.display = 'none';
        item.classList.remove('active');
      }
    });

    // Automatically make the first visible item active
    items.forEach(item => item.classList.remove('active'));
    if (firstVisible) {
      firstVisible.classList.add('active');
    }
  });

  // Handle arrow keys and Enter inside results list
  input.addEventListener('keydown', (e) => {
    const items = Array.from(resultsContainer.querySelectorAll('.command-item:not([style*="display: none"])'));
    if (items.length === 0) return;

    let activeIndex = items.findIndex(item => item.classList.contains('active'));

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[activeIndex].classList.remove('active');
      activeIndex = (activeIndex + 1) % items.length;
      items[activeIndex].classList.add('active');
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[activeIndex].classList.remove('active');
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      items[activeIndex].classList.add('active');
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const activeItem = items[activeIndex];
      if (activeItem) {
        const action = activeItem.getAttribute('data-action');
        closeCommand();
        window.location.href = action;
      }
    }
  });

  // Click on command item
  resultsContainer.addEventListener('click', (e) => {
    const item = e.target.closest('.command-item');
    if (item) {
      const action = item.getAttribute('data-action');
      closeCommand();
      window.location.href = action;
    }
  });
}

function openCommand() {
  const overlay = document.getElementById('commandOverlay');
  const input = document.getElementById('commandInput');
  overlay.classList.add('active');
  input.value = '';
  
  // Show all items
  const items = overlay.querySelectorAll('.command-item');
  items.forEach((item, index) => {
    item.style.display = 'flex';
    if (index === 0) item.classList.add('active');
    else item.classList.remove('active');
  });

  setTimeout(() => input.focus(), 50);
}

function closeCommand() {
  const overlay = document.getElementById('commandOverlay');
  if (overlay) overlay.classList.remove('active');
}

/* ==========================================================================
   MOBILE NAVIGATION
   ========================================================================== */
function toggleMobileMenu() {
  const overlay = document.getElementById('mobileMenuOverlay');
  const menu = document.getElementById('mobileMenu');
  if (!menu || !overlay) return;
  const isOpen = menu.classList.contains('active');

  if (isOpen) {
    closeMobileMenu();
  } else {
    overlay.classList.add('active');
    menu.classList.add('active');
  }
}

function closeMobileMenu() {
  const overlay = document.getElementById('mobileMenuOverlay');
  const menu = document.getElementById('mobileMenu');
  if (overlay) overlay.classList.remove('active');
  if (menu) menu.classList.remove('active');
}

/* ==========================================================================
   CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  const dot = document.getElementById('customCursorDot');
  if (!cursor || !dot) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  // Track cursor position
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Instant dot movement
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // Smooth ring movement using lerp (linear interpolation)
  function animateRing() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Scale cursor on hover of clickable items
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a, button, .card, .case-card, .command-item, .workflow-step, .theme-toggle');
    if (target) {
      cursor.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('a, button, .card, .case-card, .command-item, .workflow-step, .theme-toggle');
    if (target) {
      cursor.classList.remove('hover');
    }
  });
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================================== */
let globalRevealObserver;

function initScrollAnimations() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  globalRevealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, options);

  triggerRevealCheck();
}

function triggerRevealCheck() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(reveal => {
    // If element is already on screen, reveal it directly
    const rect = reveal.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      reveal.classList.add('visible');
    } else {
      globalRevealObserver.observe(reveal);
    }
  });
}

/* ==========================================================================
   PROGRESS BAR & STICKY NAVBAR
   ========================================================================== */
function updateProgressBar() {
  const progressBar = document.getElementById('progressBar');
  if (!progressBar) return;
  const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollTotal > 0 ? (window.scrollY / scrollTotal) * 100 : 0;
  progressBar.style.width = progress + '%';
}

function initProgressAndHeader() {
  const navbar = document.getElementById('navbar');

  // Set initial reading progress
  updateProgressBar();

  window.addEventListener('scroll', () => {
    // Update reading progress bar
    updateProgressBar();

    // Add scroll style to navbar
    if (navbar) {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Update sticky case study sidebar active states
    updateStickySidebarState();
  });
}

function updateStickySidebarState() {
  const sections = document.querySelectorAll('.project-content-section');
  const navLinks = document.querySelectorAll('.sticky-nav a');
  if (sections.length === 0 || navLinks.length === 0) return;

  let activeSectionId = '';
  const scrollPos = window.scrollY + 160; // offset for navbar height + buffer

  sections.forEach(section => {
    // Use getBoundingClientRect to calculate absolute document-relative position
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    if (scrollPos >= sectionTop) {
      activeSectionId = section.getAttribute('id');
    }
  });

  if (activeSectionId) {
    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${activeSectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   METRICS COUNT-UP ANIMATION
   ========================================================================== */
let countUpObservers = [];

function initMetricAnimations() {
  const metricCards = document.querySelectorAll('.metric-card');
  if (metricCards.length === 0) return;

  // Clear previous observers
  countUpObservers.forEach(obs => obs.disconnect());
  countUpObservers = [];

  const countUpObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numbers = entry.target.querySelectorAll('.metric-number');
        numbers.forEach(num => animateCountUp(num));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  metricCards.forEach(card => {
    countUpObserver.observe(card);
    countUpObservers.push(countUpObserver);
  });
}

function animateCountUp(element) {
  const target = parseInt(element.getAttribute('data-target'), 10);
  const duration = 1600; // Animation duration in ms
  const frameRate = 1000 / 60; // 60 frames per second
  const totalFrames = Math.round(duration / frameRate);
  let frame = 0;

  const count = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    // Ease-out quad formula
    const easeProgress = progress * (2 - progress);
    const currentValue = Math.floor(easeProgress * target);

    element.textContent = currentValue;

    if (frame >= totalFrames) {
      element.textContent = target;
      clearInterval(count);
    }
  }, frameRate);
}

/* ==========================================================================
   AI WORKFLOW ACCORDION
   ========================================================================== */
function initAiWorkflow() {
  const steps = document.querySelectorAll('.workflow-step');
  const details = document.querySelectorAll('.ai-detail-card');

  steps.forEach(step => {
    step.addEventListener('click', () => {
      const stepIndex = step.getAttribute('data-step');
      const targetDetail = document.getElementById(`detailCard${stepIndex}`);
      if (!targetDetail) return;
      
      const isAlreadyActive = targetDetail.classList.contains('active');

      // Close all active details
      details.forEach(card => card.classList.remove('active'));

      if (!isAlreadyActive) {
        targetDetail.classList.add('active');
        // Smooth scroll details card into view if on mobile
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            targetDetail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 150);
        }
      }
    });
  });
}
