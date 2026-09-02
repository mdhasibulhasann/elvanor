/* =========================================================================
   ELVANOR — Product page script
   ========================================================================= */

(function () {
  var PRODUCTS = window.ELVANOR_PRODUCTS || {};

  document.addEventListener("DOMContentLoaded", function () {
    var slug = document.body.getAttribute("data-product");
    var product = PRODUCTS[slug];
    if (!product) return;

    renderInfo(product);
    var gallery = initGallery(product);
    initModal(product);
    initActions(product);

    document.title = product.name + " \u2014 " + product.family + " | ELVANOR";
  });

  function renderInfo(p) {
    setText("[data-p-family]", p.family);
    setText("[data-p-name]", p.name);
    setText("[data-p-subtitle]", p.subtitle);
    setText("[data-p-price]", p.priceDisplay);
    setText("[data-p-size]", p.size);
    setText("[data-p-desc]", p.description);
    setText("[data-p-opening]", p.notes.opening);
    setText("[data-p-heart]", p.notes.heart);
    setText("[data-p-base]", p.notes.base);
  }

  function setText(selector, value) {
    var el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  /* ---- Gallery ---------------------------------------------------- */

  function initGallery(p) {
    var frame = document.querySelector("[data-gallery-frame]");
    var dotsWrap = document.querySelector("[data-gallery-dots]");
    if (!frame) return null;

    var current = 0;
    var slides = p.images.map(function (src, i) {
      var slide = document.createElement("div");
      slide.className = "gallery__slide" + (i === 0 ? " is-active" : "");
      var img = document.createElement("img");
      img.src = src;
      img.alt = p.name + " \u2014 view " + (i + 1) + " of " + p.images.length;
      if (i !== 0) img.loading = "lazy";
      slide.appendChild(img);
      frame.appendChild(slide);
      return slide;
    });

    var dots = p.images.map(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "gallery__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Show image " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(index) {
      var total = slides.length;
      current = (index + total) % total;
      slides.forEach(function (s, i) { s.classList.toggle("is-active", i === current); });
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === current); });
    }

    var prevBtn = document.querySelector("[data-gallery-prev]");
    var nextBtn = document.querySelector("[data-gallery-next]");
    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); });

    frame.setAttribute("tabindex", "0");
    frame.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { goTo(current - 1); e.preventDefault(); }
      if (e.key === "ArrowRight") { goTo(current + 1); e.preventDefault(); }
    });

    /* touch swipe */
    var touchStartX = null;
    frame.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    frame.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) goTo(dx > 0 ? current - 1 : current + 1);
      touchStartX = null;
    }, { passive: true });

    /* mouse drag */
    var dragStartX = null;
    frame.addEventListener("mousedown", function (e) { dragStartX = e.clientX; });
    window.addEventListener("mouseup", function (e) {
      if (dragStartX === null) return;
      var dx = e.clientX - dragStartX;
      if (Math.abs(dx) > 60) goTo(dx > 0 ? current - 1 : current + 1);
      dragStartX = null;
    });

    return { goTo: goTo, current: function () { return current; } };
  }

  /* ---- Modal --------------------------------------------------------- */

  function initModal(p) {
    var overlay = document.querySelector("[data-cart-modal]");
    if (!overlay) return;

    var img = overlay.querySelector("[data-modal-image]");
    var name = overlay.querySelector("[data-modal-name]");
    var goToCartBtn = overlay.querySelector("[data-modal-goto-cart]");
    var buyMoreBtn = overlay.querySelector("[data-modal-buy-more]");
    var closeBtn = overlay.querySelector("[data-modal-close]");

    function open() {
      img.src = p.images[0];
      img.alt = p.name;
      name.textContent = p.name;
      overlay.classList.add("is-open");
      document.body.classList.add("no-scroll");
      closeBtn.focus();
    }

    function close() {
      overlay.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    }

    goToCartBtn.addEventListener("click", function () { window.location.href = "cart.html"; });
    buyMoreBtn.addEventListener("click", close);
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
    });

    overlay._open = open;
  }

  /* ---- Actions --------------------------------------------------------- */

  function initActions(p) {
    var addBtn = document.querySelector("[data-add-to-cart]");
    var buyBtn = document.querySelector("[data-buy-now]");
    var overlay = document.querySelector("[data-cart-modal]");

    if (addBtn) {
      addBtn.addEventListener("click", function () {
        window.ElvanorCart.addItem(p.slug, 1);
        if (overlay && overlay._open) overlay._open();
      });
    }

    if (buyBtn) {
      buyBtn.addEventListener("click", function () {
        window.ElvanorCart.addItem(p.slug, 1);
        window.location.href = "cart.html";
      });
    }
  }
})();
