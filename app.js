document.addEventListener('DOMContentLoaded',()=>{
  // Year in footer
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if(navToggle && mainNav){
    // ensure initial state
    if(!mainNav.hasAttribute('data-visible')) mainNav.setAttribute('data-visible','false');
    navToggle.addEventListener('click',()=>{
      const visible = mainNav.getAttribute('data-visible') === 'true';
      const next = !visible;
      mainNav.setAttribute('data-visible', String(next));
      navToggle.setAttribute('aria-expanded', String(next));
    });
    // close nav when a link is clicked (mobile)
    mainNav.addEventListener('click', e=>{
      if(e.target.tagName === 'A'){
        mainNav.setAttribute('data-visible','false');
        navToggle.setAttribute('aria-expanded','false');
      }
    });
  }

  // Sample products data (cloth images added)
  const products = [
    {
      id:1,
      title:'Amara Silk Set',
      price:'₦65,000',
      images:[
        'jjjj',
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=bd8b0c4f2e7f0d6a1e8b9f9b3a8c4d2e'
      ],
      desc:'Silk blend, tailored fit, hand-stitched details.'
    },
    {
      id:2,
      title:'Nia Ankara Gown',
      price:'₦48,000',
      images:[
        'https://images.unsplash.com/photo-1520975910096-34d9f3b7d061?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=4baf8e7c3c0bf9a432c2cb6e6ddb8d3f',
        'https://images.unsplash.com/photo-1541113800-3f5e6a8b2b1a?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=6e5e9b5a2a9b3c4d5e6f7a8b9c0d1e2f'
      ],
      desc:'Vibrant Ankara, full-length evening gown.'
    },
    {
      id:3,
      title:'Tola Beaded Clutch',
      price:'₦12,500',
      images:[
        'https://images.unsplash.com/photo-1585386959984-a415522a8b11?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=0d40b2a9b2bf0efc2c2f7aaf5f1b9f7f'
      ],
      desc:'Hand-beaded clutch with satin lining.'
    },
    {
      id:4,
      title:'Efe Lace Dress',
      price:'₦72,000',
      images:[
        'bbbb',
        'https://images.unsplash.com/photo-1520975910096-34d9f3b7d061?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=4baf8e7c3c0bf9a432c2cb6e6ddb8d3f'
      ],
      desc:'Delicate lacework, structured silhouette for special occasions.'
    },
    {
      id:5,
      title:'Ada Casual Wrap',
      price:'₦20,500',
      images:[
        'https://images.unsplash.com/photo-1495121605193-b116b5b09a2a?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=6c7b9f2fb2b9f0a1b1c3b5a5f9e7d9a0'
      ],
      desc:'Lightweight wrap dress, perfect for everyday style.'
    },
    {
      id:6,
      title:'Zina Headwrap',
      price:'₦4,200',
      images:[
        'https://images.unsplash.com/photo-1530549387789-4f5b6b3b5d5c?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=8b7c6a5d4e3f2a1b0c9d8e7f6a5b4c3d'
      ],
      desc:'Bold prints, soft cotton, ties easily for multiple styles.'
    }
  ];

  // Render product cards
  const grid = document.getElementById('productGrid');
  if(grid){
    products.forEach(p=>{
      const thumb = (p.images && p.images.length>0) ? p.images[0] : '';
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-media"><img src="${thumb}" alt="${p.title}" loading="lazy"></div>
        <div class="card-body">
          <h3 class="product-title">${p.title}</h3>
          <div class="product-price">${p.price}</div>
          <p class="muted">${p.desc}</p>
          <div class="card-actions">
            <button class="btn btn-small btn-outline quickview" data-id="${p.id}">Quick View</button>
            <button class="btn btn-small" aria-label="Add to cart">Add to Cart</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Show products when Shop Now clicked
  const showBtns = document.querySelectorAll('.show-products');
  const productsSection = document.getElementById('luxury');
  showBtns.forEach(b=>{
    b.addEventListener('click', (e)=>{
      // reveal products
      if(productsSection && productsSection.classList.contains('hidden')){
        productsSection.classList.remove('hidden');
        productsSection.setAttribute('aria-hidden','false');
      }
      // close mobile nav if open
      if(mainNav && mainNav.getAttribute('data-visible') === 'true'){
        mainNav.setAttribute('data-visible','false');
        if(navToggle) navToggle.setAttribute('aria-expanded','false');
      }
      // allow anchor default scroll behavior to #luxury, but ensure smooth scroll
      const id = b.getAttribute('href');
      if(id && id.startsWith('#')){
        const el = document.querySelector(id);
        if(el){
          e.preventDefault();
          el.scrollIntoView({behavior:'smooth',block:'start'});
        }
      }
    });
  });

  // Quick view modal logic
  const modal = document.getElementById('quickView');
  const modalBody = document.getElementById('modalBody');
  const closeModal = document.getElementById('closeModal');
  const modalBackdrop = document.getElementById('modalBackdrop');

  function openModal(product){
    if(!modal) return;
    modal.setAttribute('aria-hidden','false');
    modal.style.display = 'block';
    // build gallery
    const imgs = (product.images && product.images.length) ? product.images : [];
    const mainImg = imgs[0] || '';
    let thumbsHTML = '';
    if(imgs.length>1){
      thumbsHTML = `<div style="display:flex;gap:8px;margin-top:10px">` + imgs.map((src,idx)=>`<img class="modal-thumb" data-src="${src}" src="${src}" alt="${product.title} ${idx+1}" style="width:64px;height:64px;object-fit:cover;border-radius:6px;cursor:pointer;opacity:${idx===0?1:0.75}">`).join('') + `</div>`;
    }
    modalBody.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr;gap:12px">
        <img id="modalMainImg" src="${mainImg}" alt="${product.title}" style="width:100%;border-radius:8px;object-fit:cover">
        <div>
          <h3 id="quickViewTitle">${product.title}</h3>
          <p class="product-price">${product.price}</p>
          <p class="muted">${product.desc}</p>
          <div style="margin-top:12px;display:flex;gap:8px">
            <button class="btn btn-primary">Buy Now</button>
            <button class="btn btn-outline" id="modalAddCart">Add to Cart</button>
          </div>
          ${thumbsHTML}
        </div>
      </div>
    `;
    // thumbnail click swapping
    modalBody.querySelectorAll('.modal-thumb').forEach(t=>{
      t.addEventListener('click', (ev)=>{
        const src = t.getAttribute('data-src');
        const main = document.getElementById('modalMainImg');
        if(main && src){
          main.src = src;
          // adjust opacity
          modalBody.querySelectorAll('.modal-thumb').forEach(tt=>tt.style.opacity = '0.75');
          t.style.opacity = '1';
        }
      });
    });
    document.body.style.overflow = 'hidden';
  }

  function closeModalFn(){
    if(!modal) return;
    modal.setAttribute('aria-hidden','true');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  document.addEventListener('click',e=>{
    if(e.target.matches('.quickview')){
      const id = Number(e.target.getAttribute('data-id'));
      const product = products.find(p=>p.id===id);
      if(product) openModal(product);
    }
  });

  if(closeModal) closeModal.addEventListener('click',closeModalFn);
  if(modalBackdrop) modalBackdrop.addEventListener('click',closeModalFn);
  window.addEventListener('keydown',e=>{if(e.key==='Escape')closeModalFn()});

  // Smooth scroll for shop now
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',(e)=>{
      const href = a.getAttribute('href');
      if(href && href.startsWith('#')){
        const el = document.querySelector(href);
        if(el){
          e.preventDefault();
          el.scrollIntoView({behavior:'smooth',block:'start'});
        }
      }
    });
  });
});
