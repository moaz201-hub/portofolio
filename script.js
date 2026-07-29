document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (sections.length > 0 && navLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  const themeToggleBtn = document.getElementById('theme-toggle-button');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    htmlElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    htmlElement.classList.remove('dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      htmlElement.classList.toggle('dark');
      const isDark = htmlElement.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  const filterBtns = document.querySelectorAll('.portfolio-filter, .portfolio-tab-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach((item) => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  const carouselTrack = document.getElementById('testimonials-carousel');
  const testimonialCards = document.querySelectorAll('.testimonial-card, .testimonial-slide');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  let currentSlideIndex = 0;

  function updateCarousel() {
    if (carouselTrack && testimonialCards.length > 0) {
      const cardWidth = testimonialCards[0].offsetWidth;
      carouselTrack.style.transform = `translateX(-${currentSlideIndex * cardWidth}px)`;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentSlideIndex < testimonialCards.length - 1) {
        currentSlideIndex++;
      } else {
        currentSlideIndex = 0;
      }
      updateCarousel();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentSlideIndex > 0) {
        currentSlideIndex--;
      } else {
        currentSlideIndex = testimonialCards.length - 1;
      }
      updateCarousel();
    });
  }

  window.addEventListener('resize', updateCarousel);

  const gearBtn = document.getElementById('settings-toggle');
  const sidebar = document.getElementById('settings-sidebar');
  const closeBtn = document.getElementById('reset-settings-dir') || sidebar?.querySelector('button:first-child');
  const fontBtns = document.querySelectorAll('[data-font]');
  const colorBtns = document.querySelectorAll('[data-color]');
  const resetBtn = document.getElementById('reset-settings') || document.querySelector('button:has(.fa-rotate-left), button:has(.fa-undo)');

  const colorMap = {
    'orange': '#f97316',
    'blue': '#3b82f6',
    'green': '#10b981',
    'purple': '#8b5cf6',
    'red': '#ef4444',
    'indigo': '#6366f1',
    'emerald': '#10b981',
    'amber': '#f59e0b'
  };

  if (gearBtn && sidebar) {
    gearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('translate-x-full');
      sidebar.classList.toggle('translate-x-0');
      
      const isOpen = !sidebar.classList.contains('translate-x-full');
      gearBtn.setAttribute('aria-expanded', isOpen);
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.add('translate-x-full');
      sidebar.classList.remove('translate-x-0');
      if (gearBtn) gearBtn.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('click', (e) => {
    if (sidebar && !sidebar.classList.contains('translate-x-full')) {
      if (!sidebar.contains(e.target) && !gearBtn?.contains(e.target)) {
        sidebar.classList.add('translate-x-full');
        sidebar.classList.remove('translate-x-0');
        if (gearBtn) gearBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  function applyFont(fontName) {
    document.body.style.fontFamily = `'${fontName}', sans-serif`;
    
    fontBtns.forEach((btn) => {
      const isSelected = btn.getAttribute('data-font') === fontName;
      btn.classList.toggle('border-primary', isSelected);
      btn.classList.toggle('border-slate-700', !isSelected);
      
      const checkIcon = btn.querySelector('.fa-check, .check-icon');
      if (checkIcon) checkIcon.style.display = isSelected ? 'block' : 'none';
    });
  }

  fontBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const font = btn.getAttribute('data-font');
      if (font) {
        applyFont(font);
        localStorage.setItem('selected-font', font);
      }
    });
  });

  function applyColor(colorVal) {
    const hexVal = colorMap[colorVal] || colorVal;
    
    document.documentElement.setAttribute('data-theme-color', colorVal);
    document.documentElement.style.setProperty('--color-primary', hexVal);

    colorBtns.forEach((btn) => {
      const isSelected = btn.getAttribute('data-color') === colorVal;
      btn.classList.toggle('ring-2', isSelected);
      btn.classList.toggle('ring-offset-2', isSelected);
      btn.classList.toggle('ring-primary', isSelected);
    });
  }

  colorBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      if (color) {
        applyColor(color);
        localStorage.setItem('selected-color', color);
      }
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem('selected-font');
      localStorage.removeItem('selected-color');
      
      applyFont('Tajawal');
      applyColor('orange');
    });
  }

  const savedFont = localStorage.getItem('selected-font') || 'Tajawal';
  const savedColor = localStorage.getItem('selected-color') || 'orange';

  applyFont(savedFont);
  applyColor(savedColor);

  const scrollTopBtn = document.getElementById('scroll-to-top');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.remove('hidden', 'opacity-0', 'invisible');
        scrollTopBtn.classList.add('opacity-100', 'visible');
      } else {
        scrollTopBtn.classList.add('opacity-0', 'invisible');
        scrollTopBtn.classList.remove('opacity-100', 'visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});