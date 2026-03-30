document.addEventListener("DOMContentLoaded", () => {
    // Try to determine the exact path depth if needed, but absolute /components/ works if served from root.
    // For universal relative loading (from index or subfolders), let's construct the base URL:
    const isSubdir = window.location.pathname.includes('/blog/') || window.location.pathname.includes('/teaching/');
    const basePath = isSubdir ? '../' : './';

    const headerPath = basePath + 'components/header.html';
    const footerPath = basePath + 'components/footer.html';

    // Load Header
    fetch(headerPath)
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
            }

            // Initialize mobile menu outline toggle functionality once header is loaded
            const mobileMenu = document.getElementById('mobile-menu');
            const navMenu = document.getElementById('nav-menu');

            if (mobileMenu && navMenu) {
                mobileMenu.addEventListener('click', function () {
                    mobileMenu.classList.toggle('is-active');
                    navMenu.classList.toggle('active');
                });

                // Close menu when clicking on a nav link (for mobile)
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.addEventListener('click', () => {
                        mobileMenu.classList.remove('is-active');
                        navMenu.classList.remove('active');
                    });
                });
            }
        })
        .catch(err => console.error('Failed to load header:', err));

    // Load Footer
    fetch(footerPath)
        .then(response => response.text())
        .then(data => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
            }
        })
        .catch(err => console.error('Failed to load footer:', err));

    // Smooth scrolling for navigation links (using event delegation for dynamically loaded links)
    document.addEventListener('click', function (e) {
        if (e.target.matches('.nav-link') || e.target.closest('.nav-logo a')) {
            const link = e.target.matches('a') ? e.target : e.target.closest('a');
            const href = link.getAttribute('href');

            if (!href) return;

            // Extract path and hash
            const hashIndex = href.indexOf('#');
            if (hashIndex !== -1) {
                const path = href.substring(0, hashIndex);
                const hash = href.substring(hashIndex);

                // Check if link points to the current page (e.g. both are /index.html or root /)
                const currentPath = window.location.pathname;
                const isSamePage = (path === currentPath)
                    || (path === '/index.html' && currentPath === '/')
                    || (path === '' || path === '/');

                if (isSamePage) {
                    e.preventDefault();
                    const targetSection = document.querySelector(hash);
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            }
        }
    });
});
