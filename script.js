/* --- DYNAMIC STARTUP & CONFIGURATION --- */
document.addEventListener('DOMContentLoaded', () => {
  // If the page is refreshed/reloaded, reset the splash screen state
  const navigationEntries = performance.getEntriesByType('navigation');
  if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
    sessionStorage.removeItem('splash_shown');
  }

  // If URL contains reset=true, clear session storage and show splash screen
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('reset') === 'true') {
    sessionStorage.removeItem('splash_shown');
    // Clear query parameter from URL bar to prevent reset on manual refresh
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Lock scrolling on entry if intro screen is present and has not been shown in this session
  const hasSplashShown = sessionStorage.getItem('splash_shown') === 'true';
  if (document.getElementById('intro-screen') && !hasSplashShown) {
    document.body.classList.add('scroll-lock');
  }

  // 1. Scroll Events & Navigation (Scroll-spy, header shrink)
  initNavigation();

  // 2. Start Particle Background
  initParticleBackground();

  // 4. Initialize Milestone Counters
  initMilestoneCounters();

  // 5. Initialize Scroll Reveals
  initScrollReveals();

  // 6. Initialize 3D Tilt Cards
  init3DTiltCards();



  // 8. Initialize Birthday Cake candles
  initBirthdayCake();

  // 9. Initialize Road Grid Scroll linkage
  initRoadScrollLink();

  // 10. Initialize Landing Intro Screen & Popup Modal
  initIntroAndPopup();

  // 11. Initialize Photo Gallery Lightbox
  initGalleryLightbox();

  // 12. Initialize Video Popup Modal
  initVideoPopup();

  // 13. Initialize My Network / Connect interactions
  initConnectPage();

  // 14. Initialize Candle Birthday Popup
  initCandlePopup();

  // 15. Initialize Hero Section Video Volume and Mute Toggle
  initHeroVideo();
});

/* --- LANDING INTRO & BIRTHDAY POPUP CONTROL --- */
function initIntroAndPopup() {
  const introScreen = document.getElementById('intro-screen');
  const introBtn = document.getElementById('intro-btn');
  const popupModal = document.getElementById('birthday-popup');
  const popupCloseBtn = document.getElementById('popup-close-btn');

  const hasSplashShown = sessionStorage.getItem('splash_shown') === 'true';
  if (introScreen && hasSplashShown) {
    introScreen.style.display = 'none';
  }

  if (introBtn && introScreen) {
    introBtn.addEventListener('click', () => {
      // Set session storage flag to prevent splash screen showing again
      sessionStorage.setItem('splash_shown', 'true');

      // Fade out intro screen immediately (0.4s transition)
      introScreen.classList.add('fade-out');
      setTimeout(() => {
        introScreen.style.display = 'none';
      }, 400);

      // Show birthday popup modal after exactly 1 second (1000ms)
      setTimeout(() => {
        if (popupModal) {
          popupModal.classList.add('show');
          // Trigger double side confetti poppers on popup modal load
          triggerSideConfettiPoppers();
          // Trigger floating balloons across the screen
          triggerBalloons();
        } else {
          document.body.classList.remove('scroll-lock');
        }
      }, 1000);
    });
  }

  if (popupCloseBtn && popupModal) {
    popupCloseBtn.addEventListener('click', () => {
      popupModal.classList.add('hide');
      
      // Instantly clear any floating balloons when closing the popup
      const activeBalloons = document.querySelector('.balloon-container');
      if (activeBalloons) {
        activeBalloons.remove();
      }

      setTimeout(() => {
        popupModal.classList.remove('show');
        popupModal.classList.remove('hide');
        document.body.classList.remove('scroll-lock');
      }, 400);
    });
  }
}

/* --- SCROLL EVENT CONTROLLERS --- */
function initNavigation() {
  const sections = document.querySelectorAll('.linkedin-card, section');
  const navLinks = document.querySelectorAll('.nav-link');

  // Check if we have any hash-based links in the nav menu to determine if we should spy
  const hasLocalLinks = Array.from(navLinks).some(link => {
    const href = link.getAttribute('href');
    return href && href.startsWith('#');
  });

  if (!hasLocalLinks) return;

  window.addEventListener('scroll', () => {
    // Scroll Spy active tracking
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= (sectionTop - 120)) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        link.classList.remove('active');
        if (href === '#' + current || (current === 'hero' && href === '#')) {
          link.classList.add('active');
        }
      }
    });
  });
}

/* --- CONFETTI EFFECTS (LINKEDIN BLUE, CHARCOAL & WHITE THEME) --- */
const themeColors = ['#0A66C2', '#191919', '#FFFFFF', '#004182'];

function initConfettiBurst() {
  // Disabled
}

function triggerHugeCelebrationConfetti() {
  // Disabled
}



/* --- PARTICLE BACKGROUND (LINKEDIN BLUE) --- */
function initParticleBackground() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null, radius: 120 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 30) + 1;
      this.opacity = Math.random() * 0.12 + 0.04;
      this.color = Math.random() > 0.4 ? 'rgba(10, 102, 194, ' : 'rgba(25, 25, 25, ';
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.fill();
    }

    update() {
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.hypot(dx, dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density * 0.6;
        let directionY = forceDirectionY * force * this.density * 0.6;

        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 20;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 20;
          }
        }
      } else {
        this.y -= 0.15;
        this.baseY -= 0.15;
        if (this.y < 0) {
          this.y = canvas.height;
          this.baseY = canvas.height;
          this.x = Math.random() * canvas.width;
          this.baseX = this.x;
        }
      }
    }
  }

  const particleCount = Math.min(60, Math.floor((canvas.width * canvas.height) / 25000));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* --- MILESTONE COUNTERS --- */
function initMilestoneCounters() {
  const statNumbers = document.querySelectorAll('.stat-num');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stat = entry.target;
        const target = parseFloat(stat.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();
        const startVal = 0;

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = progress * (2 - progress);
          
          let currentVal = startVal + easeProgress * (target - startVal);
          
          if (target % 1 === 0) {
            stat.textContent = Math.floor(currentVal).toLocaleString() + (stat.getAttribute('data-suffix') || '');
          } else {
            stat.textContent = currentVal.toFixed(1) + (stat.getAttribute('data-suffix') || '');
          }

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            stat.textContent = target.toLocaleString() + (stat.getAttribute('data-suffix') || '');
          }
        }

        requestAnimationFrame(updateCount);
        observer.unobserve(stat);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => {
    observer.observe(stat);
  });
}

/* --- SCROLL REVEALS --- */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
}

/* --- 3D TILT CARDS --- */
function init3DTiltCards() {
  const tiltCards = document.querySelectorAll('.car-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const width = rect.width;
      const height = rect.height;
      
      const rotateY = ((x / width) - 0.5) * 12;
      const rotateX = -((y / height) - 0.5) * 12;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.setProperty('--mouse-x', `${(x / width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });
}



/* --- BIRTHDAY CAKE INTERACTIONS --- */
function initBirthdayCake() {
  const cakeBox = document.querySelector('.cake-box');
  if (!cakeBox) return;

  const cake = document.getElementById('birthday-cake-interactive');
  if (!cake) return;

  const flames = cake.querySelectorAll('.flame');
  let blown = false;
  let candleTimeouts = [];

  // Click card to blow out / relight candles (toggles state)
  cakeBox.addEventListener('click', () => {
    if (!blown) {
      // Extinguish the candles (Blow out)
      blown = true;
      
      // Clear any pending timeouts
      candleTimeouts.forEach(clearTimeout);
      candleTimeouts = [];

      // Blow out candles with a staggered effect
      flames.forEach((flame, index) => {
        const t = setTimeout(() => {
          if (!flame.classList.contains('extinguished')) {
            flame.classList.add('extinguished');
          }
        }, index * 200);
        candleTimeouts.push(t);
      });

      // Update text to indicate wish is made
      const totalDuration = flames.length * 200;
      const tCelebration = setTimeout(() => {
        const finalGlow = document.querySelector('.cake-title');
        if (finalGlow) {
          finalGlow.textContent = "Wish Granted! 🎉🎂";
        }
      }, totalDuration + 200);
      candleTimeouts.push(tCelebration);
    } else {
      // Relight the candles
      blown = false;

      // Clear any pending timeouts
      candleTimeouts.forEach(clearTimeout);
      candleTimeouts = [];

      flames.forEach(flame => {
        flame.classList.remove('extinguished');
      });

      const finalGlow = document.querySelector('.cake-title');
      if (finalGlow) {
        finalGlow.textContent = "Make a Wish";
      }
    }
  });

  // Double click card to relight candles (fires again)
  cakeBox.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    
    // Clear any pending timeouts
    candleTimeouts.forEach(clearTimeout);
    candleTimeouts = [];

    blown = false;
    flames.forEach(flame => {
      flame.classList.remove('extinguished');
    });

    const finalGlow = document.querySelector('.cake-title');
    if (finalGlow) {
      finalGlow.textContent = "Make a Wish";
    }
  });
}

/* --- PARALLAX ROAD SCROLL LINK --- */
function initRoadScrollLink() {
  const roadGrid = document.querySelector('.road-grid');
  if (!roadGrid) return;

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    roadGrid.style.setProperty('--road-scroll', scrollPos * 0.95);
  });
}

/* --- PHOTO GALLERY LIGHTBOX --- */
function initGalleryLightbox() {
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item, .profile-gallery-item'));
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxClose = document.querySelector('.lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!lightbox || !lightboxImg) return;

  let currentIndex = 0;

  const updateLightbox = (index) => {
    currentIndex = index;
    const item = galleryItems[index];
    if (!item) return;

    const img = item.querySelector('img');
    const video = item.querySelector('video');
    const downloadBtn = document.getElementById('lightbox-download');

    if (img) {
      if (lightboxVideo) {
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.removeAttribute('src');
      }
      if (lightboxImg) {
        lightboxImg.style.display = 'block';
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
      }
      if (downloadBtn) {
        downloadBtn.href = img.src;
        const filename = img.src.substring(img.src.lastIndexOf('/') + 1);
        downloadBtn.download = filename;
      }
    } else if (video) {
      if (lightboxImg) {
        lightboxImg.style.display = 'none';
        lightboxImg.removeAttribute('src');
      }
      if (lightboxVideo) {
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = video.src;
        lightboxVideo.play();
      }
      if (downloadBtn) {
        downloadBtn.href = video.src;
        const filename = video.src.substring(video.src.lastIndexOf('/') + 1);
        downloadBtn.download = filename;
      }
    }
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      // If clicked on download button, do not open lightbox
      if (e.target.closest('.gallery-download-btn')) {
        return;
      }
      
      updateLightbox(index);
      lightbox.classList.add('show');
      document.body.classList.add('scroll-lock');
    });
  });

  const showPrev = (e) => {
    if (e) e.stopPropagation();
    let newIndex = currentIndex - 1;
    if (newIndex < 0) newIndex = galleryItems.length - 1;
    updateLightbox(newIndex);
  };

  const showNext = (e) => {
    if (e) e.stopPropagation();
    let newIndex = currentIndex + 1;
    if (newIndex >= galleryItems.length) newIndex = 0;
    updateLightbox(newIndex);
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', showPrev);
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', showNext);
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'Escape') closeLightbox();
  });

  const closeLightbox = () => {
    lightbox.classList.remove('show');
    document.body.classList.remove('scroll-lock');
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.removeAttribute('src');
    }
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

/* --- SIDE CONFETTI POPPERS --- */
function triggerSideConfettiPoppers() {
  if (typeof confetti !== 'undefined') {
    // Left side popper shooting up and right (towards center)
    confetti({
      particleCount: 65,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.8 },
      zIndex: 10005,
      colors: themeColors
    });
    // Right side popper shooting up and left (towards center)
    confetti({
      particleCount: 65,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.8 },
      zIndex: 10005,
      colors: themeColors
    });
  }
}

/* --- FLOATING BALLOONS EFFECT --- */
function triggerBalloons() {
  const container = document.createElement('div');
  container.className = 'balloon-container';
  document.body.appendChild(container);

  const balloonColors = ['#0A66C2', '#378fe9', '#FFD700', '#E03C3C', '#F28C38', '#00A896'];
  const totalBalloons = 12; // Fewer balloons for a clean look

  for (let i = 0; i < totalBalloons; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    
    const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    
    // Distribute half on the left side and half on the right side of the screen
    let leftPos;
    if (i < totalBalloons / 2) {
      // Left side: 2% to 22% of viewport width
      leftPos = 2 + Math.random() * 20;
    } else {
      // Right side: 78% to 96% of viewport width
      leftPos = 78 + Math.random() * 18;
    }

    const delay = Math.random() * 2.0; // staggered delay up to 2s
    const sizeScale = 0.7 + Math.random() * 0.45; // scale between 0.7 and 1.15
    const duration = 3.5 + Math.random() * 2.0; // float speed between 3.5s and 5.5s (faster float)
    const rotation = (Math.random() - 0.5) * 20; // rotation at top

    balloon.style.backgroundColor = color;
    balloon.style.left = `${leftPos}vw`;
    balloon.style.animationDelay = `${delay}s`;
    balloon.style.animationDuration = `${duration}s`;
    balloon.style.transform = `scale(${sizeScale})`;
    balloon.style.setProperty('--balloon-rotate', `${rotation}deg`);

    const string = document.createElement('div');
    string.className = 'balloon-string';
    balloon.appendChild(string);

    container.appendChild(balloon);
  }

  // Remove the container once all balloon animations finish
  setTimeout(() => {
    container.remove();
  }, 8000);
}

/* --- VIDEO TRIBUTE POPUP CONTROL --- */
function initVideoPopup() {
  const playVideoBtn = document.getElementById('play-video-btn');
  const videoPopup = document.getElementById('video-popup');
  const closeVideoBtn = document.getElementById('video-popup-close-btn');
  const tributeVideo = document.getElementById('tribute-video');

  if (playVideoBtn && videoPopup) {
    playVideoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      videoPopup.classList.add('show');
      document.body.classList.add('scroll-lock');
      if (tributeVideo) {
        tributeVideo.play().catch(err => {
          console.log("Autoplay was prevented, waiting for user interaction:", err);
        });
      }
    });
  }

  function closeVideoModal() {
    if (videoPopup) {
      videoPopup.classList.add('hide');
      setTimeout(() => {
        videoPopup.classList.remove('show');
        videoPopup.classList.remove('hide');
        document.body.classList.remove('scroll-lock');
      }, 400);
    }
    if (tributeVideo) {
      tributeVideo.pause();
      tributeVideo.currentTime = 0; // Reset video position
    }
  }

  if (closeVideoBtn) {
    closeVideoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeVideoModal();
    });
  }

  if (videoPopup) {
    const overlay = videoPopup.querySelector('.popup-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        closeVideoModal();
      });
    }
  }
}

/* --- CANDLE BIRTHDAY POPUP CONTROL --- */
function initCandlePopup() {
  const candlePopup = document.getElementById('candle-popup');
  const closeBtn = document.getElementById('candle-popup-close-btn');
  const cakeInteractive = document.getElementById('birthday-cake-interactive');
  
  if (!candlePopup) return;

  const candleItems = candlePopup.querySelectorAll('.candle-item');
  const tipText = document.getElementById('candle-tip-text');
  const popupTitle = candlePopup.querySelector('.candle-popup-title');

  // Function to open the candle popup
  function openCandlePopup() {
    candlePopup.classList.add('show');
    document.body.classList.add('scroll-lock');
    // Relight all candles automatically when opening
    relightAllCandles();
  }

  // Function to close the candle popup
  function closeCandlePopup() {
    candlePopup.classList.add('hide');
    // Clear URL hash without jumping page
    if (window.location.hash === '#tribute-hub') {
      history.replaceState("", document.title, window.location.pathname + window.location.search);
    }
    setTimeout(() => {
      candlePopup.classList.remove('show');
      candlePopup.classList.remove('hide');
      document.body.classList.remove('scroll-lock');
    }, 400);
  }

  // Function to extinguish all candles with visual glow-up effect
  function extinguishAllCandlesWithAnimation() {
    const litCandles = Array.from(candleItems).filter(item => item.classList.contains('lit'));
    if (litCandles.length === 0) return;
    
    // Add glow-up class to all lit candles for simulated breath effect
    litCandles.forEach(candleItem => {
      candleItem.classList.add('glow-up');
    });
    
    setTimeout(() => {
      // Blow out all candles
      litCandles.forEach((candleItem, index) => {
        // Remove glow-up and lit status
        candleItem.classList.remove('glow-up');
        candleItem.classList.remove('lit');
        
        const flame = candleItem.querySelector('.candle-flame');
        const glowBg = candleItem.querySelector('.glow-bg');
        
        if (flame) flame.classList.add('extinguished');
        if (glowBg) glowBg.classList.add('extinguished');
        
        // Staggered smoke spawn for more realistic effect
        setTimeout(() => {
          spawnSmoke(candleItem);
        }, index * 50);

        // Trigger confetti pop at each candle's position
        if (typeof confetti !== 'undefined') {
          const rect = candleItem.getBoundingClientRect();
          const x = (rect.left + rect.width / 2) / window.innerWidth;
          const y = (rect.top + rect.height / 2) / window.innerHeight;
          
          confetti({
            particleCount: 15,
            spread: 30,
            origin: { x, y },
            zIndex: 10005
          });
        }
      });
      
      if (tipText) tipText.innerHTML = "All wishes sent! 💖 Double click any candle to relight.";
      if (popupTitle) popupTitle.innerHTML = "Wish Granted! 🎂";
      
      // Trigger a grand celebration confetti burst!
      triggerGrandCelebration();
    }, 300); // 300ms glow animation
  }

  // Function to relight all candles
  function relightAllCandles() {
    candleItems.forEach(item => {
      item.classList.add('lit');
      const flame = item.querySelector('.candle-flame');
      const glowBg = item.querySelector('.glow-bg');
      if (flame) flame.classList.remove('extinguished');
      if (glowBg) glowBg.classList.remove('extinguished');
    });
    if (tipText) tipText.innerHTML = "Hover to glow, Click any candle to blow it out!";
    if (popupTitle) popupTitle.innerHTML = "Make a Wish, Dr. Pravin Sir! 🎂";
  }

  // Function to spawn dynamic rising smoke particles on a specific candle
  function spawnSmoke(candleItem) {
    if (!candleItem) return;
    
    // Spawn 5 smoke particles with staggered delays
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        // Stop spawning if the candle gets relit in the meantime
        if (candleItem.classList.contains('lit')) return;
        
        const smoke = document.createElement('div');
        smoke.className = 'smoke-particle';
        
        // Randomize initial position slightly
        const randomX = (Math.random() - 0.5) * 6;
        smoke.style.left = `calc(50% - 3px + ${randomX}px)`;
        smoke.style.bottom = `48px`; // Sits right at the wick tip
        smoke.classList.add('animate-smoke');
        
        candleItem.appendChild(smoke);
        
        // Clean up smoke particle after animation completes
        setTimeout(() => {
          smoke.remove();
        }, 1400);
      }, i * 200);
    }
  }

  // Trigger grand celebration confetti
  function triggerGrandCelebration() {
    if (typeof confetti !== 'undefined') {
      // 1. Center burst
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        zIndex: 10005
      });
      // 2. Left side burst
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.65 },
          zIndex: 10005
        });
      }, 200);
      // 3. Right side burst
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.65 },
          zIndex: 10005
        });
      }, 400);
    }
  }

  // Add event listeners to each individual candle
  candleItems.forEach(candleItem => {
    let clickTimeout = null;
    
    candleItem.addEventListener('click', (e) => {
      e.stopPropagation();
      
      if (clickTimeout !== null) {
        // Double click detected - clear single click check
        clearTimeout(clickTimeout);
        clickTimeout = null;
        return;
      }
      
      // Schedule single click check
      clickTimeout = setTimeout(() => {
        clickTimeout = null;
        // Click any candle blows out ALL candles
        const litCandles = Array.from(candleItems).filter(item => item.classList.contains('lit'));
        if (litCandles.length > 0) {
          extinguishAllCandlesWithAnimation();
        }
      }, 250); // 250ms window to catch double clicks
    });

    candleItem.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      if (clickTimeout !== null) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
      }
      // Double click any candle relights ALL candles
      relightAllCandles();
    });
  });

  // Close buttons and overlay
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeCandlePopup();
    });
  }

  const overlay = candlePopup.querySelector('.popup-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      closeCandlePopup();
    });
  }

  // Intercept click on Celebrate buttons
  document.body.addEventListener('click', (e) => {
    const tributeBtn = e.target.closest('a[href$="#tribute-hub"]');
    if (tributeBtn) {
      const candlePopup = document.getElementById('candle-popup');
      if (candlePopup) {
        // We are on index.html, intercept and show popup directly
        e.preventDefault();
        openCandlePopup();
      }
    }
  });

  // Check URL hash on page load
  if (window.location.hash === '#tribute-hub') {
    setTimeout(openCandlePopup, 600);
  }

  // Monitor dynamic hash changes
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#tribute-hub') {
      openCandlePopup();
    }
  });
}

/* --- CONNECT PAGE INTERACTIONS --- */
function initConnectPage() {
  const invitationsContainer = document.getElementById('invitations-list-container');
  if (!invitationsContainer) return;

  const sidebarConnections = document.getElementById('sidebar-connections-count');
  const headerInvitationCount = document.getElementById('invitation-count-header');
  
  let connectionsCount = 1284;
  let invitationsCount = 2;

  // Accept / Ignore Invitation
  invitationsContainer.addEventListener('click', (e) => {
    const acceptBtn = e.target.closest('.accept-invitation-btn');
    const ignoreBtn = e.target.closest('.ignore-invitation-btn');
    
    if (acceptBtn || ignoreBtn) {
      const isAccept = !!acceptBtn;
      const btn = acceptBtn || ignoreBtn;
      const itemId = btn.getAttribute('data-id');
      const item = document.getElementById(`invitation-${itemId}`);
      
      if (item) {
        // Fade out animation
        item.classList.add('fade-out');
        
        setTimeout(() => {
          item.remove();
          
          // Decrement pending count
          invitationsCount--;
          if (headerInvitationCount) {
            headerInvitationCount.textContent = `Invitations (${invitationsCount})`;
          }
          
          // If accepted, increment connection count
          if (isAccept) {
            connectionsCount++;
            if (sidebarConnections) {
              sidebarConnections.textContent = connectionsCount.toLocaleString();
            }
          }
          
          // Check if all invitations are completed
          if (invitationsCount === 0) {
            invitationsContainer.innerHTML = `
              <div style="padding: 30px 20px; text-align: center; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <i class="fas fa-circle-check" style="font-size: 36px; color: #137333;"></i>
                <h3 style="font-size: 15px; font-weight: 600; color: var(--text-primary); margin: 0;">You're all caught up!</h3>
                <p style="font-size: 13px; margin: 0;">No pending invitations at this time.</p>
              </div>
            `;
            const headerSeeAll = document.querySelector('.invitations-header a');
            if (headerSeeAll) headerSeeAll.remove();
          }
        }, 400);
      }
    }
  });

  // Suggestion Connect Button Toggle
  const suggestionsGrid = document.querySelector('.connection-suggestions-grid');
  if (suggestionsGrid) {
    suggestionsGrid.addEventListener('click', (e) => {
      const connectBtn = e.target.closest('.suggestion-connect-btn');
      if (connectBtn) {
        if (!connectBtn.classList.contains('pending')) {
          connectBtn.classList.add('pending');
          connectBtn.innerHTML = `Pending`;
        } else {
          connectBtn.classList.remove('pending');
          connectBtn.innerHTML = `<i class="fas fa-user-plus"></i> Connect`;
        }
      }
    });
  }
}

/* --- HERO VIDEO MUTE/UNMUTE INTERACTION --- */
function initHeroVideo() {
  const video = document.querySelector('.hero-cover-video');
  const muteBtn = document.querySelector('.hero-mute-btn');
  if (!video || !muteBtn) return;

  // Set initial volume to 70%
  video.volume = 0.7;

  // Retrieve persistent mute state from localStorage (default to muted = true on very first load)
  let savedMuteState = localStorage.getItem('hero_video_muted');
  let startMuted = (savedMuteState === null) ? true : (savedMuteState === 'true');

  const setMuteState = (shouldMute) => {
    video.muted = shouldMute;
    localStorage.setItem('hero_video_muted', shouldMute ? 'true' : 'false');
    if (shouldMute) {
      muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
      muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
  };

  // Set initial player state
  video.muted = startMuted;

  // Modern browsers block autoplay with sound. Try playing based on saved mute state:
  video.play().then(() => {
    setMuteState(video.muted);
  }).catch((error) => {
    // Autoplay failed or blocked. Force mute so it autoplays.
    video.muted = true;
    video.play();
    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  });

  // If user wants it unmuted but browser blocked audio on load, unmute on first user click anywhere on the page
  if (!startMuted) {
    const unmuteOnInteraction = () => {
      if (video.muted) {
        video.muted = false;
        video.volume = 0.7;
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      }
      document.removeEventListener('click', unmuteOnInteraction);
    };
    document.addEventListener('click', unmuteOnInteraction);
  }

  // Click on the mute button toggles state explicitly
  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const newMuteState = !video.muted;
    setMuteState(newMuteState);
  });
}
