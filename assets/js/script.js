'use strict';

/* modal variables
const modal = document.querySelector('[data-modal]');
const modalCloseBtn = document.querySelector('[data-modal-close]');
const modalCloseOverlay = document.querySelector('[data-modal-overlay]');

// modal function
const modalCloseFunc = function () { 
  if (modal) modal.classList.add('closed'); 
}

// modal eventListener
if (modalCloseOverlay) {
  modalCloseOverlay.addEventListener('click', modalCloseFunc);
}
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', modalCloseFunc);
}**/







/** notification toast variables
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

// notification toast eventListener
toastCloseBtn.addEventListener('click', function () {
  notificationToast.classList.add('closed');
});*/





// mobile menu variables
const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('[data-overlay]');

for (let i = 0; i < mobileMenuOpenBtn.length; i++) {
  // mobile menu function
  const mobileMenuCloseFunc = function () {
    mobileMenu[i].classList.remove('active');
    overlay.classList.remove('active');
  };

  mobileMenuOpenBtn[i].addEventListener('click', function () {
    mobileMenu[i].classList.add('active');
    overlay.classList.add('active');
  });

  // Only attach close button if it exists
  if (mobileMenuCloseBtn[i]) {
    mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
  }

  if (overlay) {
  overlay.addEventListener('click', mobileMenuCloseFunc);
  }
}






// accordion variables
const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

for (let i = 0; i < accordionBtn.length; i++) {

  accordionBtn[i].addEventListener('click', function () {

    const clickedBtn = this.nextElementSibling.classList.contains('active');

    for (let i = 0; i < accordion.length; i++) {

      if (clickedBtn) break;

      if (accordion[i].classList.contains('active')) {

        accordion[i].classList.remove('active');
        accordionBtn[i].classList.remove('active');

      }

    }

    this.nextElementSibling.classList.toggle('active');
    this.classList.toggle('active');

  });

}

//Best seller section
fetch('products_data.json')
  .then(response => response.json())
  .then(products => {
    // ✅ Pick your category or logic here
    // Example: show top 4 from ANY category
    const bestSellers = products.slice(0, 4);

    const container = document.getElementById('best-sellers-list');

    if (bestSellers.length === 0) {
      container.innerHTML = "<p>No best sellers available.</p>";
      return;
    }

    bestSellers.forEach(product => {
      // ✅ Clean category folder mapping
      let folder = "spices (retail packs)";
      const category = product.CATEGORY.trim().toLowerCase();

      if (category.includes("rice")) {
        folder = "Rice";
      } else if (category.includes("ambient")) {
        folder = "Ambient-products";
      } else if (category.includes("frozen")) {
        folder = "Frozen";
      }

      // ✅ Build clean file name
      const fileName = encodeURIComponent(product.PRODUCT.trim()) + ".png";
      const imgSrc = `./assets/images/${folder}/${fileName}`;
      const linkHref = `product.html?product=${encodeURIComponent(product.PRODUCT.trim())}`;

      const div = document.createElement("div");
      div.className = "showcase";
      div.innerHTML = `
        <a href="${linkHref}" class="showcase-img-box">
          <img src="${imgSrc}" alt="${product.PRODUCT}" width="75" height="75" class="showcase-img">
        </a>
        <div class="showcase-content">
          <a href="${linkHref}">
            <h4 class="showcase-title">${product.PRODUCT}</h4>
          </a>
          <div class="showcase-rating">
            <ion-icon name="star"></ion-icon>
            <ion-icon name="star"></ion-icon>
            <ion-icon name="star"></ion-icon>
            <ion-icon name="star"></ion-icon>
            <ion-icon name="star-half-outline"></ion-icon>
          </div>
          <div class="price-box">
            <del>$${(parseFloat(product["SELLING PRICE"]) * 1.25).toFixed(2)}</del>
            <p class="price">$${parseFloat(product["SELLING PRICE"]).toFixed(2)}</p>
          </div>
        </div>
      `;

      container.appendChild(div);
    });
  })
  .catch(error => console.error('Error loading Best Sellers:', error));


// Product minal info
fetch('products_data.json')
  .then(response => response.json())
  .then(products => {
    // Boxed Spices
    const spiceContainer = document.getElementById('boxed-spices-container');
    const boxedSpices = products.filter(p => p.CATEGORY.toLowerCase().includes('spice'));
    boxedSpices.forEach(product => {
      const fileName = "product.html?product=" + encodeURIComponent(product.PRODUCT);
      const folder = encodeURIComponent(product.CATEGORY.trim());
      const div = document.createElement('div');
      div.className = 'showcase';
      div.innerHTML = `
        <a href="${fileName}" class="showcase-img-box">
          <img src="./assets/images/${folder}/${encodeURIComponent(product.PRODUCT)}.png" alt="${product.PRODUCT}" class="showcase-img" width="70">
        </a>
        <div class="showcase-content">
          <a href="${fileName}">
            <h4 class="showcase-title">${product.PRODUCT}</h4>
          </a>
          <a href="#" class="showcase-category">${product.CATEGORY}</a>
          <div class="price-box">
            <p class="price">$${parseFloat(product['SELLING PRICE']).toFixed(2)}</p>
            <del>$${(parseFloat(product['SELLING PRICE']) * 1.25).toFixed(2)}</del>
          </div>
        </div>
      `;
      spiceContainer.appendChild(div);
    });

    // Rice
    const riceContainer = document.getElementById('rice-container');
    const riceProducts = products.filter(p => p.CATEGORY.toLowerCase().includes('rice'));
    riceProducts.forEach(product => {
      const fileName = "product.html?product=" + encodeURIComponent(product.PRODUCT);
      const folder = encodeURIComponent(product.CATEGORY.trim());
      const div = document.createElement('div');
      div.className = 'showcase';
      div.innerHTML = `
        <a href="${fileName}" class="showcase-img-box">
          <img src="./assets/images/${folder}/${encodeURIComponent(product.PRODUCT)}.png" alt="${product.PRODUCT}" class="showcase-img" width="70">
        </a>
        <div class="showcase-content">
          <a href="${fileName}">
            <h4 class="showcase-title">${product.PRODUCT}</h4>
          </a>
          <a href="#" class="showcase-category">${product.CATEGORY}</a>
          <div class="price-box">
            <p class="price">$${parseFloat(product['SELLING PRICE']).toFixed(2)}</p>
            <del>$${(parseFloat(product['SELLING PRICE']) * 1.25).toFixed(2)}</del>
          </div>
        </div>
      `;
      riceContainer.appendChild(div);
    });

    // Ambient
    const ambientContainer = document.getElementById('ambient-container');
    const ambientProducts = products.filter(p => p.CATEGORY.toLowerCase().includes('ambient'));
    ambientProducts.forEach(product => {
      const fileName = "product.html?product=" + encodeURIComponent(product.PRODUCT);
      const folder = encodeURIComponent(product.CATEGORY.trim());
      const div = document.createElement('div');
      div.className = 'showcase';
      div.innerHTML = `
        <a href="${fileName}" class="showcase-img-box">
          <img src="./assets/images/${folder}/${encodeURIComponent(product.PRODUCT)}.png" alt="${product.PRODUCT}" class="showcase-img" width="70">
        </a>
        <div class="showcase-content">
          <a href="${fileName}">
            <h4 class="showcase-title">${product.PRODUCT}</h4>
          </a>
          <a href="#" class="showcase-category">${product.CATEGORY}</a>
          <div class="price-box">
            <p class="price">$${parseFloat(product['SELLING PRICE']).toFixed(2)}</p>
            <del>$${(parseFloat(product['SELLING PRICE']) * 1.25).toFixed(2)}</del>
          </div>
        </div>
      `;
      ambientContainer.appendChild(div);
    });
  })
  .catch(error => console.error('Error loading products:', error));

// Load Deal of the Day product
fetch('products_data.json')
  .then(response => response.json())
  .then(products => {
    const product = products[4]; // Pick your deal product
    const fileName = "product.html?product=" + encodeURIComponent(product.PRODUCT);
    const folder = encodeURIComponent(product.CATEGORY.trim());

    const container = document.getElementById('deal-of-the-day');
    container.innerHTML = `
      <div class="showcase">
        <img src="./assets/images/${folder}/${encodeURIComponent(product.PRODUCT)}.png" alt="${product.PRODUCT}" class="showcase-img" width="300" height="300">
        <div class="showcase-content">
          <h4 class="showcase-title">${product.PRODUCT}</h4>
          <p class="showcase-desc">Special offer on ${product.PRODUCT}. Limited stock available!</p>
          <div class="price-box">
            <p class="price">$${parseFloat(product['SELLING PRICE']).toFixed(2)}</p>
            <del>$${(parseFloat(product['SELLING PRICE']) * 1.25).toFixed(2)}</del>
          </div>
          <a href="${fileName}" class="add-cart-btn">View Product</a>
        </div>
      </div>
    `;
  })
  .catch(error => console.error('Error loading Deal of the Day:', error));

// Load New Products grid
fetch('products_data.json')
  .then(response => response.json())
  .then(products => {
    const grid = document.getElementById('new-products-grid');
    const newProducts = products.slice(104, 130);

    newProducts.forEach(product => {
      const fileName = "product.html?product=" + encodeURIComponent(product.PRODUCT);
      const folder = encodeURIComponent(product.CATEGORY.trim());

      const div = document.createElement('div');
      div.className = 'showcase';

      div.innerHTML = `
        <div class="showcase-banner">
          <img src="./assets/images/${folder}/${encodeURIComponent(product.PRODUCT)}.png" alt="${product.PRODUCT}" class="product-img default">
          <img src="./assets/images/${folder}/${encodeURIComponent(product.PRODUCT)}.png" alt="${product.PRODUCT}" class="product-img hover" width="300">
          <p class="showcase-badge">New</p>
          <div class="showcase-actions">
            <button class="btn-action"><ion-icon name="heart-outline"></ion-icon></button>
            <button class="btn-action"><ion-icon name="eye-outline"></ion-icon></button>
            <button class="btn-action"><ion-icon name="repeat-outline"></ion-icon></button>
            <button class="btn-action"><ion-icon name="bag-add-outline"></ion-icon></button>
          </div>
        </div>
        <div class="showcase-content">
          <a href="${fileName}">
            <h3 class="showcase-title">${product.PRODUCT}</h3>
          </a>
          <div class="price-box">
            <p class="price">$${parseFloat(product['SELLING PRICE']).toFixed(2)}</p>
            <del>$${(parseFloat(product['SELLING PRICE']) * 1.25).toFixed(2)}</del>
          </div>
        </div>
      `;

      grid.appendChild(div);
    });
  })
  .catch(error => console.error('Error loading New Products:', error));


 // Load product data dynamically for product page
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productNameParam = urlParams.get("product");

  if (productNameParam) {
    fetch("products_data.json")
      .then(response => response.json())
      .then(products => {
        const product = products.find(
          p => p.PRODUCT.toLowerCase() === productNameParam.toLowerCase()
        );

        if (product) {
          // Title & breadcrumbs
          document.getElementById("product-title").textContent = product.PRODUCT;
          document.getElementById("product-title-breadcrumb").textContent = product.PRODUCT;
          document.getElementById("product-category").textContent = product.CATEGORY;
          document.getElementById("product-category").href = "category.html?category=" + encodeURIComponent(product.CATEGORY);

          // Image
          // Use the category name directly as the folder
          const imageFolder = product.CATEGORY.trim();

          const imageFile = encodeURIComponent(product.PRODUCT) + ".png";
          document.getElementById("product-image").src = `./assets/images/${imageFolder}/${imageFile}`;
          document.getElementById("product-image").alt = product.PRODUCT;

          // Name
          document.getElementById("product-name").textContent = product.PRODUCT;

          // Price
          const price = `$${parseFloat(product["SELLING PRICE"]).toFixed(2)}`;
          document.getElementById("product-price").textContent = price;

          // Description (custom or generic)
          document.getElementById("product-description").textContent =
            `${product.PRODUCT} is a premium quality product sourced carefully for the best taste and freshness.`;

          // Load related products
          const relatedContainer = document.getElementById("related-products-container");
          const relatedProducts = products.filter(
            p =>
              p.CATEGORY.toLowerCase() === product.CATEGORY.toLowerCase() &&
              p.PRODUCT.toLowerCase() !== product.PRODUCT.toLowerCase()
          );

          if (relatedProducts.length === 0) {
            relatedContainer.innerHTML = "<p>No related products found.</p>";
            return;
          }

          // Make container horizontally scrollable
          relatedContainer.style.display = "flex";
          relatedContainer.style.overflowX = "auto";
          relatedContainer.style.gap = "1rem";
          relatedContainer.style.padding = "1rem 0";

          relatedProducts.forEach(related => {
            const relatedFolder = related.CATEGORY.trim();


            const relatedFile = encodeURIComponent(related.PRODUCT) + ".png";
            const fileName = "product.html?product=" + encodeURIComponent(related.PRODUCT);

            const div = document.createElement("div");
            div.className = "showcase";
            div.style.minWidth = "200px";

            div.innerHTML = `
              <div class="showcase-banner">
                <img src="./assets/images/${relatedFolder}/${relatedFile}" alt="${related.PRODUCT}" class="product-img default">
              </div>
              <div class="showcase-content">
                <a href="${fileName}">
                  <h4 class="showcase-title">${related.PRODUCT}</h4>
                </a>
                <div class="price-box">
                  <p class="price">$${parseFloat(related["SELLING PRICE"]).toFixed(2)}</p>
                  <del>$${(parseFloat(related["SELLING PRICE"]) * 1.25).toFixed(2)}</del>
                </div>
              </div>
            `;

            relatedContainer.appendChild(div);
          });

        } else {
          console.error("Product not found in JSON.");
        }
      })
      .catch(error => console.error("Error loading product data:", error));
  }
});

// CATEGORY PAGE PRODUCT GRID LOADER
document.addEventListener("DOMContentLoaded", () => {
  // Check if the product grid element exists on this page
  const grid = document.getElementById("product-grid");
  if (!grid) return; // Exit if this is not the category page

  // Get ?category=... from URL
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  const titleEl = document.getElementById("category-title");
  if (category && titleEl) {
    titleEl.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Products`;
  }

  fetch("products_data.json")
    .then(res => res.json())
    .then(products => {
      const filtered = category
        ? products.filter(p => p.CATEGORY.toLowerCase().includes(category.toLowerCase()))
        : products;

      if (filtered.length === 0) {
        grid.innerHTML = "<p>No products found in this category.</p>";
        return;
      }

      filtered.forEach(p => {
        const productHTML = `
          <div class="showcase">
            <div class="showcase-banner">
              <img src="./assets/images/${encodeURIComponent(p.CATEGORY)}/${encodeURIComponent(p.PRODUCT)}.png" alt="${p.PRODUCT}" class="product-img default" width="300">
              <img src="./assets/images/${encodeURIComponent(p.CATEGORY)}/${encodeURIComponent(p.PRODUCT)}.png" alt="${p.PRODUCT}" class="product-img hover" width="300">
              <p class="showcase-badge angle black">New</p>
              <div class="showcase-actions">
                <button class="btn-action"><ion-icon name="heart-outline"></ion-icon></button>
                <button class="btn-action"><ion-icon name="eye-outline"></ion-icon></button>
                <button class="btn-action"><ion-icon name="repeat-outline"></ion-icon></button>
                <button class="btn-action"><ion-icon name="bag-add-outline"></ion-icon></button>
              </div>
            </div>
            <div class="showcase-content">
              <a href="category.html?category=${encodeURIComponent(p.CATEGORY)}" class="showcase-category">${p.CATEGORY}</a>
              <h3><a href="product.html?product=${encodeURIComponent(p.PRODUCT)}" class="showcase-title">${p.PRODUCT}</a></h3>
              <div class="showcase-rating">
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star-outline"></ion-icon>
                <ion-icon name="star-outline"></ion-icon>
              </div>
              <div class="price-box">
                <p class="price">$${parseFloat(p["SELLING PRICE"]).toFixed(2)}</p>
                <del>$${parseFloat(p["MARKED PRICE"]).toFixed(2)}</del>
              </div>
            </div>
          </div>
        `;
        grid.insertAdjacentHTML("beforeend", productHTML);
      });
    })
    .catch(err => console.error("Error loading products:", err));
});

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initCartPage();
  setupAddToCart();
});

// =========================
// CART PAGE INITIALIZATION
// =========================
function initCartPage() {
  const cartContainer = document.getElementById("cart-container");
  const cartTotalEl = document.getElementById("cart-total");
  const clearBtn = document.getElementById("clear-cart-btn");

  if (!cartContainer || !cartTotalEl || !clearBtn) {
    // This is not the cart page
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalEl.textContent = "";
    return;
  }

  let total = 0;
  const table = document.createElement("table");
  table.innerHTML = `
    <tr>
      <th style="text-align:left">Product</th>
      <th style="text-align:right">Price</th>
      <th style="text-align:center">Quantity</th>
      <th style="text-align:right">Subtotal</th>
    </tr>
  `;

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td style="text-align:right">$${item.price.toFixed(2)}</td>
      <td style="text-align:center">${item.quantity}</td>
      <td style="text-align:right">$${subtotal.toFixed(2)}</td>
    `;
    table.appendChild(row);
  });

  cartContainer.appendChild(table);
  cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;

  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("cart");
    location.reload();
  });
}

// =========================
// ADD TO CART BUTTON HANDLING
// =========================
function setupAddToCart() {
  const productNameEl = document.getElementById("product-name");
  if (!productNameEl) return; // Not the product page

  const urlParams = new URLSearchParams(window.location.search);
  const productName = urlParams.get("product");
  if (!productName) return;

  fetch("products_data.json")
    .then(res => res.json())
    .then(data => {
      const product = data.find(p => p.PRODUCT === productName);
      if (!product) return;

      // Populate details
      document.getElementById("product-name").textContent = product.PRODUCT;
      document.getElementById("product-price").textContent = `$${parseFloat(product["SELLING PRICE"]).toFixed(2)}`;
      const desc = document.getElementById("product-description");
      if (desc) desc.textContent = product.DESCRIPTION;

      // Attach click handler to Add to Cart
      const addBtn = document.getElementById("add-to-cart-btn");
      if (addBtn) {
        addBtn.addEventListener("click", () => {
          const name = product.PRODUCT;
          const price = parseFloat(product["SELLING PRICE"]);

          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          const existing = cart.find(item => item.name === name);
          if (existing) {
            existing.quantity += 1;
          } else {
            cart.push({ name, price, quantity: 1 });
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartCount();
          alert(`${name} added to cart!`);
        });
      }
    })
    .catch(err => console.error("Error loading product data:", err));
}

// =========================
// UPDATE CART COUNT
// =========================
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("#cart-count, .count").forEach(el => {
    el.textContent = totalCount;
  });
}

// =========================
// CHECKOUT FORM HANDLING
// =========================
document.addEventListener("DOMContentLoaded", () => {
  // ✅ Initialize EmailJS SDK v4
  emailjs.init({
    publicKey: "qgF8w_fhbbtzEgOsy",
  });

  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function(e) {
      e.preventDefault();

      const name = checkoutForm.name.value.trim();
      const email = checkoutForm.email.value.trim();
      const phone = checkoutForm.phone.value.trim();
      const address = checkoutForm.address.value.trim();
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      // Convert items into a plain text list
      const orderDetails = cart
        .map(item => {
          return `${item.quantity} x ${item.name} @ $${item.price.toFixed(2)} each = $${(item.price * item.quantity).toFixed(2)}`;
        })
        .join("\n");

      const total = cart
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2);

      const orderId = "ORD-" + Date.now();
      const orderDetailsText = cart.map(item => 
  `${item.quantity} x ${item.name} ($${item.price.toFixed(2)} each)`
).join("\n");

const orderDetailsHtml = cart.map(item => 
  `<tr>
    <td>${item.name}</td>
    <td>${item.quantity}</td>
    <td>$${(item.price * item.quantity).toFixed(2)}</td>
  </tr>`
).join("");


      // ✅ Send email with flat parameters
      emailjs.send("service_iyoohre", "template_xoqnwhr", {
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        customer_address: address,
        order_id: orderId,
        order_details: orderDetailsText,   // 🟢 Plain text version
        order_table_rows: orderDetailsHtml, // 🟢 HTML rows version
        shipping_cost: "0.00",
        tax_cost: "0.00",
        order_total: total
      })
        .then(() => {
          alert("Thank you! A confirmation email has been sent.");
          localStorage.removeItem("cart");
          updateCartCount();
          window.location.href = "index.html";
        })
        .catch(error => {
          console.error("EmailJS error:", error);
          alert("Sorry, there was an error sending your order.");
        });
    });
  }
});



  //test
  fetch('products_data.json')
  .then(response => response.json())
  .then(products => {
    console.log('Loaded products:', products);
  })
  .catch(error => console.error('Fetch error:', error));

