// Google Sheets API configuration
const SHEET_ID = '1ef3iAK346-TntLiHMevi7pcM5fQ0DAPyHVrqOEni6rw';
const API_KEY = 'AIzaSyAzRGzfuGxlrOgEjt_MhZL9Wj8Wmggr3Kc';

// Fetch data from Google Sheets
async function fetchSheetData(sheetName) {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}`
    );
    const data = await response.json();
    return processSheetData(data.values);
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return [];
  }
}

// Process raw sheet data into objects
function processSheetData(rows) {
  if (!rows || rows.length < 2) return [];
  
  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
}

// Get posts with language support
async function getPosts(lang = 'en') {
  const posts = await fetchSheetData('Posts');
  return posts.map(post => ({
    id: post.id,
    title: lang === 'ar' ? post['ar-title'] : post.title,
    content: lang === 'ar' ? post['ar-content'] : post.content,
    author: lang === 'ar' ? post['ar-author'] : post.author,
    image: post.image,
    published: post.published === 'TRUE',
    date: post.date || new Date().toISOString().split('T')[0]
  }));
}
// Add this to your sheets.js
async function getPosts(lang = 'en') {
    const posts = await fetchSheetData('Posts');
    return posts.map(post => ({
      id: post.id,
      title: lang === 'ar' ? post['ar-title'] : post.title,
      content: lang === 'ar' ? post['ar-content'] : post.content,
      author: lang === 'ar' ? post['ar-author'] : post.author,
      image: post.image,
      published: post.published === 'TRUE',
      date: post.date || formatDefaultDate(),
      tags: post.tags ? post.tags.split(',') : []
    }));
  }
  
  function formatDefaultDate() {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD format
  }
 // Update your getPosts function in sheets.js
async function getPosts(lang = 'en') {
    const posts = await fetchSheetData('Posts');
    return posts.map(post => ({
      id: post.id,
      title: lang === 'ar' ? post['ar-title'] || post.title : post.title,
      content: lang === 'ar' ? post['ar-content'] || post.content : post.content,
      author: lang === 'ar' ? post['ar-author'] || post.author : post.author,
      image: extractDirectImageUrl(post.image), // Process image URL
      published: post.published === 'TRUE',
      date: post.date || new Date().toISOString().split('T')[0],
      tags: post.tags ? post.tags.split(',') : []
    }));
  }
  
  function extractDirectImageUrl(url) {
    if (!url) return null;
    
    // Handle Google URL redirects
    if (url.includes('google.com/url')) {
      try {
        const urlObj = new URL(url);
        const imgUrl = urlObj.searchParams.get('url');
        if (imgUrl && (imgUrl.endsWith('.jpg') || imgUrl.endsWith('.png') || imgUrl.endsWith('.jpeg'))) {
          return imgUrl;
        }
      } catch (e) {
        console.error('Error processing Google URL:', e);
      }
      return null;
    }
    
    // Handle direct image URLs
    if (url.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
      return url;
    }
    
    return null;
  }
  
  async function getPosts(lang = 'en') {
    const posts = await fetchSheetData('Posts');
    return posts.map(post => ({
      id: post.id,
      title: lang === 'ar' ? post['ar-title'] || post.title : post.title,
      content: lang === 'ar' ? post['ar-content'] || post.content : post.content,
      author: lang === 'ar' ? post['ar-author'] || post.author : post.author,
      image: extractDirectImageUrl(post.image), // Process image URL
      published: post.published === 'TRUE',
      date: post.date || new Date().toISOString().split('T')[0],
      tags: post.tags ? post.tags.split(',') : []
    }));
  }