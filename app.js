// Simple FARM2DOOR app.js - uses localStorage (no backend)

// Sample products
const sample = [
  {id:'p1', name:'Banana', cat:'fruits', price:1.2, img:'https://plus.unsplash.com/premium_photo-1724250081102-cab0e5cb314c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFuYW5hfGVufDB8fDB8fHww'},
  {id:'p2', name:'Strawberry', cat:'fruits', price:3.2, img:'https://images.unsplash.com/photo-1623227866882-c005c26dfe41?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3Rhd2JlcnJ5fGVufDB8fDB8fHww'},
  {id:'p3', name:'Eggs (6)', cat:'dairy', price:2.5, img:'https://plus.unsplash.com/premium_photo-1671022581636-e711d888af04?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWdnfGVufDB8fDB8fHww'},
  {id:'p4', name:'Milk (1L)', cat:'dairy', price:1.9, img:'https://media.istockphoto.com/id/2185517529/photo/a-glass-of-fresh-yogurt.webp?a=1&b=1&s=612x612&w=0&k=20&c=lCNjgut_Fg_4Nej7YScSWCthswKJY6dGo4MuZJTVhAo='},
  {id:'p5', name:'Spinach', cat:'vegetables', price:1.2, img:'https://plus.unsplash.com/premium_photo-1701714006884-30414c114152?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c3BpbmFjaHxlbnwwfHwwfHx8MA%3D%3D'},
  {id:'p6', name:'Apple', cat:'fruits', price:1.5, img:'https://plus.unsplash.com/premium_photo-1667049292983-d2524dd0ef08?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXBwbGVzfGVufDB8fDB8fHww'}
];




const PKEY='farm_products', CKEY='farm_cart', OKEY='farm_orders', RKEY='farm_reviews';

// init products
// Always use the sample array (clears old products with missing images)
localStorage.setItem(PKEY, JSON.stringify(sample));



// helpers
const $=(s)=>document.querySelector(s);
const $$=(s)=>document.querySelectorAll(s);

function getProducts(){ return JSON.parse(localStorage.getItem(PKEY)) || []; }
function getCart(){ return JSON.parse(localStorage.getItem(CKEY)) || []; }
function getOrders(){ return JSON.parse(localStorage.getItem(OKEY)) || []; }
function getReviews(){ return JSON.parse(localStorage.getItem(RKEY)) || []; }

function saveCart(c){ localStorage.setItem(CKEY, JSON.stringify(c)); }
function saveOrders(o){ localStorage.setItem(OKEY, JSON.stringify(o)); }
function saveProducts(p){ localStorage.setItem(PKEY, JSON.stringify(p)); }
function saveReviews(r){ localStorage.setItem(RKEY, JSON.stringify(r)); }

// render products
function renderProducts(){
  const grid = $('#grid'); grid.innerHTML='';
  const q = $('#search').value.toLowerCase();
  const f = $('#filter').value;
  getProducts().filter(p=> (f==='all'||p.cat===f) && p.name.toLowerCase().includes(q))
    .forEach(p=>{
      const div=document.createElement('div'); div.className='col-md-4';
      div.innerHTML=`
        <div class="card p-2 h-100">
          <img class="product-img" src="${p.img}" alt="${p.name}">
          <div class="mt-2">
            <h6 class="mb-1">${p.name}</h6>
            <small class="text-muted">${p.cat}</small>
            <div class="d-flex justify-content-between align-items-center mt-2">
              <div class="fw-bold">$${p.price.toFixed(2)}</div>
              <div>
                <button class="btn btn-sm btn-outline-primary" onclick="view('${p.id}')">View</button>
                <button class="btn btn-sm btn-success" onclick="addCart('${p.id}')">Add</button>
              </div>
            </div>
          </div>
        </div>`;
      grid.appendChild(div);
    });
}


// view simple
window.view=(id)=> {
  const p = getProducts().find(x=>x.id===id);
  alert(`${p.name}\nCategory: ${p.cat}\nPrice: $${p.price}`);
};

// cart
function updateCartCount(){
  const cnt = getCart().reduce((s,i)=>s+i.qty,0);
  $('#cartCount').innerText = cnt;
}
function addCart(id){
  const cart = getCart();
  const prod = getProducts().find(p=>p.id===id);
  const item = cart.find(i=>i.id===id);
  if(item) item.qty++; else cart.push({id, name:prod.name, price:prod.price, qty:1});
  saveCart(cart); renderCart(); updateCartCount();
}
function renderCart(){
  const list = $('#cartList'); list.innerHTML='';
  const cart = getCart();
  if(cart.length===0){ list.innerHTML='<div class="text-muted">Cart is empty</div>'; }
  cart.forEach(i=>{
    const el = document.createElement('div'); el.className='list-group-item d-flex justify-content-between';
    el.innerHTML = `<div><strong>${i.name}</strong><br><small>Qty: ${i.qty}</small></div>
      <div class="text-end">
        <div class="fw-bold">$${(i.price*i.qty).toFixed(2)}</div>
        <div class="mt-1">
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQty('${i.id}',-1)">-</button>
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQty('${i.id}',1)">+</button>
        </div>
      </div>`;
    list.appendChild(el);
  });
  $('#itemCount').innerText = cart.reduce((s,i)=>s+i.qty,0);
  $('#totalPrice').innerText = cart.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2);
}
window.changeQty=(id,delta)=>{
  const cart = getCart(); const item = cart.find(x=>x.id===id); if(!item) return;
  item.qty += delta; if(item.qty<=0) { const idx=cart.indexOf(item); cart.splice(idx,1); }
  saveCart(cart); renderCart(); updateCartCount();
};

// checkout
$('#checkoutForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const cart = getCart(); if(cart.length===0) return alert('Cart empty');
  const name = $('#name').value.trim(); const phone = $('#phone').value.trim(); const addr = $('#address').value.trim();
  if(!name||!phone||!addr) return alert('Fill form');
  const orders = getOrders();
  const id = 'ORD' + Date.now().toString().slice(-6);
  const order = {id, name, phone, addr, items:cart, total: cart.reduce((s,i)=>s+i.price*i.qty,0), status:'Placed', created:new Date().toISOString()};
  orders.push(order); saveOrders(orders);
  localStorage.removeItem(CKEY); renderCart(); updateCartCount(); renderOrders(); bootstrap.Modal.getInstance($('#checkoutModal')).hide();
  alert('Order placed. ID: ' + id);
});

// orders
function renderOrders(){
  const out = $('#ordersArea'); out.innerHTML='';
  getOrders().slice().reverse().forEach(o=>{
    const el = document.createElement('div'); el.className='list-group-item';
    el.innerHTML = `<div class="d-flex justify-content-between">
      <div><strong>${o.id}</strong><br><small>${new Date(o.created).toLocaleString()}</small></div>
      <div class="text-end"><div class="badge bg-info">${o.status}</div><div class="mt-2">$${o.total.toFixed(2)}</div></div>
    </div>`;
    out.appendChild(el);
  });
}

// tracking
$('#trackBtn').addEventListener('click', ()=>{
  const id = $('#trackId').value.trim(); if(!id) return alert('Enter ID');
  const o = getOrders().find(x=>x.id===id);
  const res = $('#trackResult'); res.innerHTML='';
  if(!o) return res.innerHTML = `<div class="alert alert-warning">Order not found</div>`;
  const steps = ['Placed','Packed','Out for Delivery','Delivered'];
  const cur = steps.indexOf(o.status);
  steps.forEach((s,idx)=>{
    const step = document.createElement('div'); step.className = 'step ' + (idx<=cur? 'done':'' );
    step.innerHTML = `<div class="dot"></div><div><strong>${s}</strong></div>`;
    res.appendChild(step);
  });
});

// reviews
$('#reviewForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const r = getReviews();
  r.push({name:$('#rname').value.trim(), rating:$('#rrating').value, text:$('#rtext').value.trim(), date:new Date().toISOString()});
  saveReviews(r); $('#reviewForm').reset(); renderReviews();
});
function renderReviews(){
  const div = $('#reviewsList'); div.innerHTML='';
  getReviews().slice().reverse().forEach(r=>{
    const el = document.createElement('div'); el.className='card p-2 mb-2';
    el.innerHTML = `<strong>${r.name}</strong> <small class="text-muted">(${new Date(r.date).toLocaleDateString()})</small><div>Rating: ${r.rating}/5</div><div>${r.text}</div>`;
    div.appendChild(el);
  });
}

// admin add product
$('#addForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const p = getProducts(); const id = 'p' + Date.now().toString().slice(-4);
  p.push({id, name:$('#pname').value.trim(), cat:$('#pcat').value.trim().toLowerCase(), price:parseFloat($('#pprice').value)});
  saveProducts(p); $('#addForm').reset(); renderProducts(); renderAdmin();
});
function renderAdmin(){
  const el = $('#adminList'); el.innerHTML='';
  getProducts().forEach(p=>{
    const row = document.createElement('div'); row.className='border p-2 mb-1';
    row.innerHTML = `<strong>${p.name}</strong> — ${p.cat} — $${p.price.toFixed(2)}`;
    el.appendChild(row);
  });
}

// analytics (simple charts)
function renderCharts(){
  const orders = getOrders();
  const byDate = {};
  orders.forEach(o=>{ const d = new Date(o.created).toLocaleDateString(); byDate[d] = (byDate[d]||0) + o.total; });
  const labels = Object.keys(byDate), data = Object.values(byDate);
  const ctx = document.getElementById('salesChart'); if(ctx) new Chart(ctx,{type:'bar', data:{labels, datasets:[{label:'Sales $', data, backgroundColor:'#2aa44f'}]}});
  const prodMap = {}; orders.forEach(o=> o.items.forEach(i=> prodMap[i.name]=(prodMap[i.name]||0)+i.qty));
  const pLabels = Object.keys(prodMap), pData = Object.values(prodMap);
  const ctx2 = document.getElementById('prodChart'); if(ctx2) new Chart(ctx2,{type:'pie', data:{labels:pLabels, datasets:[{data:pData}]}}); 
}

// live search + filter
$('#search').addEventListener('input', renderProducts);
$('#filter').addEventListener('change', renderProducts);

// init on load
window.addEventListener('DOMContentLoaded', ()=>{
  renderProducts(); renderCart(); updateCartCount(); renderOrders(); renderReviews(); renderAdmin(); renderCharts();
});
