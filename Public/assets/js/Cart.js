// Load cart and display it
document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const cartTotalEl = document.getElementById("cart-total");
  const clearBtn = document.getElementById("clear-cart-btn");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalEl.textContent = "";
    return;
  }

  let total = 0;

  // Create a table for nicer formatting
  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";

  // Header row
  table.innerHTML = `
    <tr>
      <th style="text-align: left; border-bottom: 1px solid #ccc; padding: 8px;">Product</th>
      <th style="text-align: right; border-bottom: 1px solid #ccc; padding: 8px;">Price</th>
      <th style="text-align: center; border-bottom: 1px solid #ccc; padding: 8px;">Quantity</th>
      <th style="text-align: right; border-bottom: 1px solid #ccc; padding: 8px;">Subtotal</th>
    </tr>
  `;

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="padding: 8px;">${item.name}</td>
      <td style="padding: 8px; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 8px; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; text-align: right;">$${subtotal.toFixed(2)}</td>
    `;
    table.appendChild(row);
  });

  cartContainer.appendChild(table);

  cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;

  // Clear cart button
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("cart");
    location.reload();
  });
});
