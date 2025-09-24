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

     // Ambient
    const frozenContainer = document.getElementById('frozen-container');
    const frozenProducts = products.filter(p => p.CATEGORY.toLowerCase().includes('frozen'));
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
      frozenContainer.appendChild(div);
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
          
          // Long Product Description
          const longDescriptionElement = document.getElementById("product-long-description");
          if (product.PRODUCT_DESCRIPTION) {
            longDescriptionElement.textContent = product.PRODUCT_DESCRIPTION;
          } else {
            longDescriptionElement.textContent = "No detailed description available for this product.";
          }
          
          // Additional Information
          const additionalInfoElement = document.getElementById("product-additional-info");
          additionalInfoElement.innerHTML = ""; // Clear previous info
          
          if (product.ADDITIONAL_INFO) {
            Object.entries(product.ADDITIONAL_INFO).forEach(([key, value]) => {
              const li = document.createElement("li");
              li.innerHTML = `<b>${key}:</b> ${value}`;
              additionalInfoElement.appendChild(li);
            });
          } else {
             additionalInfoElement.innerHTML = "<li>No additional information available.</li>";
            }

           // ---------- CUSTOMER REVIEWS ----------

          let selectedRating = 0;
let currentProductName = "";

// Star rating setup
function setupStarRating() {
  const stars = document.querySelectorAll(".star-rating .star");

  function paintSelected(n) {
    stars.forEach((s, i) => s.classList.toggle("selected", i < n));
  }
  function clearHovered() {
    stars.forEach(s => s.classList.remove("hovered"));
  }
  function paintHovered(n) {
    clearHovered();
    stars.forEach((s, i) => s.classList.toggle("hovered", i < n));
  }

  stars.forEach((star, index) => {
    star.addEventListener("mouseenter", () => paintHovered(index + 1));
    star.addEventListener("mouseleave", () => clearHovered());
    star.addEventListener("click", () => {
      selectedRating = index + 1;
      paintSelected(selectedRating);

      // Update submit button enabled state
      const submitBtn = document.getElementById("submit-review-btn");
      if (submitBtn) {
        const name = (document.getElementById("reviewer-name")?.value || "").trim();
        const review = (document.getElementById("review-text")?.value || "").trim();
        submitBtn.disabled = !(name.length >= 2 && review.length >= 10 && selectedRating > 0);
      }
    });
  });
}

// Display reviews for current product
let REVIEWS_STATE = { page: 1, pageSize: 10 };

function renderHistogram(product) {
  fetch(`/api/reviews/aggregate?product=${encodeURIComponent(product)}`)
    .then(r => r.json())
    .then(({ total, average, counts }) => {
      const el = document.getElementById("rating-histogram");
      const summaryEl = document.getElementById("product-rating-summary");
      const inlineAvg = document.getElementById("rating-average-inline");
      if (!el) return;
      const avgRounded = Math.round(average || 0);
      const starStr = "★".repeat(avgRounded) + "☆".repeat(5 - avgRounded);
      const summaryText = `${(average||0).toFixed(1)} / 5 · ${total||0} review${(total||0)>1?"s":""}`;
      if (summaryEl) summaryEl.innerHTML = `<span class=\"stars\">${starStr}</span><span>${summaryText}</span>`;
      if (inlineAvg) inlineAvg.textContent = summaryText;

      function row(label, count) {
        const pct = total ? Math.round((count/total)*100) : 0;
        return `<div class="hist-row"><div class="hist-label">${label}★</div><div class="hist-bar"><span style="width:${pct}%"></span></div><div class="hist-count">${count||0}</div></div>`;
      }
      el.innerHTML = row(5, counts[5]) + row(4, counts[4]) + row(3, counts[3]) + row(2, counts[2]) + row(1, counts[1]);

      // Inject JSON-LD AggregateRating
      const ld = document.getElementById('ld-aggregate');
      const data = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": (average||0).toFixed(1),
          "reviewCount": total||0,
          "bestRating": 5,
          "worstRating": 1
        }
      };
      const json = JSON.stringify(data);
      if (ld) ld.textContent = json; else {
        const s = document.createElement('script');
        s.type = 'application/ld+json'; s.id = 'ld-aggregate'; s.textContent = json;
        document.head.appendChild(s);
      }
    })
    .catch(console.error);
}

function displayReviews(product) {
  const sortSelect = document.getElementById("review-sort");
  const sort = (sortSelect?.value || "newest");
  const { page, pageSize } = REVIEWS_STATE;
  fetch(`/api/reviews?product=${encodeURIComponent(product)}&sort=${encodeURIComponent(sort)}&page=${page}&pageSize=${pageSize}`)
    .then(res => res.json())
    .then(({ items, total, page, pageSize }) => {
      const container = document.getElementById("review-list");
      const info = document.getElementById("page-info");
      const prev = document.getElementById("page-prev");
      const next = document.getElementById("page-next");
      container.innerHTML = "";

      if (!items || items.length === 0) {
        container.innerHTML = "<p>No reviews yet.</p>";
        if (info) info.textContent = "";
        renderHistogram(product);
        return;
      }

      // Render list
      items.forEach(r => {
        const card = document.createElement("div");
        card.className = 'review-card';
        const initials = (r.name||' ').trim().split(/\s+/).map(p=>p[0]).slice(0,2).join('').toUpperCase();
        const stars = "★".repeat(r.rating || 0) + "☆".repeat(5 - (r.rating || 0));
        const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "";
        const verified = r.verified ? `<span class="badge">Verified Purchase</span>` : '';
        const helpful = r.helpfulCount || 0;

        card.innerHTML = `
          <div class="header">
            <div class="author">
              <div class="avatar">${initials || 'U'}</div>
              <div>
                <div><strong>${r.name}</strong> <small>${dateStr}</small></div>
                <div class="stars">${stars}</div>
              </div>
            </div>
            <div class="badges">${verified}</div>
          </div>
          <div class="body"><p>${r.review}</p></div>
          <div class="review-actions">
            <button data-action="helpful" data-id="${r._id || r.id}">Helpful (${helpful})</button>
            <button data-action="report" data-id="${r._id || r.id}">Report</button>
          </div>
        `;
        container.appendChild(card);
      });

      // Wire actions
      container.querySelectorAll('button[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const action = btn.getAttribute('data-action');
          if (action === 'helpful') {
            fetch(`/api/reviews/${id}/helpful`, { method:'POST' })
              .then(r => r.json())
              .then(d => { btn.textContent = `Helpful (${d.helpfulCount||0})`; })
              .catch(console.error);
          } else if (action === 'report') {
            fetch(`/api/reviews/${id}/report`, { method:'POST' })
              .then(() => { btn.textContent = 'Reported'; btn.disabled = true; })
              .catch(console.error);
          }
        });
      });

      // Pagination
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      if (info) info.textContent = `Page ${page} of ${totalPages}`;
      if (prev) {
        prev.disabled = page <= 1;
        prev.onclick = () => { REVIEWS_STATE.page = Math.max(1, page - 1); displayReviews(product); };
      }
      if (next) {
        next.disabled = page >= totalPages;
        next.onclick = () => { REVIEWS_STATE.page = Math.min(totalPages, page + 1); displayReviews(product); };
      }

      // Update histogram and summary to match latest counts
      renderHistogram(product);
    })
    .catch(err => {
      console.error("Error loading reviews:", err);
    });
}

// Submit review
window.submitReview = function () {
  const nameInput = document.getElementById("reviewer-name");
  const emailInput = document.getElementById("reviewer-email");
  const reviewInput = document.getElementById("review-text");

  if (!nameInput || !reviewInput) {
    alert("Review form not found.");
    return;
  }

  const name = nameInput.value.trim();
  const email = (emailInput?.value || '').trim();
  const review = reviewInput.value.trim();

  if (!name || !review || selectedRating === 0) {
    alert("Please enter name, review, and select a star rating.");
    return;
  }

  fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product: currentProductName,
      name,
      email,
      review,
      rating: selectedRating
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Thanks for your review!");
        // Refresh list and histogram in place without reloading
        REVIEWS_STATE.page = 1;
        displayReviews(currentProductName);
      } else {
        alert("Failed to submit review.");
      }
    })
    .catch(err => {
      console.error("Error submitting review:", err);
    });
};

// Initialize reviews UI (run now; we are already inside a DOMContentLoaded)
const urlParams = new URLSearchParams(window.location.search);
currentProductName = decodeURIComponent(urlParams.get("product") || "").trim();

// Live character counter and validation
const nameInput = document.getElementById("reviewer-name");
const reviewInput = document.getElementById("review-text");
const nameMsg = document.getElementById("name-validation");
const reviewMsg = document.getElementById("review-validation");
const charCount = document.getElementById("char-count");
const submitBtn = document.getElementById("submit-review-btn");
const sortSelect = document.getElementById("review-sort");

function validate() {
  let ok = true;
  if (nameInput) {
    const v = nameInput.value.trim();
    if (v.length < 2) { nameMsg.textContent = "Name must be at least 2 characters."; ok = false; }
    else if (!/^[a-zA-Z0-9 .,'-]{2,50}$/.test(v)) { nameMsg.textContent = "Only letters, numbers, spaces and .,'- allowed."; ok = false; }
    else { nameMsg.textContent = ""; }
  }
  if (reviewInput) {
    const v = reviewInput.value.trim();
    if (charCount) charCount.textContent = String(v.length);
    if (v.length < 10) { reviewMsg.textContent = "Review must be at least 10 characters."; ok = false; }
    else if (/(https?:\/\/|\bviagra\b|\bcasino\b)/i.test(v)) { reviewMsg.textContent = "Please remove links or disallowed terms."; ok = false; }
    else { reviewMsg.textContent = ""; }
  }
  if (submitBtn) submitBtn.disabled = !ok || selectedRating === 0;
}

if (nameInput) nameInput.addEventListener("input", validate);
if (reviewInput) reviewInput.addEventListener("input", validate);

if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    if (currentProductName) displayReviews(currentProductName);
  });
}

if (currentProductName) {
  displayReviews(currentProductName);
}

setupStarRating();
validate();

        
          

 

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

      const weightEl = document.getElementById("product-weight");
      if (weightEl) {
        const rawSize = product["PACK SIZE"] || "";
        const formatted = rawSize
          .replace(/x/gi, " x ")
          .replace(/lb/gi, " lb")
          .replace(/packs/gi, " packs")
          .replace(/pcs/gi, " pcs");
        weightEl.textContent = formatted;
      }


      // Attach click handler to Add to Cart
      const addBtn = document.getElementById("add-to-cart-btn");
      if (addBtn) {
  addBtn.addEventListener("click", () => {
    const name = product.PRODUCT;
    const price = parseFloat(product["SELLING PRICE"]);

    // ✅ Get quantity from the input field
    const qtyInput = document.querySelector(".product-qty") || document.querySelector(".pro-qty input");
    const quantity = parseInt(qtyInput?.value) || 1;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity += quantity; // ✅ Add chosen quantity
    } else {
      cart.push({ name, price, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${quantity} x ${name} added to cart!`);
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
fetch("/api/create-order", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name,
    email,
    phone,
    address,
    cart
  }),
})
.then(response => response.json())
.then(data => {
  alert("Thank you! Your order has been created.");
  localStorage.removeItem("cart");
  updateCartCount();
  window.location.href = "index.html";
})
.catch(error => {
  console.error("Order error:", error);
  alert("Sorry, there was an error processing your order.");
});

    });
  }
});

// =================== LIVE SEARCH FUNCTIONALITY ===================
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search-field");
  const searchButton = document.querySelector(".search-btn");
  const resultsContainer = document.getElementById("search-results");

  let productsData = [];

  // Load products JSON for search
  fetch("products_data.json")
    .then(res => res.json())
    .then(data => {
      productsData = data;
      console.log("Products ready for search:", productsData.length);
    });

  function showResults(query) {
    resultsContainer.innerHTML = "";
    if (!query) {
      resultsContainer.style.display = "none";
      return;
    }

    const results = productsData.filter(p =>
      p.PRODUCT.toLowerCase().includes(query) ||
      (p.DESCRIPTION && p.DESCRIPTION.toLowerCase().includes(query))
    );

    if (results.length === 0) {
      resultsContainer.innerHTML = `<div class="result-item">No products found.</div>`;
      resultsContainer.style.display = "block";
      return;
    }

   results.forEach(product => {
  const folder = product.CATEGORY || "default"; // use your category field
  const imagePath = `./assets/images/${folder}/${encodeURIComponent(product.PRODUCT)}.png`;

  const div = document.createElement("div");
  div.classList.add("result-item");
  div.innerHTML = `
    <img src="${imagePath}" alt="${product.PRODUCT}">
    <span>${product.PRODUCT}</span>
  `;
  
  div.addEventListener("click", () => {
    window.location.href = `product.html?product=${encodeURIComponent(product.PRODUCT)}`;
  });

  resultsContainer.appendChild(div);
});

    resultsContainer.style.display = "block";
  }

  // Search on typing (live search)
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    showResults(query);
  });

  // Search on button click
  searchButton.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase().trim();
    showResults(query);
  });
});








  //test
  fetch('products_data.json')
  .then(response => response.json())
  .then(products => {
    console.log('Loaded products:', products);
  })
  .catch(error => console.error('Fetch error:', error));

