document.addEventListener('DOMContentLoaded', async () => {
    // Get current language
    const currentLang = localStorage.getItem('lang') || 'en';
    
    // Load posts
    const posts = await getPosts(currentLang);
    const publishedPosts = posts.filter(post => post.published);
    
    // Hero Slider
    const carouselInner = document.querySelector('.carousel-inner');
    if (publishedPosts.length > 0) {
      carouselInner.innerHTML = publishedPosts.slice(0, 3).map((post, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
          <img src="${post.image || 'assets/img/default-hero.jpg'}" class="d-block w-100" alt="${post.title}">
          <div class="carousel-caption d-none d-md-block">
            <h3>${post.title}</h3>
            <p>${post.content.substring(0, 100)}...</p>
            <a href="post-details.html?id=${post.id}" class="btn btn-primary btn-sm">
              <span data-i18n="readMore">Read More</span> <i class="fas fa-arrow-right ms-1"></i>
            </a>
          </div>
        </div>
      `).join('');
    } else {
      carouselInner.innerHTML = `
        <div class="carousel-item active">
          <img src="assets/img/default-hero.jpg" class="d-block w-100" alt="Default slide">
          <div class="carousel-caption d-none d-md-block">
            <h3 data-i18n="welcome">Welcome to CMS Hafez</h3>
            <p data-i18n="hero.subtitle">Your professional content management solution</p>
            <a href="blog.html" class="btn btn-primary btn-sm">
              <span data-i18n="viewPosts">View Posts</span> <i class="fas fa-arrow-right ms-1"></i>
            </a>
          </div>
        </div>
      `;
    }
  
    // Recent Posts
    const recentPostsContainer = document.getElementById('recentPostsContainer');
    if (publishedPosts.length > 0) {
      recentPostsContainer.innerHTML = publishedPosts.slice(0, 6).map(post => `
        <div class="col-md-4 mb-4">
          <div class="card post-card h-100">
            <div class="post-image-container">
              <img src="${post.image || 'assets/img/default-post.jpg'}" class="card-img-top" alt="${post.title}">
              <span class="post-date">${formatDate(post.date)}</span>
            </div>
            <div class="card-body">
              <h5 class="card-title">${post.title}</h5>
              <p class="card-text">${post.content.substring(0, 100)}...</p>
              <a href="post-details.html?id=${post.id}" class="btn btn-outline-primary">
                <span data-i18n="readMore">Read More</span> <i class="fas fa-arrow-right ms-1"></i>
              </a>
            </div>
            <div class="card-footer bg-transparent">
              <small class="text-muted">By ${post.author}</small>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      recentPostsContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-newspaper fa-3x mb-3 text-muted"></i>
          <h4 class="text-muted" data-i18n="noPosts">No posts available</h4>
          <a href="blog.html" class="btn btn-primary mt-3">
            <span data-i18n="visitBlog">Visit Blog</span>
          </a>
        </div>
      `;
    }
  
    // CEO Section
    const ceoSection = document.querySelector('.ceo-message');
    if (currentLang === 'ar') {
      ceoSection.querySelector('.row').classList.add('flex-row-reverse');
      ceoSection.querySelector('.ceo-text').classList.add('text-end');
    }
  });
  
  function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  // Add this to home.js
async function updatePostsForLanguage(lang) {
    const posts = await getPosts(lang);
    const publishedPosts = posts.filter(post => post.published);
    
    // Update hero slider
    const carouselInner = document.querySelector('.carousel-inner');
    if (publishedPosts.length > 0) {
      carouselInner.innerHTML = publishedPosts.slice(0, 3).map((post, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
          <img src="${post.image}" class="d-block w-100" alt="${post.title}" onerror="this.src='assets/img/default-hero.jpg'">
          <div class="carousel-caption d-none d-md-block">
            <h3>${post.title}</h3>
            <p>${post.content.substring(0, 100)}...</p>
            <a href="post-details.html?id=${post.id}&lang=${lang}" class="btn btn-primary btn-sm">
              <span data-i18n="readMore">Read More</span> <i class="fas fa-arrow-right ms-1"></i>
            </a>
          </div>
        </div>
      `).join('');
    }
  
    // Update recent posts
    const recentPostsContainer = document.getElementById('recentPostsContainer');
    if (publishedPosts.length > 0) {
      recentPostsContainer.innerHTML = publishedPosts.slice(0, 6).map(post => `
        <div class="col-md-4 mb-4">
          <div class="card post-card h-100">
            <div class="post-image-container">
              <img src="${post.image}" class="card-img-top" alt="${post.title}" onerror="this.src='assets/img/default-post.jpg'">
              <span class="post-date">${formatDate(post.date)}</span>
            </div>
            <div class="card-body">
              <h5 class="card-title">${post.title}</h5>
              <p class="card-text">${post.content.substring(0, 100)}...</p>
              <a href="post-details.html?id=${post.id}&lang=${lang}" class="btn btn-outline-primary">
                <span data-i18n="readMore">Read More</span> <i class="fas fa-arrow-right ms-1"></i>
              </a>
            </div>
            <div class="card-footer bg-transparent">
              <small class="text-muted">${post.author}</small>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
  // In blog.js and home.js, update post links to include language:
`<a href="post-details.html?id=${post.id}&lang=${currentLang}">...</a>`
// Add to main.js or a shared utilities file
function processImageLink(imageLink) {
    // The image processing function from solution
}

function createImageElement(imageUrl, altText) {
    // The image creation function from solution
}
// In home.js
function renderFeaturedPosts(posts) {
    posts.slice(0, 3).forEach(post => {
        const imageUrl = processImageLink(post.image);
        // Create cards using createImageElement()
    });
}
  // Add error handling for images in your HTML
  // Replace all img tags with this pattern:
  // <img src="${post.image}" onerror="this.src='assets/img/default-post.jpg'" ...>
  