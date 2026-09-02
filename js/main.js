/* =========================================================================
   ELVANOR — Homepage script
   ========================================================================= */

(function () {
  var PRODUCTS = window.ELVANOR_PRODUCTS || {};
  var ORDER = window.ELVANOR_PRODUCT_ORDER || [];
  var SOCIAL = window.ELVANOR_SOCIAL || {};

  document.addEventListener("DOMContentLoaded", function () {
    wireSocialLinks();
    renderHeroBottles();
    renderProductCollection();
    buildParticles();
    buildScentLines();
  });

  function wireSocialLinks() {
    var fb = document.querySelector("[data-social='facebook']");
    var ig = document.querySelector("[data-social='instagram']");
    if (fb && SOCIAL.facebook) fb.href = SOCIAL.facebook;
    if (ig && SOCIAL.instagram) ig.href = SOCIAL.instagram;
  }

  function renderHeroBottles() {
    var wrap = document.querySelector("[data-hero-bottles]");
    if (!wrap || ORDER.length < 3) return;
    var left = PRODUCTS[ORDER[2]];
    var center = PRODUCTS[ORDER[0]];
    var right = PRODUCTS[ORDER[1]];

    wrap.innerHTML =
      bottleFig(left, "hero__bottle hero__bottle--left") +
      bottleFig(center, "hero__bottle hero__bottle--center") +
      bottleFig(right, "hero__bottle hero__bottle--right");
  }

  function bottleFig(product, cls) {
    if (!product) return "";
    return (
      '<div class="' + cls + '">' +
      '<img src="' + product.images[0] + '" alt="' + product.name + ' by ELVANOR" ' +
      (cls.indexOf("center") > -1 ? "" : 'loading="lazy" ') +
      "/></div>"
    );
  }

  function renderProductCollection() {
    var wrap = document.querySelector("[data-product-collection]");
    if (!wrap) return;

    var html = ORDER.map(function (slug, index) {
      var p = PRODUCTS[slug];
      if (!p) return "";
      var reverse = index % 2 === 1 ? " product-row--reverse" : "";
      return (
        '<article class="product-row' + reverse + '">' +
          '<div class="product-row__media">' +
            '<img src="' + p.images[0] + '" alt="' + p.name + ' \u2014 ' + p.family + ' fragrance" loading="lazy" width="600" height="750" />' +
          "</div>" +
          '<div class="product-row__info">' +
            '<span class="product-row__number">' + p.number + "</span>" +
            '<span class="product-row__family">' + p.family + "</span>" +
            '<h3 class="product-row__name">' + p.name + "</h3>" +
            '<p class="product-row__subtitle">' + p.subtitle + "</p>" +
            '<p class="product-row__desc">' + p.description + "</p>" +
            '<div class="product-row__footer">' +
              '<span class="product-row__price">' + p.priceDisplay + "</span>" +
              '<a class="btn btn-gold" href="' + p.page + '">View Product</a>' +
            "</div>" +
          "</div>" +
        "</article>"
      );
    }).join("");

    wrap.innerHTML = html;
  }

  function buildParticles() {
    var layer = document.querySelector("[data-particles]");
    if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var count = window.innerWidth < 720 ? 12 : 24;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var el = document.createElement("span");
      el.className = "particle";
      var left = Math.random() * 100;
      var bottom = Math.random() * 90;
      var duration = 9 + Math.random() * 10;
      var delay = Math.random() * 10;
      var driftX = (Math.random() * 60 - 30) + "px";
      el.style.left = left + "%";
      el.style.bottom = bottom + "%";
      el.style.setProperty("--drift-x", driftX);
      el.style.animationDuration = duration + "s";
      el.style.animationDelay = "-" + delay + "s";
      frag.appendChild(el);
    }
    layer.appendChild(frag);
  }

  function buildScentLines() {
    var layer = document.querySelector("[data-scent-lines]");
    if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var configs = [
      { size: 340, top: "14%", left: "58%", duration: 46 },
      { size: 480, top: "38%", left: "70%", duration: 62 },
      { size: 220, top: "60%", left: "50%", duration: 34 }
    ];
    configs.forEach(function (cfg, i) {
      var el = document.createElement("div");
      el.className = "scent-line";
      el.style.width = cfg.size + "px";
      el.style.height = cfg.size + "px";
      el.style.top = cfg.top;
      el.style.left = cfg.left;
      el.style.animationDuration = cfg.duration + "s";
      el.style.animationDirection = i % 2 === 0 ? "normal" : "reverse";
      layer.appendChild(el);
    });
  }
})();
