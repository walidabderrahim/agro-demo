// SDDA — interactions communes à toutes les pages

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNav();
  initCatalogueGrid();
  initQuantitySteppers();
  initAddToCart();
  initCatalogueFilter();
  initCatalogueSearchBox();
  initCartBadge();
  initProductSearch();
  initProductDetailPage();
  initOrderForm();
});

function escapeHtml(str) {
  return (str || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function getCategoryIcon(key) {
  if (typeof SITE_CATEGORIES === 'undefined') return 'inventory_2';
  const cat = SITE_CATEGORIES.find((c) => c.key === key);
  return cat ? cat.icon : 'inventory_2';
}

/* Retire les accents/majuscules pour une comparaison de texte insensible aux accents */
var ACCENT_MAP = {
  à: 'a', â: 'a', ä: 'a', á: 'a',
  é: 'e', è: 'e', ê: 'e', ë: 'e',
  î: 'i', ï: 'i', ì: 'i',
  ô: 'o', ö: 'o', ò: 'o',
  ù: 'u', û: 'u', ü: 'u',
  ç: 'c', ñ: 'n',
};
function normalizeText(str) {
  return (str || '')
    .toLowerCase()
    .split('')
    .map((ch) => ACCENT_MAP[ch] || ch)
    .join('')
    .trim();
}

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
      'fixed bottom-24 right-6 z-[100] bg-primary text-on-primary px-5 py-3 rounded shadow-lg text-body-sm font-body-sm font-bold flex items-center gap-2 translate-y-4 opacity-0 transition-all duration-300';
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

/* Construit la grille du catalogue à partir de SITE_PRODUCTS (2 produits/ligne sur mobile) */
function initCatalogueGrid() {
  const grid = document.getElementById('catalogue-grid');
  if (!grid || typeof SITE_PRODUCTS === 'undefined') return;

  grid.innerHTML = SITE_PRODUCTS.map((p) => {
    const icon = getCategoryIcon(p.category);
    const imageBlock = p.image
      ? '<img src="' + p.image + '" alt="' + escapeHtml(p.name) + '" class="w-full h-full object-contain p-3 sm:p-5 group-hover:scale-105 transition-transform duration-300"/>'
      : '<span class="material-symbols-outlined text-5xl sm:text-6xl text-outline-variant">' + icon + '</span>';
    const regulatedBadge = p.regulated
      ? '<span class="absolute top-2 right-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-error text-white" title="Produit réglementé"><span class="material-symbols-outlined text-[14px]">warning</span></span>'
      : '';

    return (
      '<div data-category="' +
      p.category +
      '" data-ref="' +
      p.ref +
      '" class="group bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden hover:border-primary hover:shadow-md transition-all flex flex-col">' +
      '<a href="produit.html?ref=' +
      encodeURIComponent(p.ref) +
      '" class="block relative bg-white">' +
      '<div class="aspect-square flex items-center justify-center overflow-hidden">' +
      imageBlock +
      '</div>' +
      '<span class="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded badge-' +
      p.category +
      ' text-[10px] sm:text-label-md font-label-md font-bold uppercase">' +
      '<span class="material-symbols-outlined text-[12px] sm:text-[14px]">' +
      icon +
      '</span>' +
      escapeHtml(p.categoryLabel) +
      '</span>' +
      regulatedBadge +
      '</a>' +
      '<div class="p-3 sm:p-4 flex flex-col flex-1">' +
      '<a href="produit.html?ref=' +
      encodeURIComponent(p.ref) +
      '" class="block mb-2">' +
      '<h3 class="text-sm sm:text-headline-sm font-bold sm:font-headline-sm text-on-background line-clamp-2 leading-snug group-hover:text-primary transition-colors">' +
      escapeHtml(p.name) +
      '</h3>' +
      '</a>' +
      '<div class="mt-auto pt-1">' +
      '<span class="block text-base sm:text-headline-md font-headline-md font-bold text-primary mb-2 sm:mb-3">' +
      escapeHtml(p.priceLabel) +
      '</span>' +
      '<div class="flex items-center gap-2">' +
      '<button data-add-cart data-ref="' +
      p.ref +
      '" class="shrink-0 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded border-2 border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors" aria-label="Ajouter au panier" title="Ajouter au panier">' +
      '<span class="material-symbols-outlined text-[18px] sm:text-[20px]">add_shopping_cart</span>' +
      '</button>' +
      '<a href="produit.html?ref=' +
      encodeURIComponent(p.ref) +
      '" class="flex-1 text-center bg-secondary-fixed text-on-secondary-fixed text-[11px] sm:text-label-md font-bold uppercase tracking-wide py-2 sm:py-2.5 rounded hover:bg-secondary-container transition-colors">Acheter</a>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>'
    );
  }).join('');
}

/* Filtre du catalogue par secteur (?cat=) et/ou recherche texte (?q=) */
function filterCatalogueCards(cat, query) {
  const cards = document.querySelectorAll('[data-category]');
  if (!cards.length) return;
  const q = normalizeText(query || '');

  cards.forEach((card) => {
    const matchesCat = !cat || card.getAttribute('data-category') === cat;
    const matchesQuery = !q || normalizeText(card.textContent).includes(q);
    card.classList.toggle('hidden', !(matchesCat && matchesQuery));
  });

  const emptyState = document.getElementById('catalogue-empty');
  if (emptyState) {
    const anyVisible = Array.from(cards).some((c) => !c.classList.contains('hidden'));
    emptyState.classList.toggle('hidden', anyVisible);
  }
}

function initCatalogueFilter() {
  const cards = document.querySelectorAll('[data-category]');
  const filterLinks = document.querySelectorAll('[data-filter-link]');
  if (!cards.length && !filterLinks.length) return;

  const params = new URLSearchParams(window.location.search);
  const activeCat = params.get('cat');
  const query = params.get('q');

  filterCatalogueCards(activeCat, query);

  filterLinks.forEach((link) => {
    const cat = link.getAttribute('data-filter-link');
    const isActive = !query && (cat === activeCat || (cat === 'all' && !activeCat));
    link.classList.toggle('is-active-filter', isActive);
  });
}

/* Champ de recherche texte directement sur la page catalogue (affine sans recharger) */
function initCatalogueSearchBox() {
  const input = document.getElementById('catalogue-search-input');
  const clearBtn = document.getElementById('catalogue-search-clear');
  if (!input) return;

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';
  input.value = initialQuery;
  if (clearBtn) clearBtn.classList.toggle('hidden', !initialQuery);

  let debounceTimer;
  const applyQuery = (value) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set('q', value);
    } else {
      url.searchParams.delete('q');
    }
    url.searchParams.delete('cat');
    window.history.replaceState({}, '', url);
    filterCatalogueCards(null, value);
    document.querySelectorAll('[data-filter-link]').forEach((link) => {
      link.classList.toggle('is-active-filter', !value && link.getAttribute('data-filter-link') === 'all');
    });
    if (clearBtn) clearBtn.classList.toggle('hidden', !value);
  };

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const value = input.value.trim();
    debounceTimer = setTimeout(() => applyQuery(value), 150);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      applyQuery('');
      input.focus();
    });
  }
}

/* Recherche globale (icône du header) : résultats en direct depuis SITE_PRODUCTS */
function initProductSearch() {
  const openBtn = document.getElementById('search-open-btn');
  const overlay = document.getElementById('search-overlay');
  const backdrop = document.getElementById('search-overlay-backdrop');
  const input = document.getElementById('search-input');
  const closeBtn = document.getElementById('search-close');
  const resultsEl = document.getElementById('search-results');
  if (!openBtn || !overlay || !backdrop || !input || !resultsEl) return;
  if (typeof SITE_PRODUCTS === 'undefined') return;

  const open = () => {
    backdrop.classList.remove('hidden');
    overlay.classList.remove('hidden');
    requestAnimationFrame(() => {
      backdrop.classList.remove('opacity-0');
      overlay.classList.remove('opacity-0', '-translate-y-2');
    });
    document.body.classList.add('search-open');
    input.value = '';
    renderResults('');
    setTimeout(() => input.focus(), 50);
  };

  const close = () => {
    backdrop.classList.add('opacity-0');
    overlay.classList.add('opacity-0', '-translate-y-2');
    document.body.classList.remove('search-open');
    setTimeout(() => {
      backdrop.classList.add('hidden');
      overlay.classList.add('hidden');
    }, 200);
  };

  const renderResults = (query) => {
    const q = normalizeText(query);

    if (!q) {
      resultsEl.innerHTML =
        '<p class="text-body-sm font-body-sm text-on-surface-variant p-4">Recherchez un produit, une référence ou un secteur (ex. : « hydraulique », « CER-882 », « herbicide »).</p>';
      return;
    }

    const matches = SITE_PRODUCTS.filter((p) => {
      const haystack = normalizeText([p.name, p.categoryLabel, p.ref, p.description].filter(Boolean).join(' '));
      return haystack.includes(q);
    });

    if (!matches.length) {
      resultsEl.innerHTML =
        '<div class="p-4 text-center">' +
        '<p class="text-body-md font-body-md text-on-surface mb-2">Aucun résultat pour « ' +
        escapeHtml(query) +
        ' ».</p>' +
        '<a href="contact.html" class="text-primary font-bold hover:underline text-body-sm">Contactez notre service commercial</a>' +
        '</div>';
      return;
    }

    const rows = matches
      .slice(0, 8)
      .map(
        (p) =>
          '<a href="catalogue.html?q=' +
          encodeURIComponent(p.name) +
          '" class="flex items-center justify-between gap-3 px-4 py-3 rounded hover:bg-surface-container-low transition-colors">' +
          '<span class="min-w-0">' +
          '<span class="block text-body-md font-body-md font-bold text-on-surface truncate">' +
          escapeHtml(p.name) +
          '</span>' +
          '<span class="block text-body-sm font-body-sm text-on-surface-variant">' +
          escapeHtml(p.categoryLabel) +
          (p.ref ? ' · Réf. ' + escapeHtml(p.ref) : '') +
          '</span>' +
          '</span>' +
          '<span class="shrink-0 text-label-md font-label-md font-bold text-primary">' +
          escapeHtml(p.priceLabel) +
          '</span>' +
          '</a>'
      )
      .join('');

    const seeAll =
      '<a href="catalogue.html?q=' +
      encodeURIComponent(query) +
      '" class="block text-center px-4 py-3 border-t border-outline-variant text-label-md font-label-md font-bold uppercase tracking-wider text-primary hover:bg-surface-container-low">Voir tous les résultats (' +
      matches.length +
      ')</a>';

    resultsEl.innerHTML = rows + seeAll;
  };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) close();
    if (e.key === '/' && overlay.classList.contains('hidden')) {
      const tag = document.activeElement ? document.activeElement.tagName : '';
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        open();
      }
    }
  });
  input.addEventListener('input', () => renderResults(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      window.location.href = 'catalogue.html?q=' + encodeURIComponent(input.value.trim());
    }
  });
}

/* Fiche produit dynamique (produit.html?ref=...) : peuple la page depuis SITE_PRODUCTS */
function initProductDetailPage() {
  const detailEl = document.getElementById('product-detail');
  const notFoundEl = document.getElementById('product-not-found');
  if (!detailEl || typeof SITE_PRODUCTS === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  const product = SITE_PRODUCTS.find((p) => p.ref === ref);

  if (!product) {
    if (notFoundEl) notFoundEl.classList.remove('hidden');
    return;
  }

  detailEl.classList.remove('hidden');
  document.title = product.name + ' - SDDA';

  const breadcrumb = document.getElementById('product-breadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML =
      '<a href="catalogue.html" class="hover:text-primary hover:underline">Catalogue</a>' +
      '<span class="material-symbols-outlined text-sm">chevron_right</span>' +
      '<a href="catalogue.html?cat=' +
      encodeURIComponent(product.category) +
      '" class="hover:text-primary hover:underline">' +
      escapeHtml(product.categoryLabel) +
      '</a>' +
      '<span class="material-symbols-outlined text-sm">chevron_right</span>' +
      '<span class="text-on-surface font-bold truncate">' +
      escapeHtml(product.name) +
      '</span>';
  }

  const imgEl = document.getElementById('product-image');
  const fallbackEl = document.getElementById('product-image-fallback');
  if (product.image && imgEl) {
    imgEl.src = product.image;
    imgEl.alt = product.name;
    imgEl.classList.remove('hidden');
    if (fallbackEl) fallbackEl.classList.add('hidden');
  } else if (fallbackEl) {
    fallbackEl.textContent = getCategoryIcon(product.category);
    fallbackEl.classList.remove('hidden');
  }

  const badgeEl = document.getElementById('product-badge');
  if (badgeEl) {
    badgeEl.className =
      'absolute top-4 left-4 text-label-md font-label-md px-2 py-1 rounded flex items-center gap-1 font-bold uppercase badge-' + product.category;
    badgeEl.innerHTML =
      '<span class="material-symbols-outlined text-[14px]">' + getCategoryIcon(product.category) + '</span>' + escapeHtml(product.categoryLabel);
  }

  const regulatedEl = document.getElementById('product-regulated-badge');
  if (regulatedEl) regulatedEl.classList.toggle('hidden', !product.regulated);

  const titleEl = document.getElementById('product-title');
  if (titleEl) titleEl.textContent = product.name;

  const descEl = document.getElementById('product-description');
  if (descEl) descEl.textContent = product.description;

  const priceEl = document.getElementById('product-price');
  if (priceEl) priceEl.textContent = product.priceLabel;

  const specsEl = document.getElementById('product-specs');
  if (specsEl && product.specs) {
    specsEl.innerHTML = product.specs
      .map(
        (s) =>
          '<div class="flex justify-between border-b border-outline-variant pb-1"><span class="text-technical-data font-technical-data text-outline">' +
          escapeHtml(s.label) +
          '</span><span class="text-technical-data font-technical-data text-on-surface font-bold text-right">' +
          escapeHtml(s.value) +
          '</span></div>'
      )
      .join('');
  }

  document.querySelectorAll('[data-add-cart]').forEach((btn) => btn.setAttribute('data-ref', product.ref));

  const waMessage = encodeURIComponent(
    'Bonjour, je suis intéressé(e) par : ' + product.name + (product.ref ? ' (Réf. ' + product.ref + ')' : '') + ' - ' + product.priceLabel + '. Merci de me recontacter.'
  );
  const waUrl = 'https://wa.me/213550534963?text=' + waMessage;
  const stickyWhatsapp = document.getElementById('sticky-whatsapp-btn');
  if (stickyWhatsapp) stickyWhatsapp.href = waUrl;

  const stickyBar = document.getElementById('product-sticky-bar');
  if (stickyBar) stickyBar.classList.add('is-active');

  const stickyOrderBtn = document.getElementById('sticky-order-btn');
  const orderSection = document.getElementById('order-section');
  if (stickyOrderBtn && orderSection) {
    stickyOrderBtn.addEventListener('click', () => {
      orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const nameInput = document.getElementById('order-name');
        if (nameInput) nameInput.focus();
      }, 400);
    });
  }
}

/* Formulaire de commande directe (nom, téléphone, wilaya, commune) sur la fiche produit */
function initOrderForm() {
  const form = document.getElementById('order-form');
  const confirmEl = document.getElementById('order-confirm');
  const confirmText = document.getElementById('order-confirm-text');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('order-name').value.trim();
    const wilayaSelect = document.getElementById('order-wilaya');
    const wilaya = wilayaSelect.options[wilayaSelect.selectedIndex] ? wilayaSelect.options[wilayaSelect.selectedIndex].text : '';
    const commune = document.getElementById('order-commune').value.trim();
    const qty = parseInt(document.getElementById('order-qty-form').value || '1', 10);
    const titleEl = document.getElementById('product-title');
    const productName = titleEl && titleEl.textContent ? titleEl.textContent : 'ce produit';

    form.classList.add('hidden');
    if (confirmEl) confirmEl.classList.remove('hidden');
    if (confirmText) {
      confirmText.textContent =
        'Merci ' +
        name +
        ' ! Votre commande de « ' +
        productName +
        ' » (x' +
        qty +
        ') pour ' +
        commune +
        ', ' +
        wilaya +
        ' a bien été enregistrée. Notre équipe vous contactera au plus vite pour confirmer la livraison.';
    }

    const count = parseInt(localStorage.getItem('agrival_cart_count') || '0', 10) + qty;
    localStorage.setItem('agrival_cart_count', String(count));
    updateCartBadges(count);
  });
}
