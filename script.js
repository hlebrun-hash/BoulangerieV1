document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    // Header Scroll Effect - Optimized with Intersection Observer
    const header = document.querySelector('header');
    const scrollTrigger = document.getElementById('scroll-trigger');

    if (header && scrollTrigger) {
        const headerObserver = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (!entry.isIntersecting) {
                // Scrolled down
                header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            } else {
                // At the top
                header.style.boxShadow = 'none';
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }
        }, { threshold: 0 });

        headerObserver.observe(scrollTrigger);
    }

    // Removed unused 3D drift effect (mousemove) to prevent Forced Reflow (Layout Thrashing)

    // Animations on scroll (Intersection Observer)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.section-title, .card, .hero-content');
    hiddenElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });
    // Mobile Menu Logic
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');

    if (nav && navLinks) {
        // Create Hamburger Button
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.classList.add('mobile-menu-btn');
        hamburgerBtn.setAttribute('aria-label', 'Ouvrir le menu');
        hamburgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        nav.appendChild(hamburgerBtn);

        // Create Overlay
        const overlay = document.createElement('div');
        overlay.classList.add('mobile-nav-overlay');
        document.body.appendChild(overlay);

        function toggleMenu() {
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');

            // Change icon
            if (navLinks.classList.contains('active')) {
                hamburgerBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            } else {
                hamburgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                document.body.style.overflow = '';
            }
        }

        hamburgerBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) toggleMenu();
            });
        });
    }

    // See More Reviews Logic (Mobile)
    const seeMoreBtn = document.getElementById('see-more-reviews');
    if (seeMoreBtn) {
        seeMoreBtn.addEventListener('click', () => {
            const hiddenReviews = document.querySelectorAll('.mobile-hidden-review');
            hiddenReviews.forEach(review => {
                review.classList.add('reveal');
            });
            seeMoreBtn.style.display = 'none'; // Hide button after click
        });
    }
});
