// VCart Main Application
document.addEventListener('DOMContentLoaded', async () => {
  await Auth.init();
  Cart.init();
  initAnnouncement();
  initNavbar();
  initSidebar();
  initHero();
  initCategories();
  initCategoryNav();
  initDealsCountdown();
  renderSection('featured-products', ProductsDB.filter(p => p.featured).slice(0, 8));
  renderSection('trending-products', ProductsDB.filter(p => p.trending).slice(0, 8));
  renderSection('new-arrivals', ProductsDB.slice(0, 8));
  renderSection('flash-deals', ProductsDB.filter(p => p.flashdeal).slice(0, 4));
  renderSection('best-sellers', ProductsDB.filter(p => p.bestseller).slice(0, 8));
  initBrands();
  initReviews();
  initNewsletter();
  initDarkMode();
  initScrollTop();
  initAnimations();
  initPageReveal();
  initSearch();
  handleUrlCategoryFilter();
  initProductPage();
  initProductDetail();
  initCheckout();
  initProfile();
  initOrderSuccess();
});

/* Product Card */
function renderCard(p) {
  const stars = '\u2605'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '\u00BD' : '') + '\u2606'.repeat(5 - Math.round(p.rating));
  const imgUrl = Utils.getProductImageUrl(p, 300, 300);
  const grad = Utils.getCategoryFallbackGradient(p.category);
  return `<div class="product-card fade-up">
    <div class="card-image">
      <img src="${imgUrl}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
      <div class="card-img-fallback" style="display:none;width:100%;height:100%;background:${grad};position:absolute;top:0;left:0;"></div>
      <button class="card-wishlist" data-id="${p.id}" aria-label="Wishlist">&#x2661;</button>
      ${p.badge ? `<span class="card-discount">${p.badge}</span>` : ''}
    </div>
    <div class="card-body">
      <div class="card-category">${p.category}</div>
      <h3 class="card-title"><a href="/pages/product-detail.html?id=${p.id}">${p.name}</a></h3>
      <div class="card-rating">
        <div class="stars">${stars}</div>
        <span class="rating-count">(${p.reviews})</span>
      </div>
      <div class="card-pricing">
        <span class="current-price">&#x20B9;${p.price.toLocaleString('en-IN')}</span>
        <span class="original-price">&#x20B9;${p.originalPrice.toLocaleString('en-IN')}</span>
      </div>
    </div>
    <div class="card-actions">
      <button class="btn btn-primary add-to-cart-btn" data-id="${p.id}">Add</button>
      <a href="/pages/product-detail.html?id=${p.id}" class="btn btn-secondary">View</a>
    </div>
  </div>`;
}

function renderSection(id, products) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = products.map(renderCard).join('');
}

/* Announcement */
function initAnnouncement() {
  const closeBtn = document.querySelector('.close-announce');
  if (!closeBtn) return;
  if (localStorage.getItem('vcart_announce_closed')) {
    const bar = document.querySelector('.announcement-bar');
    if (bar) { bar.style.display = 'none'; document.documentElement.style.setProperty('--announce-h', '0px'); }
  }
  closeBtn.addEventListener('click', () => {
    const bar = document.querySelector('.announcement-bar');
    if (bar) { bar.style.display = 'none'; document.documentElement.style.setProperty('--announce-h', '0px'); }
    localStorage.setItem('vcart_announce_closed', '1');
  });
}

/* Navbar */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.pageYOffset > 60));
}

/* Sidebar */
function initSidebar() {
  const hb = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');
  const ov = document.querySelector('.sidebar-overlay');
  const close = document.querySelector('.sidebar-close');
  if (!hb || !sidebar) return;
  const open = () => { hb.classList.add('active'); sidebar.classList.add('active'); if (ov) ov.classList.add('active'); document.body.style.overflow = 'hidden'; };
  const closeF = () => { hb.classList.remove('active'); sidebar.classList.remove('active'); if (ov) ov.classList.remove('active'); document.body.style.overflow = ''; };
  hb.addEventListener('click', open);
  if (close) close.addEventListener('click', closeF);
  if (ov) ov.addEventListener('click', closeF);
}

/* Hero */
function initHero() {
  const slider = document.querySelector('.hero');
  if (!slider) return;
  const slides = slider.querySelectorAll('.hero-slide');
  const dots = slider.querySelectorAll('.hero-dot');
  const prev = slider.querySelector('.hero-btn-prev');
  const next = slider.querySelector('.hero-btn-next');
  let idx = 0, interval;
  const go = (i) => {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    idx = (i + slides.length) % slides.length;
    slides[idx].classList.add('active');
    dots[idx].classList.add('active');
  };
  const adv = () => go(idx + 1);
  const bwd = () => go(idx - 1);
  dots.forEach((d, i) => d.addEventListener('click', () => { go(i); reset(); }));
  if (prev) prev.addEventListener('click', () => { bwd(); reset(); });
  if (next) next.addEventListener('click', () => { adv(); reset(); });
  const reset = () => { clearInterval(interval); interval = setInterval(adv, 5000); };
  interval = setInterval(adv, 5000);
  go(0);
}

/* Categories on Home Page */
function initCategories() {
  const el = document.getElementById('categories-grid');
  if (!el) return;
  el.innerHTML = Categories.map(c =>
    `<div class="category-card" data-category="${c.name}" onclick="navigateToCategory('${c.name}')">
      <div class="cat-icon">${c.icon}</div>
      <span class="cat-name">${c.name}</span>
    </div>`
  ).join('');
}

function navigateToCategory(category) {
  window.location.href = '/pages/products.html?category=' + encodeURIComponent(category);
}

/* Category Nav Bar */
function initCategoryNav() {
  const items = document.querySelectorAll('.category-item');
  items.forEach(item => {
    item.addEventListener('click', function () {
      const name = this.textContent.trim().replace(/[^\w\s]/g, '').trim();
      if (name) {
        navigateToCategory(name);
      }
    });
  });
}

/* Brands */
function initBrands() {
  const el = document.getElementById('brands-scroll');
  if (!el) return;
  el.innerHTML = Brands.map(b => `<div class="brand-item">${b}</div>`).join('');
}

/* Deals countdown */
function initDealsCountdown() {
  let sec = 11 * 3600 + 45 * 30;
  const hEl = document.getElementById('deal-hours');
  const mEl = document.getElementById('deal-minutes');
  const sEl = document.getElementById('deal-seconds');
  if (!hEl) return;
  setInterval(() => {
    if (sec <= 0) sec = 24 * 3600;
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    hEl.textContent = String(h).padStart(2,'0');
    mEl.textContent = String(m).padStart(2,'0');
    sEl.textContent = String(s).padStart(2,'0');
    sec--;
  }, 1000);
}

/* Reviews */
function initReviews() {
  const el = document.getElementById('reviews-grid');
  if (!el) return;
  el.innerHTML = Reviews.map(r =>
    `<div class="review-card fade-up">
      <div class="review-stars">${'\u2605'.repeat(r.rating)}${'\u2606'.repeat(5-r.rating)}</div>
      <div class="review-text">&ldquo;${r.text}&rdquo;</div>
      <div class="review-header" style="margin-bottom:0;margin-top:14px;">
        <img class="review-avatar" src="https://picsum.photos/seed/${r.avatar}/80/80" alt="${r.name}" loading="lazy">
        <div class="review-info"><h4>${r.name}</h4><span>Verified Buyer</span></div>
      </div>
    </div>`
  ).join('');
}

/* Newsletter */
function initNewsletter() {
  const f = document.querySelector('.newsletter-form');
  if (!f) return;
  f.addEventListener('submit', e => {
    e.preventDefault();
    const inp = f.querySelector('input');
    if (inp.value.trim()) { Utils.showToast('Subscribed to newsletter!'); inp.value = ''; }
  });
}

/* Dark Mode */
function initDarkMode() {
  const t = document.querySelector('.theme-toggle');
  if (!t) return;
  if (localStorage.getItem('vcart_theme') === 'dark') document.documentElement.setAttribute('data-theme','dark');
  t.addEventListener('click', () => {
    const d = document.documentElement.getAttribute('data-theme') === 'dark';
    d ? document.documentElement.removeAttribute('data-theme') : document.documentElement.setAttribute('data-theme','dark');
    localStorage.setItem('vcart_theme', d ? 'light' : 'dark');
  });
}

/* Scroll Top */
function initScrollTop() {
  const b = document.querySelector('.scroll-top');
  if (!b) return;
  window.addEventListener('scroll', () => b.classList.toggle('visible', window.pageYOffset > 400));
  b.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* Animations */
function initAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.05 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

/* Page Reveal */
function initPageReveal() {
  document.body.classList.add('page-reveal');
}

/* Search */
function initSearch() {
  const input = document.querySelector('.navbar-search input');
  const suggestions = document.querySelector('.search-suggestions');
  if (!input || !suggestions) return;

  input.addEventListener('focus', () => {
    if (input.value.trim().length > 0) showSuggestions(input.value.trim());
  });

  input.addEventListener('input', Utils.debounce(() => {
    const q = input.value.trim();
    if (q.length > 0) showSuggestions(q);
    else suggestions.classList.remove('show');
  }, 200));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const q = input.value.trim();
      if (q.length > 0) {
        window.location.href = '/pages/products.html?search=' + encodeURIComponent(q);
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar-search')) suggestions.classList.remove('show');
  });

  function showSuggestions(q) {
    const lower = q.toLowerCase();
    const results = ProductsDB.filter(p => p.name.toLowerCase().includes(lower)).slice(0, 5);
    if (results.length === 0) { suggestions.classList.remove('show'); return; }
    suggestions.innerHTML =
      `<div class="suggestion-title">Products</div>` +
      results.map(p =>
        `<a href="/pages/product-detail.html?id=${p.id}" class="suggestion-item">
          <span class="suggestion-icon">&#x1F4E6;</span>
          ${p.name}
        </a>`
      ).join('') +
      `<a href="/pages/products.html?search=${encodeURIComponent(q)}" class="suggestion-item" style="color:var(--primary);font-weight:600;border-top:1px solid var(--border);">
        <span>&#x1F50D;</span> See all results for "${q}"
      </a>`;
    suggestions.classList.add('show');
  }
}

/* Handle URL params on Products Page */
function handleUrlCategoryFilter() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  const search = params.get('search');

  if (category) {
    const checkboxes = document.querySelectorAll('.category-filter');
    checkboxes.forEach(cb => {
      if (cb.value.toLowerCase() === category.toLowerCase()) {
        cb.checked = true;
      }
    });
  }

  if (search && !category) {
    const input = document.querySelector('.navbar-search input');
    if (input) {
      input.value = search;
      setTimeout(() => {
        const results = ProductsDB.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        if (results.length > 0) {
          const container = document.getElementById('all-products');
          if (container) {
            container.innerHTML = results.map(renderCard).join('');
            const count = document.getElementById('result-count');
            if (count) count.textContent = 'Showing ' + results.length + ' results for "' + search + '"';
          }
        }
      }, 100);
    }
  }
}

/* ============================
   PRODUCT LISTING
   ============================ */
function initProductPage() {
  const container = document.getElementById('all-products');
  if (!container) return;
  let filtered = [...ProductsDB];
  let sortBy = 'default';

  function render() {
    container.innerHTML = filtered.map(renderCard).join('');
    const count = document.getElementById('result-count');
    if (count) count.textContent = 'Showing ' + filtered.length + ' products';
    initAnimations();
  }

  const sort = document.getElementById('sort-select');
  if (sort) sort.addEventListener('change', () => { sortBy = sort.value; apply(); });

  function apply() {
    let r = [...ProductsDB];
    const cats = [];
    document.querySelectorAll('.category-filter:checked').forEach(cb => cats.push(cb.value));
    if (cats.length) r = r.filter(p => cats.includes(p.category));
    const pr = document.getElementById('price-range');
    if (pr) { r = r.filter(p => p.price <= parseInt(pr.value)); document.getElementById('price-label').textContent = 'Max: \u20B9' + parseInt(pr.value).toLocaleString('en-IN'); }
    if (sortBy === 'price-low') r.sort((a,b) => a.price-b.price);
    else if (sortBy === 'price-high') r.sort((a,b) => b.price-a.price);
    else if (sortBy === 'rating') r.sort((a,b) => b.rating-a.rating);
    else if (sortBy === 'name') r.sort((a,b) => a.name.localeCompare(b.name));
    filtered = r; render();
  }

  document.querySelectorAll('.category-filter').forEach(cb => cb.addEventListener('change', apply));
  const pr = document.getElementById('price-range');
  if (pr) pr.addEventListener('input', Utils.debounce(apply, 200));

  // Check for URL category param and apply it
  const params = new URLSearchParams(window.location.search);
  const urlCat = params.get('category');
  const urlSearch = params.get('search');

  if (urlCat || urlSearch) {
    if (urlCat) {
      document.querySelectorAll('.category-filter').forEach(cb => {
        cb.checked = cb.value.toLowerCase() === urlCat.toLowerCase();
      });
    }
    apply();
    if (urlSearch) {
      const r2 = ProductsDB.filter(p => p.name.toLowerCase().includes(urlSearch.toLowerCase()));
      filtered = r2; render();
      const count = document.getElementById('result-count');
      if (count) count.textContent = 'Showing ' + r2.length + ' results for "' + urlSearch + '"';
    }
  } else {
    render();
  }

  const ft = document.querySelector('.filter-toggle');
  const sb = document.querySelector('.products-sidebar');
  if (ft && sb) ft.addEventListener('click', () => sb.classList.toggle('mobile-open'));
}

/* ============================
   PRODUCT DETAIL
   ============================ */
function initProductDetail() {
  const c = document.getElementById('product-detail-container');
  if (!c) return;
  const id = parseInt(new URLSearchParams(window.location.search).get('id')) || 1;
  const p = ProductsDB.find(x => x.id === id) || ProductsDB[0];
  if (!p) { c.innerHTML = '<div class="empty-state"><h3>Product not found</h3></div>'; return; }

  const stars = '\u2605'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '\u00BD' : '') + '\u2606'.repeat(5 - Math.round(p.rating));
  const imgUrl = Utils.getProductImageUrl(p, 600, 600);

  c.innerHTML = `<div class="product-detail-layout">
    <div class="product-gallery">
      <div class="main-image" id="main-img">
        <img src="${imgUrl}" alt="${p.name}" id="main-img-el">
      </div>
      <div class="image-thumbnails">
        <div class="thumb active"><img src="${imgUrl}" alt=""></div>
        <div class="thumb"><img src="${Utils.getProductImageUrl({...p, id: p.id+100}, 600, 600)}" alt=""></div>
        <div class="thumb"><img src="${Utils.getProductImageUrl({...p, id: p.id+200}, 600, 600)}" alt=""></div>
        <div class="thumb"><img src="${Utils.getProductImageUrl({...p, id: p.id+300}, 600, 600)}" alt=""></div>
      </div>
    </div>
    <div class="product-info">
      <div class="product-breadcrumb"><a href="/index.html">Home</a> / <a href="/pages/products.html">${p.category}</a> / <span>${p.name}</span></div>
      <h1>${p.name}</h1>
      <div class="product-rating-large"><div class="rating-badge">${p.rating} &#x2605;</div><span>${p.reviews.toLocaleString()} reviews</span></div>
      <div class="product-price-section">
        <div class="price-row"><span class="current-price">&#x20B9;${p.price.toLocaleString('en-IN')}</span><span class="original-price">&#x20B9;${p.originalPrice.toLocaleString('en-IN')}</span><span class="discount-badge">${Math.round((1-p.price/p.originalPrice)*100)}% off</span></div>
        <div class="tax-info">inclusive of all taxes</div>
      </div>
      <div class="product-description"><p>${p.desc || ''}</p></div>
      ${p.specs ? `<div class="product-specs"><h3>Specifications</h3>${Object.entries(p.specs).map(([k,v]) => `<div class="spec-row"><span class="spec-label">${k}</span><span class="spec-value">${v}</span></div>`).join('')}</div>` : ''}
      <div class="qty-selector"><label>Qty:</label><div class="qty-controls"><button id="qty-m">&#x2212;</button><span id="qty-v">1</span><button id="qty-p">+</button></div></div>
      <div class="product-actions"><button class="btn btn-primary" id="dtl-add-cart">Add to Cart</button><button class="btn btn-accent" id="dtl-buy">Buy Now</button></div>
    </div>
  </div>
  <div class="section"><div class="section-header"><div class="left"><h2>Related Products</h2></div></div><div class="products-grid" id="related-products"></div></div>`;

  let qty = 1;
  document.getElementById('qty-m').addEventListener('click', () => { qty = Math.max(1, qty-1); document.getElementById('qty-v').textContent = qty; });
  document.getElementById('qty-p').addEventListener('click', () => { qty++; document.getElementById('qty-v').textContent = qty; });
  document.getElementById('dtl-add-cart').addEventListener('click', () => { for (let i=0; i<qty; i++) Cart.addItem(p); });
  document.getElementById('dtl-buy').addEventListener('click', () => { for (let i=0; i<qty; i++) Cart.addItem(p); window.location.href = '/pages/checkout.html'; });

  document.querySelectorAll('.image-thumbnails .thumb').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('.image-thumbnails .thumb').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.getElementById('main-img-el').src = t.querySelector('img').src;
  }));

  const main = document.getElementById('main-img');
  const img = document.getElementById('main-img-el');
  main.addEventListener('mousemove', e => {
    const r = main.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    img.style.transformOrigin = x + '% ' + y + '%';
    img.style.transform = 'scale(1.5)';
  });
  main.addEventListener('mouseleave', () => { img.style.transform = 'scale(1)'; });

  const related = ProductsDB.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  document.getElementById('related-products').innerHTML = (related.length ? related : ProductsDB.filter(x => x.id !== p.id).slice(0, 4)).map(renderCard).join('');
}

/* ============================
   CHECKOUT
   ============================ */
function initCheckout() {
  const c = document.getElementById('checkout-items');
  if (!c) return;
  const items = Cart.getItems();
  if (!items.length) { c.innerHTML = '<div class="empty-state"><h3>Your cart is empty</h3><a href="/pages/products.html" class="btn btn-primary">Shop Now</a></div>'; return; }
  c.innerHTML = items.map(i =>
    `<div class="review-item"><img src="${Utils.getProductImageUrl(i, 100, 100)}" alt="${i.name}" loading="lazy"><div class="item-details"><h4>${i.name}</h4><p>Qty: ${i.quantity}</p><p>&#x20B9;${(i.price*i.quantity).toLocaleString('en-IN')}</p></div></div>`
  ).join('');
  const sub = Cart.getTotal(), ship = sub > 500 ? 0 : 49;
  ['checkout-subtotal', 'checkout-shipping', 'checkout-total'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === 'checkout-subtotal') el.textContent = '\u20B9'+sub.toLocaleString('en-IN');
      else if (id === 'checkout-shipping') el.textContent = ship === 0 ? 'Free' : '\u20B9'+ship.toLocaleString('en-IN');
      else el.textContent = '\u20B9'+(sub+ship).toLocaleString('en-IN');
    }
  });
  const btn = document.getElementById('place-order');
  if (btn) btn.addEventListener('click', () => {
    if (!Auth.isLoggedIn()) { Utils.showToast('Please login to place order','error'); setTimeout(() => { window.location.href = '/pages/login.html?redirect='+encodeURIComponent(window.location.pathname); },1000); return; }
    Cart.clear(); window.location.href = '/pages/order-success.html';
  });
}

/* ============================
   PROFILE
   ============================ */
function initProfile() {
  const c = document.getElementById('profile-content-area');
  if (!c) return;
  const user = Auth.getCurrentUser();
  if (!user) { c.innerHTML = '<div class="empty-state"><h3>Please login to view your profile</h3><a href="/pages/login.html" class="btn btn-primary">Login</a></div>'; return; }
  document.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    renderTab(b.dataset.tab);
  }));
  renderTab('orders');
  function renderTab(tab) {
    if (tab === 'orders') c.innerHTML = '<h3 style="margin-bottom:16px;font-size:var(--font-lg);font-weight:700;">Order History</h3><div class="empty-state" style="padding:10px;"><p>No orders yet.</p><a href="/pages/products.html" class="btn btn-primary" style="margin-top:12px;">Start Shopping</a></div>';
    else if (tab === 'details') c.innerHTML = '<h3 style="margin-bottom:16px;font-size:var(--font-lg);font-weight:700;">Account Details</h3><div class="form-group"><label>Username</label><input type="text" value="' + user.username + '" disabled style="opacity:0.6;"></div><div class="form-group"><label>Email</label><input type="email" value="' + (user.email || 'Not provided') + '" disabled style="opacity:0.6;"></div>';
    else if (tab === 'addresses') c.innerHTML = '<h3 style="margin-bottom:16px;font-size:var(--font-lg);font-weight:700;">Saved Addresses</h3><div class="empty-state" style="padding:10px;"><p>No saved addresses yet.</p></div>';
  }
}

/* Order Success */
function initOrderSuccess() {
  const el = document.getElementById('order-number');
  if (el) el.textContent = 'ORD-' + Date.now().toString(36).toUpperCase();
}

/* ============================
   BUTTON RIPPLE + CART/WISHLIST EVENTS
   ============================ */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (btn) {
    const r = document.createElement('span');
    r.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const s = Math.max(rect.width, rect.height);
    r.style.width = r.style.height = s + 'px';
    r.style.left = (e.clientX - rect.left - s/2) + 'px';
    r.style.top = (e.clientY - rect.top - s/2) + 'px';
    btn.appendChild(r);
    setTimeout(() => r.remove(), 600);
  }

  const atc = e.target.closest('.add-to-cart-btn');
  if (atc) {
    const pid = parseInt(atc.dataset.id);
    const prod = ProductsDB.find(p => p.id === pid);
    if (prod) Cart.addItem(prod);
  }

  const wl = e.target.closest('.card-wishlist');
  if (wl) {
    wl.classList.toggle('active');
    Utils.showToast(wl.classList.contains('active') ? 'Added to wishlist' : 'Removed from wishlist');
  }
});
