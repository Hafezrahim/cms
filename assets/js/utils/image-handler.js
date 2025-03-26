export function processImageLink(imageLink) {
    if (!imageLink) return null;
    imageLink = imageLink.trim();

    // Direct image links
    if (/\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i.test(imageLink) || 
        imageLink.includes('encrypted-tbn')) {
        return imageLink;
    }

    // Google Drive links
    if (imageLink.includes('drive.google.com')) {
        const fileIdMatch = imageLink.match(/\/file\/d\/([^\/]+)/) || 
                           imageLink.match(/id=([^&]+)/) || 
                           imageLink.match(/([a-zA-Z0-9_-]{25,})/);
        
        if (fileIdMatch?.[1]) {
            return [
                `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`,
                `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}=s0`,
                `https://docs.google.com/uc?id=${fileIdMatch[1]}`
            ].join('|');
        }
    }

    console.warn("Couldn't process image link:", imageLink);
    return null;
}

export function createImageElement(imageSources, altText) {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'image-container';
    
    const img = document.createElement('img');
    img.className = 'post-image';
    img.alt = altText;
    
    let currentSourceIndex = 0;
    const sources = imageSources?.split('|') || [];
    
    function tryNextSource() {
        currentSourceIndex++;
        if (currentSourceIndex < sources.length) {
            img.src = sources[currentSourceIndex];
        } else {
            img.src = 'assets/img/default-post.jpg';
        }
    }
    
    img.onerror = tryNextSource;
    img.src = sources[0] || 'assets/img/default-post.jpg';
    
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'image-loading';
    loadingDiv.textContent = 'Loading image...';
    
    img.onload = () => loadingDiv.style.display = 'none';
    
    imgContainer.append(loadingDiv, img);
    return imgContainer;
}