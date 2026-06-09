// VCart Utilities

const Utils = {
  formatCurrency(amount) {
    return '\u20B9' + Number(amount).toLocaleString('en-IN');
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  },

  debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  getFromStorage(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  setToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
    }
  },

  getProductImageUrl(product, w, h) {
    w = w || 300;
    h = h || 300;
    const keyword = product.img || product.category.toLowerCase();
    return `https://loremflickr.com/${w}/${h}/${keyword}?lock=${product.id}`;
  },

  getProductImage(seed, w, h) {
    w = w || 300;
    h = h || 300;
    return `https://picsum.photos/seed/${seed}/${w}/${h}`;
  },

  getAvatarImage(seed, w, h) {
    w = w || 80;
    h = h || 80;
    return `https://picsum.photos/seed/${seed}/${w}/${h}`;
  },

  getCategoryFallbackGradient(category) {
    const gradients = {
      'Electronics': 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 50%, #3B82F6 100%)',
      'Fashion': 'linear-gradient(135deg, #831843 0%, #DB2777 50%, #F472B6 100%)',
      'Sports': 'linear-gradient(135deg, #064E3B 0%, #059669 50%, #34D399 100%)',
      'Home': 'linear-gradient(135deg, #78350F 0%, #D97706 50%, #FBBF24 100%)',
      'Beauty': 'linear-gradient(135deg, #4C1D95 0%, #9333EA 50%, #C084FC 100%)',
      'Grocery': 'linear-gradient(135deg, #14532D 0%, #16A34A 50%, #4ADE80 100%)',
      'Toys': 'linear-gradient(135deg, #7F1D1D 0%, #DC2626 50%, #F87171 100%)',
      'Books': 'linear-gradient(135deg, #312E81 0%, #4F46E5 50%, #818CF8 100%)',
    };
    return gradients[category] || gradients['Electronics'];
  },

  getRatingStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '\u2605'.repeat(full) + (half ? '\u00BD' : '') + '\u2606'.repeat(empty);
  },

  showToast(message, type, duration) {
    type = type || 'success';
    duration = duration || 3000;
    const container = document.getElementById('toast-container');
    if (!container) return;
    const icons = { success: '\u2713', error: '\u2717', info: '\u24D8' };
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = '<span class="toast-icon">' + (icons[type] || icons.info) + '</span><span>' + message + '</span>';
    container.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  },

  showLoading(container, count) {
    count = count || 8;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const sk = document.createElement('div');
      sk.className = 'skeleton-card';
      sk.innerHTML = '<div class="skeleton skeleton-img"></div><div class="skeleton-body"><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text" style="width:60%"></div></div>';
      container.appendChild(sk);
    }
  },

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
