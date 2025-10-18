
export const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath.trim() === '') {
    return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop';
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // ✅ URL base consistente para todas las imágenes
  const API_BASE_URL = 'http://localhost:3001';
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}/api${cleanPath}`;
};

export const getFirstValidImage = (images = []) => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return getImageUrl('');
  }
  
  const firstImage = images[0];
  return getImageUrl(firstImage);
};