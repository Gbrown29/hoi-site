

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("Public"));

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

// Create invoice PDF
function generateInvoicePDF({ orderNumber, name, email, phone, address, cart }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const filename = `invoice-${orderNumber}.pdf`;
    const filepath = path.join(__dirname, filename);
    const stream = fs.createWriteStream(filepath);

    doc.pipe(stream);

    // Logo
    const logoPath = path.join(__dirname, "assets", "logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 50, { width: 100 });
    }

    doc.fontSize(18).text("House of India PA", 50, 160);
    doc.fontSize(12).text(`Order #: ${orderNumber}`);
    doc.text(`Name: ${name}`);
    doc.text(`Email: ${email}`);
    doc.text(`Phone: ${phone}`);
    doc.text(`Address: ${address}`);
    doc.moveDown();

    doc.fontSize(14).text("Order Details:");
    cart.forEach((item, i) => {
      doc.fontSize(12).text(`${i + 1}. ${item.name} x ${item.quantity} @ $${item.price}`);
    });

    const total = cart.reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0);
    doc.moveDown();
    doc.fontSize(14).text(`Total: $${total.toFixed(2)}`);

    doc.end();
    stream.on("finish", () => resolve(filepath));
    stream.on("error", reject);
  });
}

// API endpoint
app.post("/api/create-order", async (req, res) => {
  try {
    const { name, email, phone, address, cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    const orderNumber = `HOI-${Date.now()}`;
    const filepath = await generateInvoicePDF({ orderNumber, name, email, phone, address, cart });

    const mailOptions = {
      from: process.env.OUTLOOK_USER,
      to: `${email}, houseofindiapa@gmail.com, info@hoipa.com`,
      subject: `Invoice for Order #${orderNumber}`,
      text: `Hi ${name},\n\nPlease find attached your invoice.\n\nThanks,\nHouse of India PA`,
      attachments: [
        {
          filename: path.basename(filepath),
          path: filepath
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    fs.unlinkSync(filepath); // Delete after sending

    res.json({ success: true, orderNumber });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
