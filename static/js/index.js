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
