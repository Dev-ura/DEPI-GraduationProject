// User Data Simulation
const user = {
    name: "Student Name",
    title: "Full Stack Developer",
    about: "Student Bio !",
    courses: [
        "Java Programming",
        "Web Development",
        "Data Analysis",
        "Data Structures"
    ]
};

// DOM Elements
const userNameElement = document.getElementById('user-name');
const userTitleElement = document.getElementById('user-title');
const aboutTextElement = document.getElementById('about-text');
const aboutInputElement = document.getElementById('about-input');
const editAboutBtn = document.getElementById('edit-about-btn');
const coursesGrid = document.getElementById('courses-grid');

// Render User Info
function renderUserInfo() {
    userNameElement.textContent = user.name;
    userTitleElement.textContent = user.title;
    aboutTextElement.textContent = user.about;
    aboutInputElement.value = user.about;
}

// Render Courses
function renderCourses() {
    coursesGrid.innerHTML = ''; // Clear existing content
    
    user.courses.forEach(course => {
        const button = document.createElement('button');
        button.className = 'course-btn';
        button.textContent = course;
        coursesGrid.appendChild(button);
    });

    // Add "+ Add Course" button
    const addBtn = document.createElement('button');
    addBtn.className = 'course-btn';
    addBtn.textContent = '+ Add Course';
    coursesGrid.appendChild(addBtn);
}

// Toggle Edit About Me
let isEditingAbout = false;

editAboutBtn.addEventListener('click', () => {
    isEditingAbout = !isEditingAbout;

    if (isEditingAbout) {
        // Switch to edit mode
        aboutTextElement.style.display = 'none';
        aboutInputElement.style.display = 'block';
        editAboutBtn.textContent = 'Save';
        aboutInputElement.focus();
    } else {
        // Save changes
        user.about = aboutInputElement.value;
        renderUserInfo(); // Update text display
        
        // Switch back to view mode
        aboutTextElement.style.display = 'block';
        aboutInputElement.style.display = 'none';
        editAboutBtn.textContent = 'Edit';
    }
});

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    renderUserInfo();
    renderCourses();
});
