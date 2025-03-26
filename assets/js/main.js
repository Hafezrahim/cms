// Load header and footer
function loadPartials() {
    // Load header
    fetch('partials/header.html')
      .then(response => response.text())
      .then(data => {
        const headerDiv = document.getElementById('header');
        if (headerDiv) {
          headerDiv.innerHTML = data;
          // Initialize language switcher after header is loaded
          initLanguageSwitcher();
        }
      })
      .catch(error => console.error('Error loading header:', error));
  
    // Load footer
    fetch('partials/footer.html')
      .then(response => response.text())
      .then(data => {
        const footerDiv = document.getElementById('footer');
        if (footerDiv) {
          footerDiv.innerHTML = data;
          // Update year automatically
          const yearSpan = footerDiv.querySelector('#current-year');
          if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
          }
        }
      })
      .catch(error => console.error('Error loading footer:', error));
  }
  
  // Language switcher functionality
  function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const currentLang = localStorage.getItem('lang') || 'en';
    
    // Set initial language
    setLanguage(currentLang);
    
    // Add event listeners
    langButtons.forEach(button => {
      button.addEventListener('click', () => {
        const lang = button.dataset.lang;
        localStorage.setItem('lang', lang);
        setLanguage(lang);
      });
    });
  }
  
  // Set language for the page
  function setLanguage(lang) {
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Set direction for Arabic
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Load translations (you'll need to implement this)
    loadTranslations(lang);
  }
  
  // Load translations (simplified example)
  function loadTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    
// Update the translations object in main.js
const translations = {
    en: {
      home: "Home",
      blog: "Blog",
      about: "About Us",
      contact: "Contact Us",
      recentPosts: "Recent Posts",
      readMore: "Read More",
      searchPlaceholder: "Search by title or author",
      search: "Search",
      gridView: "Grid",
      listView: "List",
      welcome: "Welcome to CMS Hafez",
      heroSubtitle: "Your professional content management solution",
      viewPosts: "View Posts",
      noPosts: "No posts available",
      visitBlog: "Visit Blog"
    },
    ar: {
      home: "الرئيسية",
      blog: "المدونة",
      about: "من نحن",
      contact: "اتصل بنا",
      recentPosts: "أحدث المنشورات",
      readMore: "اقرأ المزيد",
      searchPlaceholder: "ابحث بالعنوان أو المؤلف",
      search: "بحث",
      gridView: "شبكة",
      listView: "قائمة",
      welcome: "مرحبًا بكم في نظام إدارة المحتوى",
      heroSubtitle: "حلول احترافية لإدارة المحتوى",
      viewPosts: "عرض المنشورات",
      noPosts: "لا توجد منشورات متاحة",
      visitBlog: "زيارة المدونة"
    }
  };
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    loadPartials();
    
    // Add smooth scroll to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  });
  // Update the setLanguage function in main.js
function setLanguage(lang) {
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Set direction for Arabic
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Reload content
    reloadContentForLanguage(lang);
  }
  
  // New function to reload content when language changes
  async function reloadContentForLanguage(lang) {
    // Update all posts on the page
    if (typeof updatePostsForLanguage === 'function') {
      await updatePostsForLanguage(lang);
    }
    
    // Update translations
    loadTranslations(lang);
    
    // Adjust RTL-specific styles
    if (lang === 'ar') {
      document.querySelectorAll('.text-start').forEach(el => {
        el.classList.remove('text-start');
        el.classList.add('text-end');
      });
    } else {
      document.querySelectorAll('.text-end').forEach(el => {
        el.classList.remove('text-end');
        el.classList.add('text-start');
      });
    }
  }
  