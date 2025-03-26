document.addEventListener('DOMContentLoaded', async () => {
    // Get post ID and language from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    let currentLang = urlParams.get('lang') || localStorage.getItem('lang') || 'en';
    
    // Validate language
    if (!['en', 'ar'].includes(currentLang)) {
      currentLang = 'en';
    }
  
    if (!postId) {
      window.location.href = `blog.html?lang=${currentLang}`;
      return;
    }
  
    // Set language immediately
    setLanguage(currentLang);
  
    // Load post data in current language
    const post = await loadPostDetails(postId, currentLang);
    
    if (!post) {
      window.location.href = `blog.html?lang=${currentLang}`;
      return;
    }
  
    // Display post
    displayPostDetails(post, currentLang);
  
    // Load related posts
    loadRelatedPosts(postId, post.author, currentLang);
  
    // Initialize language switcher
    initLanguageSwitcher(postId);
  });
  
  async function loadPostDetails(postId, lang) {
    try {
      const posts = await getPosts(lang);
      return posts.find(p => p.id === postId);
    } catch (error) {
      console.error('Error loading post:', error);
      return null;
    }
  }
  
  function displayPostDetails(post, lang) {
    // Set document title
    document.title = `${post.title} | CMS Hafez`;
  
    // Update post content
    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('postAuthor').textContent = `${lang === 'ar' ? 'بواسطة' : 'By'} ${post.author}`;
    document.getElementById('postDate').textContent = formatDate(post.date, lang);
    
    const postImage = document.getElementById('postImage');
    postImage.src = validateImageUrl(post.image) || 'assets/img/default-post.jpg';
    postImage.alt = post.title;
    
    document.getElementById('postContent').innerHTML = post.content;
  }
  
  async function loadRelatedPosts(currentPostId, author, lang) {
    try {
      const posts = await getPosts(lang);
      const relatedPosts = posts
        .filter(p => p.id !== currentPostId && p.author === author)
        .slice(0, 3);
      
      const relatedContainer = document.getElementById('relatedPostsContainer');
      
      if (relatedPosts.length > 0) {
        relatedContainer.innerHTML = relatedPosts.map(post => `
          <div class="col-md-4 mb-4">
            <div class="card post-card h-100">
              <img src="${validateImageUrl(post.image) || 'assets/img/default-post.jpg'}" 
                   class="card-img-top" 
                   alt="${post.title}"
                   onerror="this.src='assets/img/default-post.jpg'">
              <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <a href="post-details.html?id=${post.id}&lang=${lang}" class="btn btn-outline-primary">
                  ${lang === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                </a>
              </div>
            </div>
          </div>
        `).join('');
      } else {
        relatedContainer.innerHTML = `
          <div class="col-12 text-center py-3">
            <p class="text-muted">${lang === 'ar' ? 'لا توجد منشورات ذات صلة' : 'No related posts found'}</p>
          </div>
        `;
      }
    } catch (error) {
      console.error('Error loading related posts:', error);
    }
  }
  
  function initLanguageSwitcher(postId) {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
      button.addEventListener('click', () => {
        const newLang = button.dataset.lang;
        localStorage.setItem('lang', newLang);
        
        // Redirect to same post in new language
        window.location.href = `post-details.html?id=${postId}&lang=${newLang}`;
      });
    });
  }
  
  function validateImageUrl(url) {
    if (!url) return null;
    try {
      new URL(url);
      return url;
    } catch (e) {
      return null;
    }
  }
  
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
  
  function setLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Load translations
    loadTranslations(lang);
  }
  // Add to main.js or a shared utilities file
function processImageLink(imageLink) {
    // The image processing function from solution
}

function createImageElement(imageUrl, altText) {
    // The image creation function from solution
}
import { processImageLink } from './utils/image-handler.js';

async function loadPostDetails() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    const lang = params.get('lang') || 'english';
    
    const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`
    );
    const data = await response.json();
    
    const post = data.values.find(row => row[0] === postId);
    if (!post) return;
    
    document.getElementById('postImage').src = processImageLink(post[7]) || 'assets/img/default-post.jpg';
    document.getElementById('postTitle').textContent = 
        lang === 'english' ? post[1] : post[4];
    document.getElementById('postContent').textContent = 
        lang === 'english' ? post[2] : post[5];
}

document.addEventListener('DOMContentLoaded', loadPostDetails);