// Basic cart with LocalStorage
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function saveCart(){
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function addToCart(product){
  const existing = cart.find(p => p.id === product.id);
  if(existing){
    existing.qty += 1;
  }else{
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
}

function removeFromCart(id){
  cart = cart.filter(p => p.id !== id);
  saveCart();
}

function changeQty(id, delta){
  const item = cart.find(p => p.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){
    removeFromCart(id);
  }else{
    saveCart();
  }
}

function formatBDT(value){
  return `৳${value.toLocaleString('en-BD')}`;
}

function renderCart(){
  // Count
  const count = cart.reduce((acc, p) => acc + p.qty, 0);
  cartCountEl.textContent = count;

  // Items
  cartItemsEl.innerHTML = '';
  let total = 0;
  cart.forEach(p => {
    total += p.price * p.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span>${p.name}</span>
      <div class="cart-item__actions">
        <button aria-label="Decrease" data-action="dec" data-id="${p.id}">-</button>
        <span style="margin:0 .5rem">${p.qty}</span>
        <button aria-label="Increase" data-action="inc" data-id="${p.id}">+</button>
        <strong style="margin-left:.8rem">${formatBDT(p.price * p.qty)}</strong>
        <button aria-label="Remove" data-action="del" data-id="${p.id}" style="margin-left:.5rem">🗑️</button>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });

  cartTotalEl.textContent = formatBDT(total);
}

document.addEventListener('click', e => {
  if(e.target.classList.contains('add-to-cart')){
    const card = e.target.closest('.card');
    const product = {
      id: card.dataset.id,
      name: card.dataset.name,
      price: parseInt(card.dataset.price, 10)
    };
    addToCart(product);
  }

  if(e.target.dataset && e.target.dataset.action){
    const id = e.target.dataset.id;
    const action = e.target.dataset.action;
    if(action === 'inc') changeQty(id, +1);
    if(action === 'dec') changeQty(id, -1);
    if(action === 'del') removeFromCart(id);
  }
});

cartBtn.addEventListener('click', () => {
  cartModal.classList.remove('hidden');
});
closeCart.addEventListener('click', () => {
  cartModal.classList.add('hidden');
});
cartModal.addEventListener('click', (e) => {
  if(e.target.classList.contains('cart-modal__backdrop')){
    cartModal.classList.add('hidden');
  }
});

checkoutBtn.addEventListener('click', () => {
  if(cart.length === 0){
    alert('Your cart is empty!');
    return;
  }
  alert('Thank you! Checkout flow not implemented yet.');
});

renderCart();
