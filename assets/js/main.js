// AGRIVAL — interactions communes à toutes les pages

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNav();
  initQuantitySteppers();
  initAddToCart();
  initCatalogueFilter();
  initCartBadge();
});

/* Menu mobile (drawer plein écran) */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const closeBtn = document.getElementById('mobile-menu-close');
  if (!btn || !menu || !backdrop) return;

  const open = () => {
    backdrop.classList.remove('hidden');
    requestAnimationFrame(() => {
      menu.classList.remove('translate-x-full');
      backdrop.classList.remove('opacity-0');
    });
    document.body.classList.add('mobile-menu-open');
    btn.setAttribute('aria-expanded', 'true');
  };

  const close = () => {
    menu.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0');
    document.body.classList.remove('mobile-menu-open');
    btn.setAttribute('aria-expanded', 'false');
    setTimeout(() => backdrop.classList.add('hidden'), 280);
  };

  btn.addEventListener('click', open);
  backdrop.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.classList.contains('translate-x-full')) close();
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
}

/* Met en avant le lien de navigation correspondant à la page (et catégorie) courante */
function initActiveNav() {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const currentSearch = window.location.search;
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const href = link.getAttribute('href');
    const [hrefPath, hrefQuery] = href.split('#')[0].split('?');
    const sameFile = hrefPath === currentFile;
    const sameQuery = hrefQuery ? `?${hrefQuery}` === currentSearch : true;
    if (sameFile && (!hrefQuery || sameQuery)) {
      link.classList.add('is-active');
    }
  });
}

/* Boutons +/- pour les quantités (panier, fiche produit) */
function initQuantitySteppers() {
  document.querySelectorAll('[data-step]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-step');
      const input = document.getElementById(targetId);
      if (!input) return;
      const min = parseInt(input.min || '1', 10);
      let value = parseInt(input.value || '1', 10);
      value = btn.dataset.action === 'increment' ? value + 1 : Math.max(min, value - 1);
      input.value = value;
      input.dispatchEvent(new Event('change'));
    });
  });
}

/* Ajout au panier : incrémente un compteur localStorage + toast */
function initAddToCart() {
  document.querySelectorAll('[data-add-cart]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const count = parseInt(localStorage.getItem('agrival_cart_count') || '0', 10) + 1;
      localStorage.setItem('agrival_cart_count', String(count));
      updateCartBadges(count);
      showToast('Produit ajouté au panier');
    });
  });
}

function initCartBadge() {
  const count = parseInt(localStorage.getItem('agrival_cart_count') || '0', 10);
  updateCartBadges(count);
}

function updateCartBadges(count) {
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = count;
    el.classList.toggle('hidden', count === 0);
  });
}

function showToast(message) {
  let toast = document.getElementById('agrival-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'agrival-toast';
    toast.className =
      'fixed bottom-6 right-6 z-[100] bg-primary text-on-primary px-5 py-3 rounded shadow-lg text-body-sm font-body-sm font-bold flex items-center gap-2 translate-y-4 opacity-0 transition-all duration-300';
    toast.innerHTML = '<span class="material-symbols-outlined text-lg">check_circle</span><span data-toast-text></span>';
    document.body.appendChild(toast);
  }
  toast.querySelector('[data-toast-text]').textContent = message;
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.add('translate-y-4', 'opacity-0');
  }, 2500);
}

/* Filtre du catalogue par secteur, piloté par le paramètre d'URL ?cat= */
function initCatalogueFilter() {
  const cards = document.querySelectorAll('[data-category]');
  const filterLinks = document.querySelectorAll('[data-filter-link]');
  if (!cards.length && !filterLinks.length) return;

  const params = new URLSearchParams(window.location.search);
  const activeCat = params.get('cat');

  cards.forEach((card) => {
    const show = !activeCat || card.getAttribute('data-category') === activeCat;
    card.classList.toggle('hidden', !show);
  });

  filterLinks.forEach((link) => {
    const cat = link.getAttribute('data-filter-link');
    const isActive = cat === activeCat || (cat === 'all' && !activeCat);
    link.classList.toggle('is-active-filter', isActive);
  });

  const emptyState = document.getElementById('catalogue-empty');
  if (emptyState) {
    const anyVisible = Array.from(cards).some((c) => !c.classList.contains('hidden'));
    emptyState.classList.toggle('hidden', anyVisible);
  }
}
