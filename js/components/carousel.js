/**
 * Hero Carousel functionality - Supports multiple carousels on the same page
 */
document.addEventListener('DOMContentLoaded', () => {
    // Find all carousel sections
    const carouselSections = document.querySelectorAll('.section-hero-carousel');

    if (carouselSections.length === 0) return;

    // Initialize each carousel independently
    carouselSections.forEach((carouselSection, carouselIndex) => {
        const slides = carouselSection.querySelectorAll('.section-hero-carousel__slide');
        const dots = carouselSection.querySelectorAll('.nav--dots .pill');
        const prevBtn = carouselSection.querySelector('.hc-prev');
        const nextBtn = carouselSection.querySelector('.hc-next');

        let currentSlide = 0;
        const slideCount = slides.length;

        if (slideCount === 0) return;

        function updateCarousel(index) {
            // Remove active class from all slides and dots
            slides.forEach(slide => slide.classList.remove('is-active'));
            dots.forEach(dot => dot.classList.remove('blue'));
            dots.forEach(dot => dot.classList.add('white'));

            // Add active class to current slide and dot
            slides[index].classList.add('is-active');
            if (dots[index]) {
                dots[index].classList.remove('white');
                dots[index].classList.add('blue');
            }
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slideCount;
            updateCarousel(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            updateCarousel(currentSlide);
        }

        // Event Listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel(currentSlide);
            });
        });

        // Optional: Auto-slide every 5 seconds
        let autoSlideInterval = setInterval(nextSlide, 5000);

        // Pause auto-slide on hover
        carouselSection.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        carouselSection.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 5000);
        });
    });
});
