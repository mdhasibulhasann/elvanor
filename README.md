# ELVANOR — Fine Fragrances

A static, multi-page e-commerce website for the fictional fine-fragrance brand
**ELVANOR**. Built with plain HTML, CSS, and vanilla JavaScript — no build
step, no framework, no backend.

## Previewing locally

No install or server is required. Just open `index.html` directly in a
browser (double-click it, or right-click → Open With → your browser).

If your browser blocks local scripts on `file://` pages, you can instead run
any lightweight local server from inside the project folder, for example:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Uploading to GitHub

1. Create a new repository on GitHub (public, if you want free GitHub Pages).
2. Upload every file and folder from inside `elvanor-perfume/` to the
   repository root — `index.html` must sit at the repository root, not
   inside a nested folder.
3. Commit the files to the `main` branch (or whichever branch you plan to
   publish from).

## Activating GitHub Pages

1. In your repository, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to "Deploy from a branch".
3. Choose the branch (e.g. `main`) and the `/ (root)` folder, then save.
4. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/`.

All internal links and asset paths in this project are relative, so the site
works correctly whether it's hosted at a domain root or inside a repository
subdirectory.

## Editing content

| What to change | Where |
| --- | --- |
| Product names, prices, descriptions, sizes, fragrance notes, image paths, product page links | `js/products.js` |
| Facebook and Instagram links | `js/products.js` (top of file, `ELVANOR_SOCIAL`) |
| Colours, fonts, spacing, layout | `css/style.css` |
| Hero copy, "Our Story" copy, footer copy | `index.html` |
| Product page structure (gallery, info layout) | `product-nocturne.html`, `product-aurelis.html`, `product-verdant.html` |
| Cart page structure | `cart.html` |

Product data lives in one place (`js/products.js`) and is read by the
homepage, every product page, and the cart, so editing a price or a
description there updates it everywhere automatically.

To use your own product photography, replace the files in
`assets/images/` (keeping the same filenames), or update the `images`
arrays in `js/products.js` to point at new filenames.

## How the cart works

The shopping cart has no server or database behind it. It's stored in the
visitor's browser using `localStorage` under the key `elvanor-cart`, so it
persists across page reloads and between the homepage, product pages, and
the cart page — but only on that browser/device.

## Place Order

The **Place Order** button does not process a real payment or send a real
order anywhere. It opens a confirmation modal explaining that this is a
front-end demonstration only. No order data leaves the browser.

## Adding a real backend later

This project is intentionally front-end only. To turn it into a working
store, you could:

- Replace the `localStorage` cart functions in `js/cart.js` with calls to a
  real backend API (e.g. a Node/Express, Django, or serverless function
  service) that persists carts and orders in a database.
- Replace the demo "Place Order" modal with a real checkout flow connected
  to a payment gateway (e.g. Stripe, SSLCommerz, or a local Bangladeshi
  payment provider).
- Add authentication if you want customer accounts or order history.

None of that is implemented here — this repository is the static front end
only.
