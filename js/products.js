/* =========================================================================
   ELVANOR — Product Data & Configuration
   -------------------------------------------------------------------------
   Edit this file to change product names, prices, descriptions, notes,
   image paths, or social links. Every page reads from this single file,
   so changes here update the homepage, product pages, and cart.
   ========================================================================= */

/* ---- Social links -------------------------------------------------------
   Change these two URLs to point to the real ELVANOR profiles. */
window.ELVANOR_SOCIAL = {
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/"
};

/* ---- Products ------------------------------------------------------------
   `slug` must match the product page filename: product-<slug>.html
   `price` is a plain number (BDT) used for cart math.
   `priceDisplay` is the formatted string shown to shoppers. */
window.ELVANOR_PRODUCTS = {
  nocturne: {
    slug: "nocturne",
    name: "Nocturne",
    number: "01",
    family: "Woody Amber",
    subtitle: "Velvet woods after dark",
    price: 4850,
    priceDisplay: "\u09F3 4,850",
    size: "100 ml",
    description:
      "A deep, composed fragrance where warm amber meets dark woods and a restrained trail of spice.",
    notes: {
      opening: "Bergamot & Black Pepper",
      heart: "Cedarwood & Amber",
      base: "Vetiver & Tonka Bean"
    },
    images: [
      "assets/images/nocturne-1.webp",
      "assets/images/nocturne-2.webp",
      "assets/images/nocturne-3.webp"
    ],
    page: "product-nocturne.html"
  },
  aurelis: {
    slug: "aurelis",
    name: "Aurelis",
    number: "02",
    family: "Floral Musk",
    subtitle: "Light held close",
    price: 4250,
    priceDisplay: "\u09F3 4,250",
    size: "100 ml",
    description:
      "A luminous floral composition softened by clean musk, created for an elegant and quietly memorable presence.",
    notes: {
      opening: "Pear & Bergamot",
      heart: "Jasmine & Iris",
      base: "White Musk & Sandalwood"
    },
    images: [
      "assets/images/aurelis-1.webp",
      "assets/images/aurelis-2.webp",
      "assets/images/aurelis-3.webp"
    ],
    page: "product-aurelis.html"
  },
  verdant: {
    slug: "verdant",
    name: "Verdant",
    number: "03",
    family: "Green Woody",
    subtitle: "The calm of wild green",
    price: 4450,
    priceDisplay: "\u09F3 4,450",
    size: "100 ml",
    description:
      "Fresh green notes settle into textured woods, creating a modern fragrance with clarity, depth, and character.",
    notes: {
      opening: "Green Mandarin & Basil",
      heart: "Fig Leaf & Cypress",
      base: "Moss & Cedarwood"
    },
    images: [
      "assets/images/verdant-1.webp",
      "assets/images/verdant-2.webp",
      "assets/images/verdant-3.webp"
    ],
    page: "product-verdant.html"
  }
};

/* Ordered list, used anywhere the three products render in sequence. */
window.ELVANOR_PRODUCT_ORDER = ["nocturne", "aurelis", "verdant"];
