// Hero Section Parallax Animation
let scrollPercentage = 0;
let intensity = 1;

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollPercentage = (scrollTop / docHeight) * 100;

    // Image
    const imgWrap = document.getElementById('imgWrap');
    if (imgWrap) {
        imgWrap.style.transform = `translateY(${scrollPercentage * 5 * intensity}px)`;
    }

    // Nom avant-plan
    const name1 = document.getElementById('name1');
    if (name1) {
        name1.style.transform = `translateY(${scrollPercentage * 7 * intensity}px)`;
    }

    // Nom arrière-plan
    const name2 = document.getElementById('name2');
    if (name2) {
        name2.style.transform = `translateY(${scrollPercentage * 7 * intensity}px)`;
    }

    // Prénom
    const surname2 = document.getElementById('surname2');
    if (surname2) {
        surname2.style.transform = `translateX(${scrollPercentage * 5 * intensity}px)`;
    }
});
