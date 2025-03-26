// Blog Page Configuration
let currentPage = 1;
const postsPerPage = 6;
let allPosts = [];
let currentView = 'grid';
let currentLang = localStorage.getItem('lang') || 'en';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  initializePage();
  setupEventListeners();
});

async function initializePage() {
  setLanguage(currentLang);
  await loadPosts();
}

function setupEventListeners() {
  // View toggle buttons
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', handleViewToggle);
  });
  
  // Search functionality
  document.getElementById('searchButton').addEventListener('click', handleSearch);
  
  // Allow search on Enter key
  document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  // Handle clicks on post cards (event delegation)
  document.getElementById('blogPostsContainer').addEventListener('click', (event) => {
    const postCard = event.target.closest('.post-card');
    if (postCard) {
      const postId = postCard.dataset.postId;
      if (postId) {
        window.location.href = `post-details.html?id=${postId}&lang=${currentLang}`;
      }
    }
  });
}

// Handle view toggle between grid and list
function handleViewToggle() {
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  this.classList.add('active');
  currentView = this.dataset.view;
  renderPosts();
}

// Handle search functionality
function handleSearch() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  
  if (searchTerm) {
    allPosts = allPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) || 
      post.author.toLowerCase().includes(searchTerm)
    );
  } else {
    loadPosts();
    return;
  }
  
  currentPage = 1;
  renderPosts();
  renderPagination();
}

// Load posts from API
async function loadPosts() {
  try {
    const posts = await getPosts(currentLang);
    allPosts = posts.filter(post => post.published)
                   .map(processPostData);
    currentPage = 1;
    renderPosts();
    renderPagination();
  } catch (error) {
    console.error("Error loading posts:", error);
    showErrorMessage();
  }
}

// Process post data including image handling
function processPostData(post) {
  return {
    ...post,
    cleanImageUrl: processImageUrl(post.image),
    formattedDate: formatDate(post.date, currentLang),
    // Store all possible image URLs for fallback
    imageVariants: generateImageVariants(post.image)
  };
}

// Generate all possible image URLs for fallback
function generateImageVariants(url) {
  if (!url) return ['assets/img/default-post.jpg'];
  
  const variants = [];
  
  // 1. Original URL
  variants.push(url);
  
  // 2. Processed Google Drive URL if applicable
  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/\/file\/d\/([^\/]+)/) || url.match(/id=([^&]+)/);
    if (fileIdMatch?.[1]) {
      variants.push(`https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`);
      variants.push(`https://lh3.googleusercontent.com/d/${fileIdMatch[1]}=s0`);
      variants.push(`https://docs.google.com/uc?id=${fileIdMatch[1]}`);
    }
  }
  
  // 3. Default fallback
  variants.push('assets/img/default-post.jpg');
  
  return variants;
}

// Process image URLs from various sources
function processImageUrl(url) {
  if (!url) return 'assets/img/default-post.jpg';
  
  try {
    // Handle Google redirect URLs
    if (url.includes('google.com/url')) {
      const urlObj = new URL(url);
      const imgUrl = urlObj.searchParams.get('url');
      if (imgUrl) return imgUrl;
    }
    
    // Handle Google Drive links
    if (url.includes('drive.google.com')) {
      const fileIdMatch = url.match(/\/file\/d\/([^\/]+)/) || url.match(/id=([^&]+)/);
      if (fileIdMatch?.[1]) {
        // Try multiple Google Drive URL formats
        return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
      }
    }
    
    // Validate direct image URLs
    if (/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url)) {
      return url;
    }
    
    return 'assets/img/default-post.jpg';
  } catch (e) {
    return 'assets/img/default-post.jpg';
  }
}

// Create image element with fallback support
function createImageElement(post) {
  const imgContainer = document.createElement('div');
  imgContainer.className = 'post-image-container';
  
  const img = document.createElement('img');
  img.className = currentView === 'grid' ? 'card-img-top' : 'img-fluid rounded-start h-100 object-cover';
  img.alt = post.title;
  
  // Set up error handling for fallbacks
  let currentVariantIndex = 0;
  
  function tryNextVariant() {
    currentVariantIndex++;
    if (currentVariantIndex < post.imageVariants.length) {
      img.src = post.imageVariants[currentVariantIndex];
    }
  }
  
  img.onerror = tryNextVariant;
  img.src = post.imageVariants[0];
  
  const dateSpan = document.createElement('span');
  dateSpan.className = 'post-date';
  dateSpan.textContent = post.formattedDate;
  
  imgContainer.appendChild(img);
  imgContainer.appendChild(dateSpan);
  
  return imgContainer;
}

// Render posts based on current view
function renderPosts() {
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const postsToShow = allPosts.slice(start, end);
  const container = document.getElementById('blogPostsContainer');
  
  if (postsToShow.length === 0) {
    showNoPostsMessage(container);
    return;
  }

  container.innerHTML = currentView === 'grid' 
    ? renderGridView(postsToShow) 
    : renderListView(postsToShow);
  
  loadTranslations(currentLang);
}

// Render grid view layout
function renderGridView(posts) {
  return posts.map(post => `
    <div class="col-md-4 mb-4">
      <div class="card post-card h-100" data-post-id="${post.id}">
        ${createImageElement(post).outerHTML}
        <div class="card-body">
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">${post.content.substring(0, 150)}...</p>
          <a href="post-details.html?id=${post.id}&lang=${currentLang}" class="btn btn-outline-primary">
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

// Render list view layout
function renderListView(posts) {
  return posts.map(post => `
    <div class="col-12 mb-4">
      <div class="card post-card list-view h-100" data-post-id="${post.id}">
        <div class="row g-0">
          <div class="col-md-4">
            ${createImageElement(post).outerHTML}
          </div>
          <div class="col-md-8">
            <div class="card-body h-100 d-flex flex-column">
              <h5 class="card-title">${post.title}</h5>
              <p class="card-text flex-grow-1">${post.content.substring(0, 250)}...</p>
              <a href="post-details.html?id=${post.id}&lang=${currentLang}" class="btn btn-outline-primary align-self-start">
                <span data-i18n="readMore">Read More</span> <i class="fas fa-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Rest of your existing functions (renderPagination, formatDate, etc.) remain the same
// Render pagination controls
function renderPagination() {
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const pagination = document.getElementById('pagination');
  
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  pagination.innerHTML = `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="prev" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    ${Array.from({length: totalPages}, (_, i) => `
      <li class="page-item ${i + 1 === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${i + 1}">${i + 1}</a>
      </li>
    `).join('')}
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="next" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `;

  // Add event listeners to pagination
  pagination.querySelectorAll('.page-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetPage = this.dataset.page;
      
      if (targetPage === 'prev' && currentPage > 1) {
        currentPage--;
      } else if (targetPage === 'next' && currentPage < Math.ceil(allPosts.length / postsPerPage)) {
        currentPage++;
      } else if (!isNaN(targetPage)) {
        currentPage = parseInt(targetPage);
      }
      
      renderPosts();
      renderPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// Format date based on current language
function formatDate(dateString, lang) {
  if (!dateString) return '';
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    calendar: lang === 'ar' ? 'gregory' : undefined
  };
  return new Date(dateString).toLocaleDateString(
    lang === 'ar' ? 'ar-EG' : 'en-US', 
    options
  );
}

// Show error message when posts fail to load
function showErrorMessage() {
  const container = document.getElementById('blogPostsContainer');
  container.innerHTML = `
    <div class="col-12 text-center py-5">
      <i class="fas fa-exclamation-triangle fa-3x mb-3 text-danger"></i>
      <h4 class="text-danger" data-i18n="loadError">Failed to load posts</h4>
      <button class="btn btn-primary mt-3" onclick="window.location.reload()">
        <span data-i18n="tryAgain">Try Again</span>
      </button>
    </div>
  `;
}

// Show message when no posts found
function showNoPostsMessage(container) {
  container.innerHTML = `
    <div class="col-12 text-center py-5">
      <i class="fas fa-newspaper fa-3x mb-3 text-muted"></i>
      <h4 class="text-muted" data-i18n="noPosts">No posts found</h4>
      <button class="btn btn-primary mt-3" onclick="loadPosts()">
        <span data-i18n="showAll">Show All Posts</span>
      </button>
    </div>
  `;
}

// Set language and refresh content
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  loadTranslations(lang);
}