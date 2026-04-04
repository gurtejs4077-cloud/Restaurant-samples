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

    // 3. Simple Parallax Effect
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Background Text Parallax
        const bgText = document.querySelector('.parallax-bg-text');
        if (bgText) {
            bgText.style.transform = `translate(-50%, -${50 + (scrolled * 0.05)}%) rotate(${(scrolled * 0.01)}deg)`;
        }

        // Image Parallax
        const parallaxImages = document.querySelectorAll('.parallax');
        parallaxImages.forEach(img => {
            const speed = img.getAttribute('data-speed') || 0.1;
            const yPos = -(scrolled * speed);
            img.style.transform = `translateY(${yPos}px)`;
        });
    });

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

    // 6. Mobile Menu Toggle (Simplified)
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active-mobile');
            // Inline style for quick demonstration
            if (navLinks.classList.contains('active-mobile')) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(10, 10, 10, 0.95)';
                navLinks.style.padding = '20px';
                navLinks.style.backdropFilter = 'blur(10px)';
            } else {
                navLinks.style.display = '';
            }
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
