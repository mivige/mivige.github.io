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

        // Note: For root, hrefs point to #id. From subpages, they might need to point to /#id
        // We'll update nav links if we are on a subpage
        if (isSubdir) {
            document.querySelectorAll('.nav-link').forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    link.setAttribute('href', '../' + href);
                }
            });
        }

        if (mobileMenu && navMenu) {
          mobileMenu.addEventListener('click', function() {
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
    document.addEventListener('click', function(e) {
      if (e.target.matches('.nav-link')) {
        const href = e.target.getAttribute('href');
        // Only prevent default and scroll smoothly if it's an anchor link on the *same* page
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href;
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            }
        }
      }
    });
});
