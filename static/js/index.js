/**
 * DreamWaQ++ Website Scripts
 */

document.addEventListener('DOMContentLoaded', function() {
  // Mobile navbar toggle
  const burger = document.querySelector('.navbar-burger');
  const menu = document.querySelector('.navbar-menu');

  if (burger && menu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('is-active');
      menu.classList.toggle('is-active');
    });
  }

  // Navigation pane toggle
  const navPane = document.getElementById('navPane');
  const navToggle = document.getElementById('navToggle');
  
  if (navToggle && navPane) {
    navToggle.addEventListener('click', () => {
      navPane.classList.toggle('collapsed');
    });
  }

  // Smooth scroll for navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Active section highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-25% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (id) {
          // Remove active class from all links
          navLinks.forEach(link => link.classList.remove('active'));
          // Add active class to corresponding link
          const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // Initialize carousels if present
  if (typeof bulmaCarousel !== 'undefined') {
    const carousels = bulmaCarousel.attach('.carousel', {
      slidesToScroll: 1,
      slidesToShow: 1,
      infinite: true,
      autoplay: false,
    });
  }

  // Initialize sliders if present  
  if (typeof bulmaSlider !== 'undefined') {
    bulmaSlider.attach();
  }

});

/**
 * Copy BibTeX to clipboard
 */
function copyBibtex() {
  const bibtexContent = document.getElementById('bibtex-content');
  const copyBtn = document.querySelector('.copy-button');
  
  if (bibtexContent && copyBtn) {
    const text = bibtexContent.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
      // Show success state
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
      copyBtn.classList.add('copied');
      
      // Reset after 2 seconds
      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        copyBtn.classList.remove('copied');
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand('copy');
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch (e) {
        console.error('Fallback copy failed:', e);
      }
      
      document.body.removeChild(textarea);
    });
  }
}

// Make functions globally available
window.copyBibtex = copyBibtex;
