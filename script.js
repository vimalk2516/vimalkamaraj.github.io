document.addEventListener('DOMContentLoaded', () => {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // Theme Toggle
    const btn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    const overlay = document.getElementById('theme-overlay');
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch(e) {}
    if (saved === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (icon) icon.classList.replace('fa-sun', 'fa-moon');
    } else {
        if (icon) icon.classList.replace('fa-moon', 'fa-sun'); // Default icon
    }
    if (btn) {
        btn.addEventListener('click', function() {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            if (overlay) {
                const r = btn.getBoundingClientRect();
                overlay.style.setProperty('--cx', ((r.left + r.width/2)/window.innerWidth*100)+'%');
                overlay.style.setProperty('--cy', ((r.top + r.height/2)/window.innerHeight*100)+'%');
                overlay.classList.remove('active','to-dark','to-light');
                overlay.classList.add(isDark ? 'to-light' : 'to-dark');
                void overlay.offsetWidth;
                overlay.classList.add('active');
                setTimeout(() => overlay.classList.remove('active','to-dark','to-light'), 700);
            }
            if (isDark) {
                document.body.removeAttribute('data-theme');
                if (icon) icon.classList.replace('fa-moon', 'fa-sun');
                try { localStorage.setItem('theme', 'light'); } catch(e) {}
            } else {
                document.body.setAttribute('data-theme', 'dark');
                if (icon) icon.classList.replace('fa-sun', 'fa-moon');
                try { localStorage.setItem('theme', 'dark'); } catch(e) {}
            }
        });
    }

    // Reveal on Scroll
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    // Scrollspy + Sliding Nav Pill
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const slider = document.getElementById('nav-slider');
    const navContainer = document.getElementById('nav-links');

    function moveSlider(link) {
        if (!slider || !link || !navContainer) return;
        const cr = navContainer.getBoundingClientRect();
        const lr = link.getBoundingClientRect();
        slider.style.left = (lr.left - cr.left) + 'px';
        slider.style.width = lr.width + 'px';
    }
    let currentActive = null;
    function updateNav() {
        let current = '';
        sections.forEach(s => { if (window.scrollY >= s.offsetTop - 250) current = s.id; });
        navLinks.forEach(l => {
            l.classList.remove('active');
            if (l.dataset.section === current) { l.classList.add('active'); currentActive = l; }
        });
        if (currentActive) moveSlider(currentActive);
    }
    
    // Make the glass pill dynamic on cursor hover
    navLinks.forEach(l => {
        l.addEventListener('mouseenter', () => moveSlider(l));
    });
    if (navContainer) {
        navContainer.addEventListener('mouseleave', () => {
            if (currentActive) moveSlider(currentActive);
        });
    }

    window.addEventListener('scroll', updateNav);
    setTimeout(updateNav, 150);

    // Card Shine — cursor-following highlight
    document.querySelectorAll('.glass-card').forEach(card => {
        const shine = card.querySelector('.card-shine');
        if (!shine) return;
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width) * 100;
            const yp = ((e.clientY - r.top) / r.height) * 100;
            shine.style.boxShadow =
                `inset 2px 2px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 1px rgba(255,255,255,0.3)`;
            shine.style.background = `radial-gradient(circle at ${x}% ${yp}%, rgba(255,255,255,0.12), transparent 60%)`;
        });
        card.addEventListener('mouseleave', () => {
            shine.style.background = 'none';
        });
    });

    // Scroll To Top
    const stb = document.getElementById('scroll-top');
    if (stb) {
        window.addEventListener('scroll', () => stb.classList.toggle('show', window.scrollY > 200));
        stb.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Admin Counter
    let count = 154, visited = false;
    try { count = parseInt(localStorage.getItem('page_views')||'154',10); visited = sessionStorage.getItem('visited'); } catch(e) {}
    if (!visited) { count++; try { localStorage.setItem('page_views',count); sessionStorage.setItem('visited','true'); } catch(e) {} }
    const trigger = document.getElementById('admin-trigger');
    const stats = document.getElementById('admin-stats');
    const vc = document.getElementById('view-count');
    let clicks = 0, timer = null;
    if (trigger) {
        trigger.addEventListener('click', () => {
            clicks++;
            if (clicks === 3) { stats.style.display = stats.style.display === 'none' ? 'block' : 'none'; if (vc) vc.textContent = count; clicks = 0; }
            clearTimeout(timer); timer = setTimeout(() => clicks = 0, 600);
        });
    }
});
