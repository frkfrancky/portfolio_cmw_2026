// Partner/company logos banner - data comes from content.json's "partners" list
async function loadPartners() {
    if (!contentLoader.data) {
        await contentLoader.load();
    }

    const track = document.getElementById('logos-track');
    if (!track) return;

    const partners = contentLoader.getPartners();
    if (partners.length === 0) return;

    track.innerHTML = '';

    // Render the list twice back to back so the CSS marquee (translateX 0 -> -50%)
    // loops seamlessly.
    for (let i = 0; i < 2; i++) {
        partners.forEach((partner) => {
            const content = document.createElement('img');
            content.src = partner.logo;
            content.alt = partner.name;

            let item;
            if (partner.url) {
                item = document.createElement('a');
                item.href = partner.url;
                item.target = '_blank';
                item.rel = 'noopener noreferrer';
            } else {
                item = document.createElement('div');
            }
            item.className = 'logo-item';
            item.title = partner.name;
            item.appendChild(content);

            track.appendChild(item);
        });
    }
}

document.addEventListener('DOMContentLoaded', loadPartners);

if (document.readyState !== 'loading') {
    loadPartners();
}
