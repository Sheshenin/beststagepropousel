// ===== AVCO × BESTAGE Interactive Presentation =====

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const navDotsContainer = document.getElementById('navDots');
    const currentSlideEl = document.getElementById('currentSlide');
    const progressFill = document.getElementById('progressFill');
    const scrollHint = document.getElementById('scrollHint');
    const totalSlides = slides.length;

    // Create nav dots
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
            slides[i].scrollIntoView({ behavior: 'smooth' });
        });
        navDotsContainer.appendChild(dot);
    });

    const navDots = document.querySelectorAll('.nav-dot');

    // Intersection Observer for slide tracking
    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(slides).indexOf(entry.target);
                updateActiveSlide(index);
            }
        });
    }, {
        threshold: 0.5
    });

    slides.forEach(slide => slideObserver.observe(slide));

    function updateActiveSlide(index) {
        // Update nav dots
        navDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Update counter
        currentSlideEl.textContent = index + 1;

        // Update progress
        const progress = ((index + 1) / totalSlides) * 100;
        progressFill.style.width = progress + '%';

        // Hide scroll hint after first slide
        if (index > 0) {
            scrollHint.classList.add('hidden');
        } else {
            scrollHint.classList.remove('hidden');
        }
    }

    // Intersection Observer for animations
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger bar animations on slide 2
                if (entry.target.closest('.slide-2')) {
                    animateBars();
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-up').forEach(el => {
        animObserver.observe(el);
    });

    // Animate chart bars
    function animateBars() {
        const bars = document.querySelectorAll('.bar-fill');
        bars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            if (width) {
                bar.style.setProperty('--target-width', width + '%');
                setTimeout(() => {
                    bar.classList.add('animated');
                }, 200);
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const currentIndex = getCurrentSlideIndex();
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
            e.preventDefault();
            if (currentIndex < totalSlides - 1) {
                slides[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentIndex > 0) {
                slides[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
            }
        } else if (e.key === 'Home') {
            e.preventDefault();
            slides[0].scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'End') {
            e.preventDefault();
            slides[totalSlides - 1].scrollIntoView({ behavior: 'smooth' });
        }
    });

    function getCurrentSlideIndex() {
        let closest = 0;
        let minDistance = Infinity;
        slides.forEach((slide, i) => {
            const rect = slide.getBoundingClientRect();
            const distance = Math.abs(rect.top);
            if (distance < minDistance) {
                minDistance = distance;
                closest = i;
            }
        });
        return closest;
    }

    // Touch/swipe support for mobile
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const diff = touchStartY - touchEndY;
        const threshold = 50;
        const currentIndex = getCurrentSlideIndex();

        if (Math.abs(diff) < threshold) return;

        if (diff > 0 && currentIndex < totalSlides - 1) {
            // Swipe up - next slide
            slides[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
        } else if (diff < 0 && currentIndex > 0) {
            // Swipe down - prev slide
            slides[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Add hover effects to cards with subtle parallax
    document.querySelectorAll('.channel-card, .segment-card, .topic-card, .stat-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Counter animation for slide 9 numbers
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const slide10 = document.getElementById('slide10');
    if (slide10) {
        counterObserver.observe(slide10);
    }

    function animateCounters(slide) {
        const priceEl = slide.querySelector('.price-main');
        const volumeEl = slide.querySelector('.volume-number');

        if (priceEl) animateNumber(priceEl, 0, 75000, 1500, (n) => n.toLocaleString('ru-RU') + ' ₽');
        if (volumeEl) animateNumber(volumeEl, 0, 16, 1200, (n) => Math.round(n).toString());
    }

    function animateNumber(el, start, end, duration, formatter) {
        const startTime = performance.now();
        const originalText = el.textContent;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * eased;

            el.textContent = formatter(current);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // Initial state
    updateActiveSlide(0);
});
