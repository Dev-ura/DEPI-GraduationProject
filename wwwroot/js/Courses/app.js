// Course data
const courses = [
  {
    title: "Java Programming",
    keywords: ["java", "programming", "coding", "development"]
  },
  {
    title: "Web Development",
    keywords: ["web", "development", "html", "css", "javascript", "frontend", "backend"]
  },
  {
    title: "Data Structures",
    keywords: ["data", "structures", "algorithms", "programming", "computer science"]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const searchBar = document.querySelector('.search-bar');
  const courseCards = document.querySelectorAll('.course-card');
  const startBtn = document.querySelector('.start-btn');
  const signInBtn = document.querySelector('.sign-in-btn');

  // Helper: show no results
  function showNoResults() {
    let noResults = document.querySelector('.no-results');
    if (!noResults) {
      noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.textContent = 'No courses found. Try a different search term.';
      noResults.style.cssText = `
        text-align: center;
        padding: 40px;
        color: #666;
        font-size: 18px;
        margin-top: 20px;
      `;
      const grid = document.querySelector('.courses-grid');
      if (grid) grid.appendChild(noResults);
    }
  }

  function hideNoResults() {
    const noResults = document.querySelector('.no-results');
    if (noResults) noResults.remove();
  }

  // Search functionality (only if searchBar exists)
  if (searchBar) {
    searchBar.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();

      courseCards.forEach((card, index) => {
        const titleEl = card.querySelector('.course-title');
        const courseTitle = titleEl ? titleEl.textContent.toLowerCase() : '';
        const course = courses[index] || { keywords: [] };
        const matchesSearch = courseTitle.includes(searchTerm) || 
                             course.keywords.some(keyword => keyword.includes(searchTerm));

        if (matchesSearch || searchTerm === '') {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.display = 'none';
        }
      });

      const visibleCourses = Array.from(courseCards).filter(card => 
        card.style.display !== 'none'
      );

      if (visibleCourses.length === 0 && searchTerm !== '') {
        showNoResults();
      } else {
        hideNoResults();
      }
    });

    // Clear search on Escape key
    searchBar.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchBar.value = '';
        searchBar.dispatchEvent(new Event('input'));
        searchBar.blur();
      }
    });
  }

  // Start button functionality (guarded)
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const visibleCourses = Array.from(courseCards).filter(card => 
        card.style.display !== 'none'
      );

      if (visibleCourses.length > 0) {
        alert(`Starting with ${visibleCourses.length} course(s)!`);
      } else {
        alert('Please select a course first!');
      }
    });
  }

  // Sign in button functionality (guarded)
  if (signInBtn) {
    signInBtn.addEventListener('click', () => {
      alert('Sign in functionality coming soon!');
    });
  }

  // Course card click + hover (only if there are cards)
  if (courseCards && courseCards.length > 0) {
    courseCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        const titleEl = card.querySelector('.course-title');
        const courseTitle = titleEl ? titleEl.textContent : '';
        console.log(`Selected course: ${courseTitle}`);
      });

      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.transition = 'transform 0.3s ease';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });
  }

  // Smooth scroll/logging for footer links
  document.querySelectorAll('footer a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      console.log(`Navigating to: ${link.textContent}`);
    });
  });

  // Add simple loading animation on page load
  window.addEventListener('load', () => {
    if (courseCards && courseCards.length > 0) {
      courseCards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        }, index * 100);
      });
    }
  });
});