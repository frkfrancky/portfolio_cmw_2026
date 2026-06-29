// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -100px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Make section visible
            entry.target.classList.add("in-view");

            // Animate all animatable elements in the section
            const animatableElements = entry.target.querySelectorAll(
                ".section-title, .hero-prenom, .hero-nom, .hero-subtitle, " +
                ".hero-image-placeholder, .skill-card, .skill-card-grid, .silhouette-img, .timeline-item, " +
                ".project-card, .contact-text, .social-icon"
            );

            animatableElements.forEach((el) => {
                el.classList.add("animate-in");
            });
        } else {
            // Reset animation for elements outside view
            entry.target.classList.remove("in-view");

            const animatableElements = entry.target.querySelectorAll(
                ".section-title, .hero-prenom, .hero-nom, .hero-subtitle, " +
                ".hero-image-placeholder, .skill-card, .silhouette-img, .timeline-item, " +
                ".project-card, .contact-text, .social-icon"
            );

            animatableElements.forEach((el) => {
                el.classList.remove("animate-in");
            });
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll(".section").forEach((section) => {
    observer.observe(section);
});

// Also observe hero for animations
const heroSection = document.querySelector("#hero");
if (heroSection) {
    observer.observe(heroSection);
}

// Scroll progress animation - adjust element positions based on scroll
window.addEventListener("scroll", () => {
    document.querySelectorAll(".section.in-view").forEach((section) => {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate scroll progress within this section (0 to 1)
        const scrollProgress = 1 - (rect.top / viewportHeight);

        // Apply progressive transforms to elements based on scroll
        const animatableElements = section.querySelectorAll(
            ".section-title, .hero-prenom, .hero-nom, .hero-subtitle, " +
            ".hero-image-placeholder, .skill-card, .skill-card-grid, .silhouette-img, .timeline-item, " +
            ".project-card, .contact-text, .social-icon"
        );

        animatableElements.forEach((el) => {
            if (el.classList.contains("animate-in")) {
                // Progressive animation based on scroll position
                const translateY = Math.max(0, (1 - scrollProgress) * 20);
                const opacity = Math.min(1, scrollProgress * 1.5);

                el.style.transform = `translateY(${translateY}px)`;
                el.style.opacity = opacity;
            }
        });
    });
});
