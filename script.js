document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    // Smart Sticky Header
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    const scrollThreshold = 100; // Seuil minimum avant de commencer à cacher

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
            // Scroll vers le bas & on a dépassé le seuil -> Cacher
            header.classList.add('header-hidden');
        } else {
            // Scroll vers le haut ou tout en haut -> Montrer
            header.classList.remove('header-hidden');
        }

        // Mettre à jour la dernière position, en évitant les valeurs négatives (rebond iOS)
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });

    // Removed unused 3D drift effect (mousemove) to prevent Forced Reflow (Layout Thrashing)

    // Animations on scroll (Intersection Observer) - Optimized to prevent Forced Reflow
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is visible
    };

    const observer = new IntersectionObserver((entries) => {
        // Batch DOM reads and writes to prevent layout thrashing
        const elementsToAnimate = [];

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                elementsToAnimate.push(entry.target);
            }
        });

        // Use requestAnimationFrame to batch style changes
        if (elementsToAnimate.length > 0) {
            requestAnimationFrame(() => {
                elementsToAnimate.forEach(el => {
                    el.classList.add('animate-in');
                });
            });
        }
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.section-title, .card, .hero-content');
    hiddenElements.forEach(el => {
        el.classList.add('fade-in-element');
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
            const isActive = navLinks.classList.contains('active');

            // Batch all DOM changes together using requestAnimationFrame
            requestAnimationFrame(() => {
                navLinks.classList.toggle('active');
                overlay.classList.toggle('active');
                document.body.classList.toggle('menu-open');

                // Change icon
                if (!isActive) {
                    hamburgerBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                } else {
                    hamburgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                }
            });
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

    // See More Reviews Logic (Mobile) - Optimized to prevent Forced Reflow
    const seeMoreBtn = document.getElementById('see-more-reviews');
    if (seeMoreBtn) {
        seeMoreBtn.addEventListener('click', () => {
            requestAnimationFrame(() => {
                const hiddenReviews = document.querySelectorAll('.mobile-hidden-review');
                hiddenReviews.forEach(review => {
                    review.classList.add('reveal');
                });
                seeMoreBtn.classList.add('hidden'); // Hide button after click
            });
        });
    }
    // Reading Progress Bar Logic
    const article = document.querySelector('article');
    // On vérifie s'il y a une balise <article> (pages de blog)
    if (article) {
        // 1. Injecter le HTML de la barre
        const progressContainer = document.createElement('div');
        progressContainer.className = 'reading-progress-container';

        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress-bar';

        progressContainer.appendChild(progressBar);
        document.body.prepend(progressContainer);

        // 2. Mettre à jour la barre au scroll
        window.addEventListener('scroll', () => {
            // Hauteur totale du contenu de l'article - Hauteur de la fenêtre
            // On peut aussi baser ça sur toute la page (document.body.scrollHeight)
            // Ici, basons-nous sur toute la page pour simplifier et couvrir header/footer
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;

            // Calcul du pourcentage
            const scrollPercent = (scrollTop / docHeight) * 100;

            // Appliquer la largeur
            progressBar.style.width = `${scrollPercent}%`;
        }, { passive: true });
    }
});
