// Projects Gallery and Modal Management
let currentProjects = [];
let allProjects = [];
let showingAll = false;

// Load and display projects
async function loadProjects() {
    // Wait for contentLoader
    if (!contentLoader.data) {
        await contentLoader.load();
    }

    // Get projects from content.json
    const projects = contentLoader.getContent('projects') || [];
    const projectsMore = contentLoader.getContent('projectsMore') || [];

    currentProjects = projects;
    allProjects = [...projects, ...projectsMore];
    showingAll = false;

    // Display initial projects
    displayProjectsGallery(currentProjects);
}

// Display projects in gallery
function displayProjectsGallery(projects) {
    const gallery = document.getElementById('projects-gallery');
    if (!gallery) return;

    gallery.innerHTML = '';

    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card visible'; // Add visible class immediately
        projectCard.innerHTML = `
            <div class="project-image-container">
                <img src="${project.image}" alt="${project.title}" class="project-image">
                <div class="project-overlay">
                    <span class="project-view-more">Voir plus</span>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p class="project-theme">${project.theme}</p>
            </div>
        `;

        projectCard.addEventListener('click', () => openProjectModal(project));
        gallery.appendChild(projectCard);
    });

    // Show/hide buttons
    updateProjectsButtons();
}

// Update project buttons visibility
function updateProjectsButtons() {
    const seeMoreBtn = document.getElementById('projects-see-more');
    const seeLessBtn = document.getElementById('projects-see-less');

    if (!seeMoreBtn || !seeLessBtn) return;

    if (showingAll) {
        seeMoreBtn.style.display = 'none';
        seeLessBtn.style.display = 'block';
    } else {
        seeMoreBtn.style.display = allProjects.length > currentProjects.length ? 'block' : 'none';
        seeLessBtn.style.display = 'none';
    }
}

// Open project modal (fullscreen)
function openProjectModal(project) {
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('project-modal-content');

    if (!modal || !modalContent) return;

    // Build modal content
    let mediaHTML = '';
    if (project.video) {
        mediaHTML = `<video controls class="project-video" src="${project.video}"></video>`;
    } else {
        mediaHTML = `<img src="${project.image}" alt="${project.title}" class="project-modal-image">`;
    }

    let projectUrlHTML = '';
    if (project.projectUrl) {
        projectUrlHTML = `
            <div class="modal-project-link">
                <a href="${project.projectUrl}" target="_blank" class="btn-project-link">
                    Visiter le projet →
                </a>
            </div>
        `;
    }

    modalContent.innerHTML = `
        <div class="modal-close" onclick="closeProjectModal()">×</div>
        <div class="modal-media">
            ${mediaHTML}
        </div>
        <div class="modal-details">
            <h2>${project.title}</h2>
            <p class="modal-theme"><strong>Thématique:</strong> ${project.theme}</p>
            <p class="modal-description">${project.description}</p>
            <div class="modal-info-grid">
                <div class="modal-info-item">
                    <strong>Mon rôle:</strong>
                    <p>${project.role}</p>
                </div>
                <div class="modal-info-item">
                    <strong>Durée:</strong>
                    <p>${project.duration}</p>
                </div>
            </div>
            ${project.skills && project.skills.length > 0 ? `
                <div class="modal-skills">
                    <strong>Compétences:</strong>
                    <div class="skill-tags">
                        ${project.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            ${projectUrlHTML}
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close project modal
function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
}

// Close modal when pressing Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

// Show all projects
function showAllProjects() {
    displayProjectsGallery(allProjects);
    showingAll = true;
    updateProjectsButtons();
}

// Show less projects (back to 3)
function showLessProjects() {
    displayProjectsGallery(currentProjects);
    showingAll = false;
    updateProjectsButtons();
}

// Update projects when language changes
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();

    // Update projects when language changes
    const originalSetLanguage = window.setLanguage;
    window.setLanguage = function(lang) {
        originalSetLanguage.call(this, lang);
        contentLoader.setLanguage(lang);
        loadProjects();
    };
});

// Fallback initialization
if (document.readyState !== "loading") {
    loadProjects();
}
