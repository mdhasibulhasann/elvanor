/* =========================================================================
   ELVANOR — Cart Storage
   -------------------------------------------------------------------------
   Front-end only cart, persisted to localStorage under CART_KEY.
   No backend, no payment gateway — see README for how a real backend
   could be connected later.
   ========================================================================= */

(function () {
  var CART_KEY = "elvanor-cart";
  var EVENT_NAME = "elvanor-cart-updated";

  function readCart() {
    try {
      var raw = window.localStorage.getItem(CART_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveCart(items) {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (err) {
      /* localStorage unavailable (private mode, quota, etc.) — fail quietly */
    }
    document.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { items: items } }));
  }

  function addItem(slug, qty) {
    qty = qty || 1;
    var items = readCart();
    var existing = items.find(function (i) { return i.slug === slug; });
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ slug: slug, qty: qty });
    }
    saveCart(items);
    return items;
  }

  function removeItem(slug) {
    var items = readCart().filter(function (i) { return i.slug !== slug; });
    saveCart(items);
    return items;
  }

  function setQuantity(slug, qty) {
    var items = readCart();
    var existing = items.find(function (i) { return i.slug === slug; });
    if (existing) {
      existing.qty = Math.max(1, qty);
      saveCart(items);
    }
    return items;
  }

  function changeQuantity(slug, delta) {
    var items = readCart();
    var existing = items.find(function (i) { return i.slug === slug; });
    if (existing) {
      existing.qty = Math.max(1, existing.qty + delta);
      saveCart(items);
    }
    return items;
  }

  function clearCart() {
    saveCart([]);
  }

  function itemCount() {
    return readCart().reduce(function (sum, i) { return sum + i.qty; }, 0);
  }

  function formatBDT(amount) {
    return "\u09F3 " + Math.round(amount).toLocaleString("en-US");
  }

  function getTotals() {
    var products = window.ELVANOR_PRODUCTS || {};
    var items = readCart();
    var subtotal = 0;
    var lines = items.map(function (i) {
      var p = products[i.slug];
      if (!p) return null;
      var lineTotal = p.price * i.qty;
      subtotal += lineTotal;
      return {
        slug: i.slug,
        qty: i.qty,
        product: p,
        lineTotal: lineTotal
      };
    }).filter(Boolean);
    return {
      lines: lines,
      subtotal: subtotal,
      delivery: 0,
      total: subtotal
    };
  }

  function updateBadge() {
    var count = itemCount();
    var badges = document.querySelectorAll("[data-cart-badge]");
    badges.forEach(function (badge) {
      badge.textContent = String(count);
      badge.classList.toggle("is-visible", count > 0);
    });
  }

  function bumpBadge() {
    var badges = document.querySelectorAll("[data-cart-badge]");
    badges.forEach(function (badge) {
      badge.classList.remove("badge-bump");
      // force reflow so the animation can restart
      void badge.offsetWidth;
      badge.classList.add("badge-bump");
    });
  }

  document.addEventListener(EVENT_NAME, function () {
    updateBadge();
    bumpBadge();
  });

  window.addEventListener("storage", function (e) {
    if (e.key === CART_KEY) updateBadge();
  });

  document.addEventListener("DOMContentLoaded", updateBadge);
  document.addEventListener("DOMContentLoaded", initCartPage);
  document.addEventListener(EVENT_NAME, function () {
    if (document.querySelector("[data-cart-page]")) renderCartPage();
  });

  function initCartPage() {
    if (!document.querySelector("[data-cart-page]")) return;
    renderCartPage();
    var placeOrderBtn = document.querySelector("[data-place-order]");
    var modal = document.querySelector("[data-order-modal]");
    if (placeOrderBtn && modal) {
      placeOrderBtn.addEventListener("click", function () {
        modal.classList.add("is-open");
        document.body.classList.add("no-scroll");
        var focusTarget = modal.querySelector("[data-order-modal-continue]");
        if (focusTarget) focusTarget.focus();
      });
      var closeModal = function () {
        modal.classList.remove("is-open");
        document.body.classList.remove("no-scroll");
      };
      var continueBtn = modal.querySelector("[data-order-modal-continue]");
      if (continueBtn) continueBtn.addEventListener("click", closeModal);
      modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
      });
    }
  }

  function renderCartPage() {
    var itemsWrap = document.querySelector("[data-cart-items]");
    var emptyState = document.querySelector("[data-cart-empty]");
    var filledState = document.querySelector("[data-cart-filled]");
    if (!itemsWrap) return;

    var totals = getTotals();

    if (totals.lines.length === 0) {
      if (emptyState) emptyState.style.display = "flex";
      if (filledState) filledState.style.display = "none";
      return;
    }

    if (emptyState) emptyState.style.display = "none";
    if (filledState) filledState.style.display = "grid";

    itemsWrap.innerHTML = totals.lines.map(function (line) {
      var p = line.product;
      return (
        '<div class="cart-item" data-slug="' + line.slug + '">' +
          '<div class="cart-item__media"><img src="' + p.images[0] + '" alt="' + p.name + '" width="96" height="112" /></div>' +
          '<div class="cart-item__info">' +
            '<span class="cart-item__family">' + p.family + "</span>" +
            '<h3 class="cart-item__name"><a href="' + p.page + '">' + p.name + "</a></h3>" +
            '<span class="cart-item__meta">' + p.size + "</span>" +
            '<span class="cart-item__price">' + formatBDT(p.price) + " each</span>" +
          "</div>" +
          '<div class="cart-item__controls">' +
            '<div class="qty-control">' +
              '<button type="button" data-qty-decrease aria-label="Decrease quantity of ' + p.name + '">\u2212</button>' +
              '<span class="qty-control__value">' + line.qty + "</span>" +
              '<button type="button" data-qty-increase aria-label="Increase quantity of ' + p.name + '">+</button>' +
            "</div>" +
            '<button type="button" class="cart-item__remove" data-remove-item aria-label="Remove ' + p.name + ' from cart">Remove</button>' +
          "</div>" +
        "</div>"
      );
    }).join("");

    itemsWrap.querySelectorAll("[data-qty-decrease]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var slug = btn.closest("[data-slug]").getAttribute("data-slug");
        changeQuantity(slug, -1);
      });
    });
    itemsWrap.querySelectorAll("[data-qty-increase]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var slug = btn.closest("[data-slug]").getAttribute("data-slug");
        changeQuantity(slug, 1);
      });
    });
    itemsWrap.querySelectorAll("[data-remove-item]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var slug = btn.closest("[data-slug]").getAttribute("data-slug");
        removeItem(slug);
      });
    });

    setText("[data-summary-subtotal]", formatBDT(totals.subtotal));
    setText("[data-summary-total]", formatBDT(totals.total));
  }

  function setText(selector, value) {
    var el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  window.ElvanorCart = {
    read: readCart,
    save: saveCart,
    addItem: addItem,
    removeItem: removeItem,
    setQuantity: setQuantity,
    changeQuantity: changeQuantity,
    clear: clearCart,
    itemCount: itemCount,
    getTotals: getTotals,
    formatBDT: formatBDT,
    updateBadge: updateBadge
  };
})();
