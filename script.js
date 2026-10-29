document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = navMenu ? [...navMenu.querySelectorAll('a[href^="#"]')] : [];
    const backToTop = document.getElementById('back-to-top');
    const animateElements = document.querySelectorAll('[data-animate]');
    const contactForm = document.getElementById('contact-form');

    const setMenuOpen = (isOpen) => {
        if (!navMenu || !navToggle) return;
        navMenu.classList.toggle('show-menu', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    };

    if (navToggle && navMenu) navToggle.addEventListener('click', () => {
        setMenuOpen(!navMenu.classList.contains('show-menu'));
    });

    navClose?.addEventListener('click', () => {
        setMenuOpen(false);
        navToggle?.focus({ preventScroll: true });
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu?.classList.contains('show-menu')) {
            setMenuOpen(false);
            navToggle?.focus();
        }
    });

    const updateScrollState = () => {
        const scrollPosition = window.scrollY;
        const headerHeight = header?.offsetHeight ?? 0;

        header?.classList.toggle('scrolled', scrollPosition > 50);
        backToTop?.classList.toggle('is-visible', scrollPosition > 400);

        const activeLink = navLinks
            .map((link) => {
                const target = document.getElementById(link.hash.slice(1));
                return target && target.offsetTop <= scrollPosition + headerHeight + 40
                    ? { link, top: target.offsetTop }
                    : null;
            })
            .filter(Boolean)
            .sort((a, b) => b.top - a.top)[0]?.link;

        navLinks.forEach((link) => {
            link.classList.toggle('active-link', link === activeLink);
        });
    };

    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    updateScrollState();

    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -32px 0px',
            threshold: 0.12
        });

        animateElements.forEach((element) => animationObserver.observe(element));
    } else {
        animateElements.forEach((element) => element.classList.add('is-visible'));
    }

    contactForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!contactForm.reportValidity()) return;

        const formData = new FormData(contactForm);
        const recipient = contactForm.dataset.recipient;
        const subject = `Portfolio enquiry from ${formData.get('name')}`;
        const message = [
            `Name: ${formData.get('name')}`,
            `Email: ${formData.get('email')}`,
            `Phone: ${formData.get('phone') || 'Not provided'}`,
            '',
            String(formData.get('message'))
        ].join('\n');

        window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    });
});
