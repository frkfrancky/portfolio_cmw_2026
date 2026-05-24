// Journey Section - Progress with moving SVG and dynamic info
document.addEventListener("DOMContentLoaded", () => {
    const stickyContainer = document.getElementById("sticky-container");
    const progressImage = document.getElementById("progress-image");
    const progressPoints = document.querySelectorAll(".progress-point");

    const infoContainer = document.getElementById("dynamic-info");
    const infoTitle = document.getElementById("info-title");
    const infoText = document.getElementById("info-text");

    const educationCards = document.querySelectorAll(".education-card");

    // Extract education data from DOM cards
    const educationData = Array.from(educationCards).map(card => {
        const schoolElement = card.querySelector(".education-school");
        const degreeElement = card.querySelector(".education-degree");
        const yearsElement = card.querySelector(".education-years");

        return {
            title: schoolElement ? schoolElement.textContent : "",
            text: `${degreeElement ? degreeElement.textContent : ""}\n${yearsElement ? yearsElement.textContent : ""}`
        };
    });

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

        // Determine current education index (0 to 4)
        let newIndex = Math.min(4, Math.max(0, Math.floor(progress * 5)));

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
            const pointPosition = index * 0.2; // 0%, 20%, 40%, 60%, 80%
            if (progress >= pointPosition) {
                point.classList.add('active');
            } else {
                point.classList.remove('active');
            }
        });

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

    // Initialize on load
    updateProgress();
});
