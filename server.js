

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const reviewsFile = path.join(__dirname, 'reviews_data.json');

require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("Public"));
app.use(express.json());

let orderCount = 1;
console.log("Email:", process.env.OUTLOOK_EMAIL);
console.log("Password:", process.env.OUTLOOK_PASSWORD);

// Setup email transporter using Outlook SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.OUTLOOK_EMAIL, // info@hoipa.com
    pass: process.env.OUTLOOK_PASSWORD
  }
});


// API endpoint
app.post("/api/create-order", async (req, res) => {
  try {
    const { name, email, phone, address, cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ success: false, error: "Cart is empty." });
    }

    // ✅ Generate Receipt Email
    const orderNumber = "ORD-" + Date.now();

const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
  <!-- Header -->
  <div style="background-color: #f8f8f8; padding: 20px; text-align: center;">
    <img src="https://hoi-site.onrender.com/assets/images/logo/black%20logo.png" alt="House of India Logo" style="max-width: 200px;">
    <h2 style="margin: 10px 0;">Order Receipt</h2>
    <p style="margin: 0; font-size: 14px;">Order Number: <strong>${orderNumber}</strong></p>
  </div>

  <!-- Customer & From Info -->
  <div style="padding: 20px; background: #fff;">
    <div style="margin-bottom: 15px;">
      <h3 style="margin: 0; font-size: 16px;">From:</h3>
      <p style="margin: 5px 0; font-size: 14px;">
        House of India PA<br>
        244 Shoemaker Rd, Pottstown, PA 19464<br>
        Phone: 610-800-3227<br>
        Website: <a href="https://hoipa.com" target="_blank">hoipa.com</a>
      </p>
    </div>

    <div style="margin-bottom: 15px;">
      <h3 style="margin: 0; font-size: 16px;">To:</h3>
      <p style="margin: 5px 0; font-size: 14px;">
        ${name}<br>
        ${address}<br>
        Phone: ${phone}<br>
        Email: ${email}
      </p>
    </div>
  </div>

  <!-- Cart Table -->
  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
    <thead style="background: #f2f2f2;">
      <tr>
        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Image</th>
        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Item</th>
        <th style="padding: 10px; border: 1px solid #ddd;">Qty</th>
        <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Price</th>
      </tr>
    </thead>
    <tbody>
      ${cart
        .map(
          item => `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
            <img src='https://hoi-site.onrender.com/assets/images/${item.category}/${item.name}.png' alt="${item.name}" style="max-width: 60px; border-radius: 4px;">
          </td>
          <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
        )
        .join("")}
    </tbody>
  </table>

  <!-- Footer / Total -->
  <div style="padding: 20px; background-color: #f8f8f8; text-align: right;">
    <h3 style="margin: 0;">Total: $${cart
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2)}</h3>
    <p style="margin: 5px 0; font-size: 12px;">Thank you for your order!</p>
  </div>
</div>
`;

// Send the email
await transporter.sendMail({
  from: `"House of India PA" <${process.env.OUTLOOK_EMAIL}>`,
  to: `${email}, info@hoipa.com`,
  subject: `Your Order Receipt - ${orderNumber}`,
  html: emailHtml
});

    res.json({ success: true, orderNumber });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get reviews for a product
app.get('/api/reviews', (req, res) => {
  const product = req.query.product;
  if (!product) return res.status(400).json({ error: 'Product name required' });

  fs.readFile(reviewsFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Unable to read reviews' });

    const allReviews = JSON.parse(data);
    const reviews = allReviews[product] || [];
    res.json(reviews);
  });
});


//Submit a new review
app.post('/api/reviews', (req, res) => {
  const { product, name, review } = req.body;
  if (!product || !name || !review) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  fs.readFile(reviewsFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Unable to read reviews file' });

    const allReviews = JSON.parse(data);
    if (!allReviews[product]) allReviews[product] = [];
    allReviews[product].push({ name, review });

    fs.writeFile(reviewsFile, JSON.stringify(allReviews, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Failed to save review' });
      res.json({ success: true });
    });
  });
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
