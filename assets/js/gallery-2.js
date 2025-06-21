  document.addEventListener('DOMContentLoaded', () => {

    // Generate sliders based on configuration
    function generateSliders() {
      const container = document.getElementById('slider-container');
      
      // Create rows with 2 sliders each
      for (let i = 0; i < sliderConfigs.length; i += 2) {
        const row = document.createElement('div');
        row.className = 'gallery-row';
        
        // Add current and next slider to the row
        for (let j = 0; j < 2 && (i + j) < sliderConfigs.length; j++) {
          const config = sliderConfigs[i + j];
          const sliderWrapper = createSlider(config);
          row.appendChild(sliderWrapper);
        }
        
        container.appendChild(row);
      }
    }

    // Create a single slider from configuration
    function createSlider(config) {
      const wrapper = document.createElement('div');
      wrapper.className = 'slider-wrapper';
      
      const slider = document.createElement('div');
      slider.className = 'slider';
      slider.setAttribute('aria-label', config.title);
      slider.id = config.id;
      
      // Add title
      const title = document.createElement('div');
      title.className = 'slider-title';
      title.textContent = config.title;
      slider.appendChild(title);
      
      // Add before slides
      config.before.forEach((img, index) => {
        const slide = document.createElement('div');
        slide.className = `slide ${index === 0 ? 'active' : ''}`;
        slide.dataset.type = 'before';
        
        const imgEl = document.createElement('img');
        imgEl.src = img.src;
        imgEl.alt = img.alt;
        
        slide.appendChild(imgEl);
        slider.appendChild(slide);
      });
      
      // Add after slides
      config.after.forEach((img, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.dataset.type = 'after';
        
        const imgEl = document.createElement('img');
        imgEl.src = img.src;
        imgEl.alt = img.alt;
        
        slide.appendChild(imgEl);
        slider.appendChild(slide);
      });
      
      // Add navigation buttons
      const prevBtn = document.createElement('button');
      prevBtn.className = 'nav-btn prev';
      prevBtn.setAttribute('aria-label', 'Previous slide');
      prevBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      `;
      slider.appendChild(prevBtn);
      
      const nextBtn = document.createElement('button');
      nextBtn.className = 'nav-btn next';
      nextBtn.setAttribute('aria-label', 'Next slide');
      nextBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      `;
      slider.appendChild(nextBtn);
      
      // Add fullscreen buttons
      const fsEnter = document.createElement('button');
      fsEnter.className = 'fullscreen-btn fullscreen-enter';
      fsEnter.setAttribute('aria-label', 'Enter fullscreen');
      fsEnter.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
      `;
      slider.appendChild(fsEnter);
      
      const fsExit = document.createElement('button');
      fsExit.className = 'fullscreen-btn fullscreen-exit';
      fsExit.setAttribute('aria-label', 'Exit fullscreen');
      fsExit.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
        </svg>
      `;
      slider.appendChild(fsExit);
      
      // Add dots navigation
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'dots-container';
      
      const beforeDots = document.createElement('div');
      beforeDots.className = 'dots-before';
      
      config.before.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.index = index;
        dot.dataset.type = 'before';
        beforeDots.appendChild(dot);
      });
      
      const afterDots = document.createElement('div');
      afterDots.className = 'dots-after';
      afterDots.style.display = 'none';
      
      config.after.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.dataset.index = config.before.length + index;
        dot.dataset.type = 'after';
        afterDots.appendChild(dot);
      });
      
      dotsContainer.appendChild(beforeDots);
      dotsContainer.appendChild(afterDots);
      slider.appendChild(dotsContainer);
      
      // Add toggle buttons
      const toggleButtons = document.createElement('div');
      toggleButtons.className = 'toggle-buttons';
      
      const beforeBtn = document.createElement('button');
      beforeBtn.className = 'toggle-btn active';
      beforeBtn.dataset.show = 'before';
      beforeBtn.setAttribute('aria-pressed', 'true');
      beforeBtn.textContent = 'Before';
      toggleButtons.appendChild(beforeBtn);
      
      const afterBtn = document.createElement('button');
      afterBtn.className = 'toggle-btn';
      afterBtn.dataset.show = 'after';
      afterBtn.setAttribute('aria-pressed', 'false');
      afterBtn.textContent = 'After';
      toggleButtons.appendChild(afterBtn);
      
      slider.appendChild(toggleButtons);
      
      wrapper.appendChild(slider);
      return wrapper;
    }

    // Initialize all sliders
    function initSliders() {
      document.querySelectorAll('.slider').forEach(slider => {
        initSlider(slider);
      });
    }

    function initSlider(slider) {
      const slides = Array.from(slider.querySelectorAll('.slide'));
      const prevBtn = slider.querySelector('.prev');
      const nextBtn = slider.querySelector('.next');
      const toggleBtns = slider.querySelectorAll('.toggle-btn');
      const dots = slider.querySelectorAll('.dot');
      const fullscreenEnter = slider.querySelector('.fullscreen-enter');
      const fullscreenExit = slider.querySelector('.fullscreen-exit');
      let currentIndex = 0;
      let showingType = 'before';
      let currentSlides = slides.filter(slide => slide.dataset.type === showingType);

      function updateSlider() {
        // Update slides visibility
        slides.forEach((slide, i) => {
          const isActive = i === currentIndex;
          slide.classList.toggle('active', isActive);
          slide.setAttribute('aria-hidden', !isActive);
        });
        
        // Update toggle buttons
        toggleBtns.forEach(btn => {
          const active = btn.dataset.show === showingType;
          btn.classList.toggle('active', active);
          btn.setAttribute('aria-pressed', active);
        });
        
        // Update dots
        dots.forEach(dot => {
          const dotIndex = parseInt(dot.dataset.index);
          const dotType = dot.dataset.type;
          const isActive = dotIndex === currentIndex && dotType === showingType;
          dot.classList.toggle('active', isActive);
        });
        
        // Update arrow states
        currentSlides = slides.filter(slide => slide.dataset.type === showingType);
        const currentTypeIndex = currentSlides.findIndex(slide => slides.indexOf(slide) === currentIndex);
        
        prevBtn.classList.toggle('disabled', currentTypeIndex === 0);
        nextBtn.classList.toggle('disabled', currentTypeIndex === currentSlides.length - 1);
        
        // Show/hide dot groups based on current view
        const beforeDots = slider.querySelector('.dots-before');
        const afterDots = slider.querySelector('.dots-after');
        if (showingType === 'before') {
          beforeDots.style.display = 'flex';
          afterDots.style.display = 'none';
        } else {
          beforeDots.style.display = 'none';
          afterDots.style.display = 'flex';
        }
      }

      function toggleFullscreen() {
        if (slider.classList.contains('fullscreen')) {
          slider.classList.remove('fullscreen');
          document.body.style.overflow = 'auto';
        } else {
          slider.classList.add('fullscreen');
          document.body.style.overflow = 'hidden';
        }
      }

      function showSlide(index) {
        if (index >= 0 && index < slides.length) {
          currentIndex = index;
          updateSlider();
        }
      }

      function showFirstSlideOfType(type) {
        const filtered = slides.filter(slide => slide.dataset.type === type);
        if (filtered.length) {
          currentIndex = slides.indexOf(filtered[0]);
          showingType = type;
          updateSlider();
        }
      }

      function navigate(direction) {
        const filtered = slides.filter(slide => slide.dataset.type === showingType);
        let currentTypeIndex = filtered.findIndex(slide => slides.indexOf(slide) === currentIndex);
        
        if (direction === 'prev' && currentTypeIndex > 0) {
          currentTypeIndex--;
        } else if (direction === 'next' && currentTypeIndex < filtered.length - 1) {
          currentTypeIndex++;
        }
        
        currentIndex = slides.indexOf(filtered[currentTypeIndex]);
        updateSlider();
      }

      prevBtn.addEventListener('click', () => navigate('prev'));
      nextBtn.addEventListener('click', () => navigate('next'));

      toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.dataset.show !== showingType) {
            showFirstSlideOfType(btn.dataset.show);
          }
        });
      });

      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const index = parseInt(dot.dataset.index);
          const type = dot.dataset.type;
          showingType = type;
          showSlide(index);
        });
      });

      fullscreenEnter.addEventListener('click', toggleFullscreen);
      fullscreenExit.addEventListener('click', toggleFullscreen);

      // Keyboard navigation for focused slider
      slider.addEventListener('keydown', (e) => {
        if (document.activeElement.closest('.slider') === slider) {
          if (e.key === 'ArrowLeft') {
            navigate('prev');
          } else if (e.key === 'ArrowRight') {
            navigate('next');
          } else if (e.key === 'Escape' && slider.classList.contains('fullscreen')) {
            toggleFullscreen();
          } else if (e.key === 'f' || e.key === 'F') {
            toggleFullscreen();
          }
        }
      });

      // Initialize
      updateSlider();
    }

    // Generate and initialize all sliders
    generateSliders();
    initSliders();
  });

