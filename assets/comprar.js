// Carrinho mais robusto
(() => {
  let cart = [];

  // Utilidades
  const $ = (sel) => document.querySelector(sel);
  const byId = (id) => document.getElementById(id);
  const toNumber = (v) =>
    typeof v === 'string' ? Number(v.replace(/\./g, '').replace(',', '.')) : Number(v);
  const brl = (n) =>
    (Number(n) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Cache de elementos (se algum faltar, evitamos quebrar)
  const els = {
    count: byId('cartCount'),
    items: byId('cartItems'),
    total: byId('cartTotal'),
    sidebar: byId('cartSidebar'),
    overlay: byId('cartOverlay'),
    icon: $('.cart-icon'),
  };

  // ==== Ações do carrinho ====
function addToCart(name, price, image) {
  const p = toNumber(price);
  const existing = cart.find((i) => i.name === name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      name,
      price: p,
      quantity: 1,
      image: image // 👉 guarda a imagem
    });
  }

  updateCartUI();
  showAddedToCartAnimation();
}

  function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
      cart.splice(index, 1);
      updateCartUI();
    }
  }

  function updateQuantity(index, newQuantity) {
    if (index < 0 || index >= cart.length) return;
    const q = Number(newQuantity);
    if (!Number.isFinite(q) || q <= 0) {
      removeFromCart(index);
      return;
    }
    cart[index].quantity = q;
    updateCartUI();
  }

  function updateCartUI() {
    if (!els.items || !els.count || !els.total) return;

    // Contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    els.count.textContent = totalItems;

    // Lista de itens
    if (cart.length === 0) {
      els.items.innerHTML = `
        <div class="empty-cart">
          <p>Sua sacola está vazia</p>
          <p style="font-size:14px;color:#999;margin-top:10px;">Adicione produtos para continuar</p>
        </div>
      `;
    } else {
      cartItems.innerHTML = cart
  .map(
    (item, index) => `
      <div class="cart-item">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;" />
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${brl(item.price)}</div>
          <div class="quantity-controls">
            <button onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
             </div>
              <button class="remove-btn" onclick="removeFromCart(${index})">Remover</button>
            </div>
          </div>
      </div>
    `
  )
  .join('');

    }

    // Total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    els.total.textContent = brl(total);
  }

  function openCart() {
    if (els.sidebar) els.sidebar.classList.add('open');
    if (els.overlay) els.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (els.sidebar) els.sidebar.classList.remove('open');
    if (els.overlay) els.overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function checkout() {
    if (cart.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemsList = cart.map((item) => `${item.quantity}x ${item.name}`).join('\n');

    alert(`Finalizando compra!\n\nItens:\n${itemsList}\n\nTotal: ${brl(total)}\n\nObrigado pela preferência!`);

    cart = [];
    updateCartUI();
    closeCart();
  }

  function showAddedToCartAnimation() {
    openCart();
    if (!els.icon) return;
    // animação simples sem depender de cor pré-existente
    els.icon.style.transform = 'scale(1.2)';
    setTimeout(() => {
      els.icon.style.transform = 'scale(1)';
    }, 300);
  }

  // Atalhos e exports globais (necessário porque usamos onclick no HTML gerado)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });

  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.updateQuantity = updateQuantity;
  window.checkout = checkout;
  window.openCart = openCart;
  window.closeCart = closeCart;

  // Inicializa
  updateCartUI();
})();
