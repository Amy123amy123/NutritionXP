// Load products, categories, and brands from the database API.
// Refresh the page after editing the database to see updates.

let productsData = [];
let categoriesData = [];
let brandsData = [];

async function loadProductsFromDatabase() {
  try {
    const [productsRes, categoriesRes, brandsRes] = await Promise.all([
      apiFetch('/api/products'),
      apiFetch('/api/categories'),
      apiFetch('/api/brands')
    ]);
    productsData = productsRes.products || [];
    categoriesData = categoriesRes.categories || [];
    brandsData = brandsRes.brands || [];
  } catch (err) {
    console.error('Could not load products from database. Is the server running?', err);
    productsData = [];
    categoriesData = [];
    brandsData = [];
  }

  document.dispatchEvent(new CustomEvent('nutritionxp:products-ready', {
    detail: { products: productsData, categories: categoriesData, brands: brandsData }
  }));
}

function findProductById(id) {
  return productsData.find(p => p.id === id);
}

function getDefaultCategoryImage(name) {
  const images = [
    'https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400',
    'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return images[hash % images.length];
}

function getDefaultBrandImage(name) {
  return getDefaultCategoryImage(name);
}

document.addEventListener('DOMContentLoaded', () => {
  loadProductsFromDatabase();
});
