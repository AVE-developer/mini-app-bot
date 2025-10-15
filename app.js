// Initialize Lucide icons
lucide.createIcons();

// Get elements
const pageSections = document.querySelectorAll('.page-section');
const navButtons = document.querySelectorAll('.nav-btn');

// --- Page Navigation ---
function navigateTo(targetPage) {
    pageSections.forEach(section => section.classList.add('hidden'));
    const targetSection = document.getElementById(`${targetPage}-section`);
    if (targetSection) targetSection.classList.remove('hidden');

    navButtons.forEach(btn => {
        if (btn.getAttribute('data-page') === targetPage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Navigation buttons
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const page = btn.getAttribute('data-page');
        navigateTo(page);
    });
});

// Load home section by default
window.onload = () => {
    navigateTo('home');
};
