// Data Simulation
const userProgress = [
    { title: "Java Programming", percent: 75 },
    { title: "Web Development", percent: 50 },
    { title: "Data Structures", percent: 25 }
];

const quickAccess = [
    { title: "To-Do-List", count: "3 Incomplete Tasks", icon: "📝" },
    { title: "My Notes", count: "7 Total Notes", icon: "📓" }
];

const recommendedCourses = [
    { title: "Java Courses", icon: "☕" },
    { title: "C# Courses", icon: "#️⃣" },
    { title: "Python Courses", icon: "🐍" },
    { title: "Flutter Courses", icon: "📱" },
    { title: "C++ Courses", icon: "➕" },
    { title: "UI/UX Courses", icon: "🎨" },
    { title: "AI Courses", icon: "🤖" }
];

// DOM Elements
const progressCardsContainer = document.getElementById('progress-cards');
const quickAccessCardsContainer = document.getElementById('quick-access-cards');
const recommendedGridContainer = document.getElementById('recommended-grid');

// Render Progress Cards
function renderProgressCards() {
    progressCardsContainer.innerHTML = '';
    userProgress.forEach(course => {
        const card = document.createElement('div');
        card.className = 'progress-card';
        card.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.percent}% complete</p>
            <div class="progress-bar"><div class="fill" style="width: ${course.percent}%;"></div></div>
            <button class="continue-btn">continue</button>
        `;
        progressCardsContainer.appendChild(card);
    });
}

// Render Quick Access Cards
function renderQuickAccessCards() {
    quickAccessCardsContainer.innerHTML = '';
    quickAccess.forEach(item => {
        const card = document.createElement('div');
        card.className = 'qa-card';
        card.innerHTML = `
            <div class="qa-content">
                <span class="icon">${item.icon}</span>
                <div>
                    <h3>${item.title}</h3>
                    <p>${item.count}</p>
                </div>
            </div>
            <button class="view-all-btn">View All</button>
        `;
        quickAccessCardsContainer.appendChild(card);
        // wire the View All button to the appropriate page
        const btn = card.querySelector('.view-all-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                const t = item.title && item.title.toLowerCase();
                if (t === 'to-do-list' || t === 'to-do list' || t === 'todo-list' || t === 'to do list') {
                    // navigate to the local To-Do List page (encode spaces)
                    window.location.href = encodeURI('../to do list/index.html');
                    return;
                }
                if (t === 'my notes' || t === 'mynotes' || t === 'notes') {
                    window.location.href = encodeURI('../notes/index.html');
                    return;
                }
                // fallback: no special page configured
                console.warn('No target page configured for quick access:', item.title);
            });
        }
    });
}

// Render Recommended Courses
function renderRecommendedCourses() {
    recommendedGridContainer.innerHTML = '';
    recommendedCourses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'rec-card';
        card.innerHTML = `
            <span class="icon">${course.icon}</span>
            <p>${course.title}</p>
        `;
        recommendedGridContainer.appendChild(card);
    });
}

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    renderProgressCards();
    renderQuickAccessCards();
    renderRecommendedCourses();
    // Attach handlers for dynamically created continue buttons
    attachContinueHandlers();
});

// Attach click handlers to any Continue buttons produced in progress cards
function attachContinueHandlers() {
    const continueBtns = document.querySelectorAll('.continue-btn');
    continueBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Navigate to the Courses page (local dev server URL)
            window.location.href = 'http://127.0.0.1:5501/Courses/index.html';
        });
    });
}
