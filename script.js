/* 
 * CACTUS CLUB - INTERACTIVITY SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 0. Preloader Handling
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 1200);
    }

    // 0.1 Force Play Hero Video (Robust cross-browser autoplay)
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        // Ensure critical attributes are set programmatically as well
        heroVideo.muted = true;
        heroVideo.loop = true;
        heroVideo.playsInline = true;

        function tryPlay() {
            const playPromise = heroVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Autoplay blocked — reload source and wait for interaction
                    heroVideo.load();
                });
            }
        }

        // Try immediately
        tryPlay();

        // Try again once metadata is loaded
        heroVideo.addEventListener('loadedmetadata', tryPlay, { once: true });

        // Try again once enough data is buffered
        heroVideo.addEventListener('canplay', tryPlay, { once: true });

        // On mobile, browsers often require a user gesture — play on first interaction
        function playOnInteraction() {
            tryPlay();
            document.removeEventListener('touchstart', playOnInteraction);
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('scroll', playOnInteraction);
        }
        document.addEventListener('touchstart', playOnInteraction, { passive: true });
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('scroll', playOnInteraction, { passive: true });

        // If video stalls or errors, reload and retry
        heroVideo.addEventListener('stalled', () => {
            heroVideo.load();
            tryPlay();
        });
        heroVideo.addEventListener('error', () => {
            setTimeout(() => {
                heroVideo.load();
                tryPlay();
            }, 1000);
        });
    }

    // 1. Navigation Scroll Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-up');
    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Smooth Parallax Effect with Visibility Optimization
    const parallaxElements = document.querySelectorAll('.parallax');
    let lastScrollY = -1;
    let isParallaxActive = false;

    function applyParallax() {
        if (!isParallaxActive) return;
        const scrolled = window.scrollY;
        if (scrolled !== lastScrollY) {
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-speed')) || 0.1;
                const yPos = -(scrolled * speed);
                el.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
            lastScrollY = scrolled;
        }
        requestAnimationFrame(applyParallax);
    }
    
    const parallaxObserver = new IntersectionObserver((entries) => {
        const isSomePartVisible = entries.some(e => e.isIntersecting);
        if (isSomePartVisible && !isParallaxActive) {
            isParallaxActive = true;
            requestAnimationFrame(applyParallax);
        } else if (!isSomePartVisible) {
            isParallaxActive = false;
        }
    }, { threshold: 0 });

    parallaxElements.forEach(el => parallaxObserver.observe(el));

    // 4. Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Booking Form Handling
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = bookingForm.querySelector('button');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Checking Availability...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Simulate API call
            setTimeout(() => {
                alert('Success! Your reservation request has been sent. We will contact you shortly.');
                bookingForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }, 2000);
        });
    }

    // 6. Mobile Nav Drawer
    const menuToggle = document.getElementById('menu-toggle');
    const navDrawer = document.getElementById('nav-drawer');
    const drawerLinks = navDrawer ? navDrawer.querySelectorAll('a') : [];
    const drawerReserveBtn = document.getElementById('drawer-reserve-btn');

    function openDrawer() {
        menuToggle.classList.add('open');
        navDrawer.classList.add('open');
        navDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
        menuToggle.classList.remove('open');
        navDrawer.classList.remove('open');
        navDrawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
        });
    }
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => { closeDrawer(); });
    });
    if (drawerReserveBtn) {
        drawerReserveBtn.addEventListener('click', () => {
            closeDrawer();
            setTimeout(() => {
                const contact = document.getElementById('contact');
                if (contact) contact.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        });
    }
    // 7. Full Menu Modal Logic
    const menuModal = document.getElementById('menu-modal');
    const openMenuButtons = [
        document.getElementById('open-menu-btn'),
        document.querySelector('.nav-links a[href="#menu"]'),
        document.querySelector('.cta-buttons a[href="#menu"]')
    ];
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const menuOverlay = menuModal ? menuModal.querySelector('.modal-overlay') : null;

    const openMenu = (e) => {
        if (e) e.preventDefault();
        menuModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        menuModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    openMenuButtons.forEach(btn => {
        if (btn) btn.addEventListener('click', openMenu);
    });

    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // 8. Full Gallery Modal Logic
    const galleryModal = document.getElementById('gallery-modal');
    const openGalleryBtns = [
        document.querySelector('.nav-links a[href="#gallery"]'),
        document.querySelector('.btn-link[href="#gallery"]')
    ];
    const closeGalleryBtn = document.getElementById('close-gallery-btn');
    const galleryOverlay = galleryModal ? galleryModal.querySelector('.modal-overlay') : null;

    const openGallery = (e) => {
        if (e) e.preventDefault();
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeGallery = () => {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    openGalleryBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', openGallery);
    });

    if (closeGalleryBtn) closeGalleryBtn.addEventListener('click', closeGallery);
    if (galleryOverlay) galleryOverlay.addEventListener('click', closeGallery);

    // ESC to close any modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (menuModal.classList.contains('active')) closeMenu();
            if (galleryModal.classList.contains('active')) closeGallery();
        }
    });
});
