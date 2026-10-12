const menu = [
  {id:1,name:'Classic Masala Dosa',category:'Mains',price:120,rating:'4.9',tag:'House favourite',description:'Golden, crisp dosa with a comforting potato masala.',image:'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80'},
  {id:2,name:'Paneer Tikka',category:'Starters',price:190,rating:'4.8',tag:'Vegetarian',description:'Smoky paneer, gentle spices and a fresh mint dip.',image:'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80'},
  {id:3,name:'South Indian Thali',category:'Mains',price:240,rating:'4.9',tag:'Full meal',description:'A colourful selection of comforting regional flavours.',image:'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80'},
  {id:4,name:'Crispy Veg Bites',category:'Starters',price:150,rating:'4.7',tag:'Crispy & light',description:'Crunchy seasonal vegetables with a house-made dip.',image:'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80'},
  {id:5,name:'Fresh Lime Cooler',category:'Drinks',price:70,rating:'4.8',tag:'Refreshing',description:'Fresh lime, a hint of sweetness and plenty of chill.',image:'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80'},
  {id:6,name:'Filter Coffee',category:'Drinks',price:50,rating:'4.9',tag:'South Indian classic',description:'Aromatic coffee with a rich, smooth finish.',image:'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80'},
  {id:7,name:'Chocolate Brownie',category:'Desserts',price:110,rating:'4.8',tag:'Sweet finish',description:'A soft, rich chocolate treat for your sweet tooth.',image:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80'},
  {id:8,name:'Creamy Payasam',category:'Desserts',price:90,rating:'4.7',tag:'Traditional',description:'A comforting dessert inspired by a homestyle favourite.',image:'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80'},
  {id:9,name:'Garden Fresh Salad',category:'Starters',price:130,rating:'4.6',tag:'Fresh pick',description:'Crisp greens and seasonal vegetables, simply dressed.',image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80'}
];
const cart = new Map();
let activeCategory = 'All';
let toastTimer;
const $ = (selector) => document.querySelector(selector);
const money = (amount) => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(amount);
const totalItems = () => [...cart.values()].reduce((sum,item)=>sum+item.quantity,0);
const totalPrice = () => [...cart.values()].reduce((sum,item)=>sum+item.price*item.quantity,0);

function renderMenu(){
  const search = $('#menuSearch').value.trim().toLowerCase();
  const filtered = menu.filter(item => (activeCategory==='All'||item.category===activeCategory) && (item.name.toLowerCase().includes(search)||item.description.toLowerCase().includes(search)||item.category.toLowerCase().includes(search)));
  $('#foodGrid').innerHTML = filtered.length ? filtered.map((item,index)=>`
    <article class="food-card" style="animation-delay:${index*55}ms">
      <div class="food-photo"><img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.style.display='none'"><span class="food-tag">${item.tag}</span></div>
      <div class="food-info"><div class="food-info-top"><h3>${item.name}</h3><span class="food-price">${money(item.price)}</span></div><p>${item.description}</p><div class="food-card-bottom"><span class="food-rating">★ ${item.rating} <span style="color:#888276">· ${item.category}</span></span><button class="add-button" data-add="${item.id}">＋ Add to order</button></div></div>
    </article>`).join('') : '<div class="no-results">No dishes found. Try another search.</div>';
}
function addToCart(id){const item=menu.find(food=>food.id===Number(id));if(!item)return;const existing=cart.get(item.id);cart.set(item.id,{...item,quantity:existing?existing.quantity+1:1});renderCart();showToast(`${item.name} added to your order`)}
function changeQuantity(id,delta){const item=cart.get(Number(id));if(!item)return;item.quantity+=delta;if(item.quantity<=0)cart.delete(Number(id));else cart.set(Number(id),item);renderCart()}
function removeItem(id){cart.delete(Number(id));renderCart();showToast('Dish removed from your order')}
function renderCart(){
  $('#cartCount').textContent=totalItems();$('#cartSubtotal').textContent=money(totalPrice());$('#previewTotal').textContent=money(totalPrice());
  const items=[...cart.values()];
  $('#cartItems').innerHTML=items.length?items.map(item=>`<div class="cart-item"><img src="${item.image}" alt="" onerror="this.style.visibility='hidden'"><div><h3>${item.name}</h3><span class="item-price">${money(item.price)} each</span><div class="quantity-control"><button data-qty="${item.id}" data-delta="-1" aria-label="Decrease ${item.name}">−</button><span>${item.quantity}</span><button data-qty="${item.id}" data-delta="1" aria-label="Increase ${item.name}">+</button></div></div><button class="remove-item" data-remove="${item.id}" aria-label="Remove ${item.name}">×</button></div>`).join(''):'<div class="cart-empty"><span>✳</span><h3>Something delicious?</h3><p>Your cart is waiting for its first dish.</p><button class="under-link" id="browseMenu">Browse the menu ↗</button></div>';
  $('#previewItems').innerHTML=items.length?items.slice(0,4).map(item=>`<div class="preview-row"><span>${item.quantity} × ${item.name}</span><span>${money(item.price*item.quantity)}</span></div>`).join('')+(items.length>4?`<div class="preview-row"><span>And ${items.length-4} more dish(es)</span><span></span></div>`:''):'<p class="empty-note">Your delicious choices will appear here.</p>';
  $('#proceedButton').disabled=!items.length;$('#proceedButton').style.opacity=items.length?'1':'.5';
}
function openCart(){closeAssistant();$('#cartBackdrop').classList.add('show');$('#cartDrawer').classList.add('open');$('#cartDrawer').setAttribute('aria-hidden','false');document.body.classList.add('locked')}
function closeCart(){ $('#cartBackdrop').classList.remove('show');$('#cartDrawer').classList.remove('open');$('#cartDrawer').setAttribute('aria-hidden','true');if(!$('#orderModal').classList.contains('show'))document.body.classList.remove('locked') }
function openModal(){if(!cart.size){showToast('Please add a dish before continuing.');return}closeCart();$('#modalSummary').innerHTML=[...cart.values()].map(item=>`<div class="summary-row"><span>${item.quantity} × ${item.name}</span><span>${money(item.price*item.quantity)}</span></div>`).join('');$('#modalTotal').textContent=money(totalPrice());$('#modalBackdrop').classList.add('show');$('#orderModal').classList.add('show');$('#orderModal').setAttribute('aria-hidden','false');document.body.classList.add('locked')}
function closeModal(){ $('#modalBackdrop').classList.remove('show');$('#orderModal').classList.remove('show');$('#orderModal').setAttribute('aria-hidden','true');document.body.classList.remove('locked') }
function showToast(message){const toast=$('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2500)}
function scrollToMenu(){closeCart();closeModal();$('#menu').scrollIntoView({behavior:'smooth'})}
function closeAssistant(){ $('#assistantPanel').classList.remove('open');$('#assistantPanel').setAttribute('aria-hidden','true') }
function addChatMessage(message,who='bot'){const node=document.createElement('div');node.className='assistant-bubble'+(who==='user'?' user':'');node.textContent=message;$('#assistantMessages').appendChild(node);$('#assistantMessages').scrollTop=$('#assistantMessages').scrollHeight}
function answerAssistant(raw){const text=raw.toLowerCase();let reply;
  if(/price|cost|₹|rupee|cheap|budget/.test(text)){reply='Our menu starts at ₹50 for Filter Coffee. You can see each dish price on its menu card.'}
  else if(/popular|favourite|best|recommend/.test(text)){reply='A few popular picks are Classic Masala Dosa (₹120), South Indian Thali (₹240), and Filter Coffee (₹50). Tap “Add to order” to choose one.'}
  else if(/drink|coffee|juice|lime/.test(text)){reply='For drinks, try Fresh Lime Cooler (₹70) or our South Indian Filter Coffee (₹50). I can show you the drinks menu.';activeCategory='Drinks';renderFilters();renderMenu()}
  else if(/dessert|sweet|chocolate|payasam/.test(text)){reply='For something sweet, try Chocolate Brownie (₹110) or Creamy Payasam (₹90).';activeCategory='Desserts';renderFilters();renderMenu()}
  else if(/main|meal|dosa|thali|hungry/.test(text)){reply='Our mains include Classic Masala Dosa (₹120) and South Indian Thali (₹240). I have filtered the menu to mains for you.';activeCategory='Mains';renderFilters();renderMenu()}
  else if(/starter|snack|paneer|salad/.test(text)){reply='Try Paneer Tikka (₹190), Crispy Veg Bites (₹150), or Garden Fresh Salad (₹130).';activeCategory='Starters';renderFilters();renderMenu()}
  else if(/order|cart|add|checkout|proceed/.test(text)){reply=cart.size?`You have ${totalItems()} item(s) in your order, total ${money(totalPrice())}. Open “Your order” to review it.`:'Start by adding a dish from the menu. I’ll keep your selected items in the order panel.'}
  else if(/hello|hi|vanakkam|hey/.test(text)){reply='Vanakkam! Welcome to Depam Hotel. Ask me about mains, starters, drinks, desserts, prices, or popular picks.'}
  else{reply='I can help with menu categories, dish prices, popular picks, and your order. Try asking “What drinks do you have?”'}
  addChatMessage(reply);
}
function renderFilters(){document.querySelectorAll('.filter-chip').forEach(btn=>btn.classList.toggle('active',btn.dataset.category===activeCategory))}

$('#foodGrid').addEventListener('click',event=>{const button=event.target.closest('[data-add]');if(button)addToCart(button.dataset.add)});
$('#filterList').addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;activeCategory=button.dataset.category;renderFilters();renderMenu()});
$('#menuSearch').addEventListener('input',renderMenu);
$('#cartItems').addEventListener('click',event=>{const qty=event.target.closest('[data-qty]');const remove=event.target.closest('[data-remove]');if(qty)changeQuantity(qty.dataset.qty,Number(qty.dataset.delta));if(remove)removeItem(remove.dataset.remove);if(event.target.closest('#browseMenu'))scrollToMenu()});
$('#cartTrigger').addEventListener('click',openCart);$('#viewOrderBottom').addEventListener('click',openCart);$('#openCartFromPreview').addEventListener('click',openCart);$('#closeCart').addEventListener('click',closeCart);$('#cartBackdrop').addEventListener('click',closeCart);
$('#startOrder').addEventListener('click',()=>{if(cart.size)openCart();else scrollToMenu()});$('#proceedButton').addEventListener('click',openModal);$('#closeModal').addEventListener('click',closeModal);$('#modalBackdrop').addEventListener('click',closeModal);$('#editOrder').addEventListener('click',()=>{closeModal();openCart()});
$('#cancelOrder').addEventListener('click',()=>{closeModal();showToast('No order was placed. You are back on the menu page.');window.scrollTo({top:0,behavior:'smooth'})});
$('#confirmOrder').addEventListener('click',()=>{const orderId='DH'+Math.random().toString(36).slice(2,7).toUpperCase();cart.clear();renderCart();closeModal();showToast(`Demo order ${orderId} confirmed on this page. No restaurant was notified.`);$('#menu').scrollIntoView({behavior:'smooth'})});
$('#clearCart').addEventListener('click',()=>{if(!cart.size){showToast('Your order is already empty.');return}cart.clear();renderCart();showToast('Your order has been cleared.')});
$('#menuToggle').addEventListener('click',()=>{const open=$('#navLinks').classList.toggle('open');$('#menuToggle').setAttribute('aria-expanded',String(open))});document.querySelectorAll('#navLinks a').forEach(link=>link.addEventListener('click',()=>{$('#navLinks').classList.remove('open');$('#menuToggle').setAttribute('aria-expanded','false')}));
$('#assistantFab').addEventListener('click',()=>{const opening=!$('#assistantPanel').classList.contains('open');$('#assistantPanel').classList.toggle('open',opening);$('#assistantPanel').setAttribute('aria-hidden',String(!opening))});$('#closeAssistant').addEventListener('click',closeAssistant);
$('#assistantForm').addEventListener('submit',event=>{event.preventDefault();const input=$('#assistantInput');const message=input.value.trim();if(!message)return;addChatMessage(message,'user');input.value='';answerAssistant(message)});
document.querySelectorAll('[data-reply]').forEach(button=>button.addEventListener('click',()=>{const value=button.dataset.reply;addChatMessage(button.textContent,'user');if(value==='popular')answerAssistant('popular picks');else answerAssistant(value)}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeCart();closeModal();closeAssistant()}});
$('#year').textContent=new Date().getFullYear();
renderMenu();renderCart();
window.addEventListener('load',()=>setTimeout(()=>$('#loader').classList.add('done'),650));
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(element=>observer.observe(element))}else{document.querySelectorAll('.reveal').forEach(element=>element.classList.add('visible'))}
