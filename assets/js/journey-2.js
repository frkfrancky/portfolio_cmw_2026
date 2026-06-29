// Journey2 Section - Testing version (Copy of journey.js)
document.addEventListener("DOMContentLoaded", () => {
    const stickyContainer = document.getElementById("sticky-container-2");
    if (!stickyContainer) return;

    const progressImage = document.getElementById("progress-image-2");
    const progressPoints = stickyContainer.querySelectorAll(".progress-point");

    const infoContainer = document.getElementById("dynamic-info-2");
    const infoTitle = document.getElementById("info-title-2");
    const infoText = document.getElementById("info-text-2");

    if (!progressImage || !infoContainer) return;

    // Wait for content loader to load data
    let educationData = [];

    // Function to initialize education data
    async function initializeEducationData() {
        const education = contentLoader.getEducation();
        if (education) {
            educationData = education.map(item => ({
                title: item.school,
                text: `${item.degree}\n${item.years}`
            }));
        }
        return educationData;
    }

    // Initialize data and ensure it's loaded before first update
    async function initializeAndUpdate() {
        await initializeEducationData();
        updateProgress();
    }

    if (contentLoader.data) {
        initializeAndUpdate();
    } else {
        setTimeout(initializeAndUpdate, 100);
    }

    let currentIndex = -1;
    let ticking = false;

    function updateProgress() {
        const containerRect = stickyContainer.getBoundingClientRect();

        // Total scrollable distance
        const scrollableDistance = containerRect.height - window.innerHeight;

        // Pixels already scrolled
        const scrolledInContainer = -containerRect.top;

        // Progress ratio between 0 and 1
        let progress = 0;
        if (scrollableDistance > 0) {
            progress = scrolledInContainer / scrollableDistance;
        }
        progress = Math.max(0, Math.min(1, progress || 0));

        // Move the SVG image from left to right
        progressImage.style.left = `calc(${progress * 100}% - ${progress * 30}px)`;

        // Determine current education index (0 to 5)
        let newIndex = Math.min(5, Math.max(0, Math.floor(progress * 6)));

        // Update text with fade effect
        if (newIndex !== currentIndex && educationData[newIndex]) {
            infoContainer.style.opacity = 0;

            setTimeout(() => {
                infoTitle.textContent = educationData[newIndex].title;
                infoText.textContent = educationData[newIndex].text;
                infoContainer.style.opacity = 1;
            }, 100);

            currentIndex = newIndex;
        }

        // Light up points as progress passes them
        progressPoints.forEach((point, index) => {
            const pointPosition = index / 6;
            if (progress >= pointPosition) {
                point.classList.add('active');
            } else {
                point.classList.remove('active');
            }
        });

        // Update journey parallax animation
        const educationIndex = Math.min(5, Math.max(0, Math.floor(progress * 6)));
        const segmentStart = educationIndex / 6;
        const segmentEnd = (educationIndex + 1) / 6;
        const scrollRatioInSegment = (progress - segmentStart) / (segmentEnd - segmentStart);

        // Update parallax with normalized ratio (0-1)
        if (typeof updateJourneyParallax2 === 'function') {
            updateJourneyParallax2(scrollRatioInSegment, educationIndex);
        }

        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateProgress();
            });
            ticking = true;
        }
    }, { passive: true });

    // Make progress points clickable
    progressPoints.forEach((point, index) => {
        point.style.cursor = 'pointer';
        point.addEventListener('click', () => {
            const containerRect = stickyContainer.getBoundingClientRect();
            const scrollableDistance = containerRect.height - window.innerHeight;

            // Calculate target progress (0 to 1)
            const targetProgress = index / 6;

            // Calculate target scroll position
            const containerTop = stickyContainer.getBoundingClientRect().top + window.scrollY;
            const targetScroll = containerTop + (targetProgress * scrollableDistance);

            // Smooth scroll to target
            window.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        });
    });
});
