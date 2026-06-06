// VCart Cart Module

const Cart = {
  init() {
    this.updateBadge();
    this.bindEvents();
    this.renderCartPage();
  },

  getItems() {
    return Utils.getFromStorage('vcart_cart', []);
  },

  saveItems(items) {
    Utils.setToStorage('vcart_cart', items);
    this.updateBadge();
  },

  addItem(product) {
    const items = this.getItems();
    const existing = items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ ...product, quantity: 1 });
    }
    this.saveItems(items);
    Utils.showToast(product.name + ' added to cart!');
  },

  removeItem(productId) {
    let items = this.getItems();
    items = items.filter(item => item.id !== productId);
    this.saveItems(items);
    this.renderCartPage();
    Utils.showToast('Item removed from cart');
  },

  updateQuantity(productId, delta) {
    const items = this.getItems();
    const item = items.find(i => i.id === productId);
    if (item) {
      item.quantity = Math.max(1, item.quantity + delta);
      this.saveItems(items);
      this.renderCartPage();
    }
  },

  getTotal() {
    return this.getItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getCount() {
    const items = this.getItems();
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    return totalQty;
  },

  getItemCount() {
    return this.getItems().length;
  },

  updateBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = this.getCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  clear() {
    this.saveItems([]);
    this.renderCartPage();
  },

  renderCartPage() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    const items = this.getItems();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <div class="empty-icon">\uD83D\uDED2</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <a href="/pages/products.html" class="btn btn-primary">Start Shopping</a>
        </div>
      `;
      const summary = document.querySelector('.cart-summary');
      if (summary) summary.style.display = 'none';
      return;
    }

    const summary = document.querySelector('.cart-summary');
    if (summary) summary.style.display = 'block';

    container.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">
          <img src="${Utils.getProductImage(item.seed || 'product' + item.id)}" alt="${item.name}" loading="lazy">
        </div>
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <div class="cart-item-category">${item.category}</div>
          <div class="cart-item-price">${Utils.formatCurrency(item.price)}</div>
        </div>
        <div class="cart-item-actions">
          <div class="qty-controls">
            <button class="qty-minus" data-id="${item.id}">\u2212</button>
            <span>${item.quantity}</span>
            <button class="qty-plus" data-id="${item.id}">+</button>
          </div>
          <button class="remove-btn" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `).join('');

    // Update summary
    const subtotal = this.getTotal();
    const shipping = subtotal > 500 ? 0 : 49;
    const total = subtotal + shipping;

    document.getElementById('cart-subtotal').textContent = Utils.formatCurrency(subtotal);
    document.getElementById('cart-shipping').textContent = shipping === 0 ? 'Free' : Utils.formatCurrency(shipping);
    document.getElementById('cart-total').textContent = Utils.formatCurrency(total);

    this.bindCartEvents();
  },

  bindCartEvents() {
    document.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => this.updateQuantity(parseInt(btn.dataset.id), -1));
    });

    document.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => this.updateQuantity(parseInt(btn.dataset.id), 1));
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => this.removeItem(parseInt(btn.dataset.id)));
    });
  },

  bindEvents() {
    // Add to cart buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.add-to-cart-btn');
      if (btn) {
        const productId = parseInt(btn.dataset.id);
        const product = ProductsDB.find(p => p.id === productId);
        if (product) {
          this.addItem(product);
          // Ripple effect
          btn.classList.add('added');
          setTimeout(() => btn.classList.remove('added'), 1000);
        }
      }

      // Wishlist toggle
      const wishBtn = e.target.closest('.card-wishlist');
      if (wishBtn) {
        wishBtn.classList.toggle('active');
        const productId = parseInt(wishBtn.dataset.id);
        if (wishBtn.classList.contains('active')) {
          Utils.showToast('Added to wishlist');
        } else {
          Utils.showToast('Removed from wishlist');
        }
      }
    });
  }
};
