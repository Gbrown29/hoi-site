

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

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
// --- Optional MongoDB (Atlas) Support ---
let MongoClient = null;
let ObjectId = null;
try {
  const mongo = require('mongodb');
  MongoClient = mongo.MongoClient;
  ObjectId = mongo.ObjectId;
} catch (e) {
  // mongodb package not installed yet; will fall back to file storage
}
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'hoipa';

let __mongoClient = null;
let __reviewsCollection = null;
async function getReviewsCollection() {
  try {
    if (!MongoClient || !MONGODB_URI) return null;
    if (__reviewsCollection) return __reviewsCollection;
    if (!__mongoClient) {
      __mongoClient = await MongoClient.connect(MONGODB_URI);
    }
    const db = __mongoClient.db(MONGODB_DB);
    __reviewsCollection = db.collection('reviews');
    // Basic index for product and createdAt
    try {
      await __reviewsCollection.createIndex({ product: 1, createdAt: -1 });
    } catch (e) {
      // ignore index errors
    }
    return __reviewsCollection;
  } catch (err) {
    console.warn('MongoDB unavailable, falling back to file storage:', err.message || err);
    return null;
  }
}

let __ordersCollection = null;
async function getOrdersCollection() {
  try {
    if (!MongoClient || !MONGODB_URI) return null;
    if (__ordersCollection) return __ordersCollection;
    if (!__mongoClient) {
      __mongoClient = await MongoClient.connect(MONGODB_URI);
    }
    const db = __mongoClient.db(MONGODB_DB);
    __ordersCollection = db.collection('orders');
    try {
      await __ordersCollection.createIndex({ email: 1, createdAt: -1 });
      await __ordersCollection.createIndex({ 'items.name': 1 });
    } catch (e) {}
    return __ordersCollection;
  } catch (err) {
    console.warn('MongoDB orders unavailable:', err.message || err);
    return null;
  }
function normalizeName(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function escapeRegex(s){return String(s||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}

}

app.set('trust proxy', 1);

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
    try {
      const ordersCol = await getOrdersCollection();
      if (ordersCol) {
        await ordersCol.insertOne({ name, email, phone, address, items: cart, orderNumber, createdAt: new Date() });
      }
    } catch (e) {
      console.warn('Order store failed:', e.message || e);
    }

    res.json({ success: true, orderNumber });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
// Submit a new review (DB if available, else file)

app.post('/api/reviews', async (req, res) => {
  try {
    const { product, name, review, rating, email } = req.body;
    const numericRating = Number(rating);
    if (!product || !name || !review || !Number.isFinite(numericRating)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const safeRating = Math.max(1, Math.min(5, Math.round(numericRating)));

    // Determine verified purchase
    let verified = false;
    try {
      const ordersCol = await getOrdersCollection();
      if (ordersCol && email) {
        const normProduct = normalizeName(product);
        const emailQuery = { email: { $regex: `^${escapeRegex(email)}$`, $options: 'i' } };
        const order = await ordersCol.findOne(emailQuery, { projection: { items: 1 } });
        if (order && Array.isArray(order.items)) {
          verified = order.items.some(it => normalizeName(it.name) === normProduct);
        }
      }
    } catch (_) {}

    const baseDoc = { product, name, email: (email || null), review, rating: safeRating, verified, helpfulCount: 0, reportCount: 0, createdAt: new Date() };

    const col = await getReviewsCollection();
    if (col) {
      const result = await col.insertOne(baseDoc);
      return res.json({ success: true, storage: 'db', id: String(result.insertedId) });
    }

    // Fallback to file
    fs.readFile(reviewsFile, 'utf8', (err, data) => {
      const initialData = err ? '{}' : data;
      let allReviews = {};
      try { allReviews = JSON.parse(initialData || '{}'); } catch (e) { allReviews = {}; }
      if (!allReviews[product]) allReviews[product] = [];
      const id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
      allReviews[product].push({ ...baseDoc, id, createdAt: baseDoc.createdAt.toISOString(), helpfulBy: [] });
      fs.writeFile(reviewsFile, JSON.stringify(allReviews, null, 2), (writeErr) => {
        if (writeErr) return res.status(500).json({ error: 'Failed to save review' });
        res.json({ success: true, storage: 'file', id });
      });
    });
  } catch (e) {
    console.error('POST /api/reviews error:', e);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});




// Get reviews for a product (pagination + sorting). If DB configured, use it; else JSON file.
app.get('/api/reviews', async (req, res) => {
  try {
    const product = req.query.product;
    if (!product) return res.status(400).json({ error: 'Product name required' });

    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const pageSize = Math.max(1, Math.min(50, parseInt(req.query.pageSize || '10', 10)));
    const sortParam = String(req.query.sort || 'newest');

    // Map sort param to DB sort
    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      highest: { rating: -1, createdAt: -1 },
      lowest: { rating: 1, createdAt: -1 },
    };
    const sort = sortMap[sortParam] || sortMap.newest;

    const col = await getReviewsCollection();
    if (col) {
      const query = { product };
      const total = await col.countDocuments(query);
      const items = await col
        .find(query)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();

      // Lazy verification: if a review has email but verified=false, re-check orders and update
      try {
        const ordersCol = await getOrdersCollection();
        if (ordersCol) {
          for (const doc of items) {
            if (!doc.verified && doc.email) {
              const normProduct = normalizeName(product);
              const emailQuery = { email: { $regex: `^${escapeRegex(doc.email)}$`, $options: 'i' } };
              const order = await ordersCol.findOne(emailQuery, { projection: { items: 1 } });
              if (order && Array.isArray(order.items)) {
                const match = order.items.some(it => normalizeName(it.name) === normProduct);
                if (match) {
                  await col.updateOne({ _id: doc._id }, { $set: { verified: true } });
                  doc.verified = true;
                }
              }
            }
          }
        }
      } catch (_) {}

      return res.json({ items, total, page, pageSize });
    }

    // Fallback to file
    fs.readFile(reviewsFile, 'utf8', (err, data) => {
      if (err) return res.status(500).json({ error: 'Unable to read reviews' });
      const allReviews = JSON.parse(data || '{}');
      let items = (allReviews[product] || []).slice();

      // Sort
      items.sort((a, b) => {
        const ar = Number(a.rating) || 0;
        const br = Number(b.rating) || 0;
        const ad = new Date(a.createdAt || 0).getTime();
        const bd = new Date(b.createdAt || 0).getTime();
        if (sortParam === 'highest') return br - ar || bd - ad;
        if (sortParam === 'lowest') return ar - br || bd - ad;
        if (sortParam === 'oldest') return ad - bd;
        return bd - ad; // newest
      });

      const total = items.length;
      const start = (page - 1) * pageSize;
      items = items.slice(start, start + pageSize);
      res.json({ items, total, page, pageSize });
    });
  } catch (e) {
    console.error('GET /api/reviews error:', e);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});
// Reviews aggregate for histogram & average
app.get('/api/reviews/aggregate', async (req, res) => {
  try {
    const product = req.query.product;
    if (!product) return res.status(400).json({ error: 'Product name required' });

    const col = await getReviewsCollection();
    if (col) {
      const pipeline = [
        { $match: { product } },
        { $group: { _id: '$rating', count: { $sum: 1 }, avg: { $avg: '$rating' } } }
      ];
      const grouped = await col.aggregate(pipeline).toArray();
      const counts = { 1:0, 2:0, 3:0, 4:0, 5:0 };
      let total = 0;
      let sum = 0;
      grouped.forEach(g => { const r = Number(g._id) || 0; counts[r] = g.count; total += g.count; sum += (r * g.count); });
      const average = total ? (sum / total) : 0;
      return res.json({ total, average, counts });
    }

    // Fallback to file
    fs.readFile(reviewsFile, 'utf8', (err, data) => {
      if (err) return res.status(500).json({ error: 'Unable to read reviews' });
      const all = JSON.parse(data || '{}');
      const arr = all[product] || [];
      const counts = { 1:0, 2:0, 3:0, 4:0, 5:0 };
      let total = 0; let sum = 0;
      arr.forEach(r => { const rating = Number(r.rating)||0; if (rating>=1 && rating<=5) { counts[rating]++; total++; sum += rating; } });
      const average = total ? (sum / total) : 0;
      res.json({ total, average, counts });
    });
  } catch (e) {
    console.error('GET /api/reviews/aggregate error:', e);
    res.status(500).json({ error: 'Failed to fetch aggregate' });
  }
});

function ipHash(req) {
  const secret = process.env.ADMIN_SECRET || 'dev-secret';
  const ip = req.ip || (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection?.remoteAddress || 'unknown';
  return crypto.createHmac('sha256', secret).update(ip).digest('hex');
}

// Mark review as helpful
app.post('/api/reviews/:id/helpful', async (req, res) => {
  try {
    const id = req.params.id;
    const hash = ipHash(req);

    const col = await getReviewsCollection();
    if (col) {
      const _id = (ObjectId && ObjectId.isValid(id)) ? new ObjectId(id) : null;
      if (!_id) return res.status(400).json({ error: 'Invalid id' });
      const doc = await col.findOne({ _id });
      if (!doc) return res.status(404).json({ error: 'Not found' });
      const already = (doc.helpfulBy || []).includes(hash);
      if (already) return res.json({ success: true, helpfulCount: doc.helpfulCount || 0 });
      await col.updateOne({ _id }, { $addToSet: { helpfulBy: hash }, $inc: { helpfulCount: 1 } });
      const updated = await col.findOne({ _id }, { projection: { helpfulCount: 1 } });
      return res.json({ success: true, helpfulCount: updated?.helpfulCount || 0 });
    }

    // Fallback to file
    fs.readFile(reviewsFile, 'utf8', (err, data) => {
      if (err) return res.status(500).json({ error: 'Unable to read reviews' });
      const all = JSON.parse(data || '{}');
      let updated = false; let count = 0;
      for (const key of Object.keys(all)) {
        const arr = all[key];
        const rev = arr.find(r => r.id === id);
        if (rev) {
          rev.helpfulBy = rev.helpfulBy || [];
          if (!rev.helpfulBy.includes(hash)) {
            rev.helpfulBy.push(hash);
            rev.helpfulCount = (rev.helpfulCount || 0) + 1;
            count = rev.helpfulCount; updated = true; break;
          } else { count = rev.helpfulCount || 0; break; }
        }
      }
      if (!updated) return res.json({ success: true, helpfulCount: count });
      fs.writeFile(reviewsFile, JSON.stringify(all, null, 2), (werr) => {
        if (werr) return res.status(500).json({ error: 'Failed to persist' });
        res.json({ success: true, helpfulCount: count });
      });
    });
  } catch (e) {
    console.error('POST /api/reviews/:id/helpful error:', e);
    res.status(500).json({ error: 'Failed to mark helpful' });
  }
});

// Report a review
app.post('/api/reviews/:id/report', async (req, res) => {
  try {
    const id = req.params.id;
    const col = await getReviewsCollection();
    if (col) {
      const _id = (ObjectId && ObjectId.isValid(id)) ? new ObjectId(id) : null;
      if (!_id) return res.status(400).json({ error: 'Invalid id' });
      await col.updateOne({ _id }, { $set: { reported: true }, $inc: { reportCount: 1 } });
      return res.json({ success: true });
    }
    fs.readFile(reviewsFile, 'utf8', (err, data) => {
      if (err) return res.status(500).json({ error: 'Unable to read reviews' });
      const all = JSON.parse(data || '{}');
      let updated = false;
      for (const key of Object.keys(all)) {
        const rev = (all[key] || []).find(r => r.id === id);
        if (rev) { rev.reported = true; rev.reportCount = (rev.reportCount || 0) + 1; updated = true; break; }
      }
      if (!updated) return res.status(404).json({ error: 'Not found' });
      fs.writeFile(reviewsFile, JSON.stringify(all, null, 2), (werr) => {
        if (werr) return res.status(500).json({ error: 'Failed to persist' });
        res.json({ success: true });
      });
    });
  } catch (e) {
    console.error('POST /api/reviews/:id/report error:', e);
    res.status(500).json({ error: 'Failed to report review' });
  }
});

// Admin: attach email to a review and auto-verify it
app.post('/api/reviews/:id/verify', async (req, res) => {
  try {
    const adminHeader = req.headers['x-admin-secret'];
    const adminSecret = process.env.ADMIN_SECRET || '';
    if (!adminSecret || adminHeader !== adminSecret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const id = req.params.id;
    const { email } = req.body || {};
    if (!email || typeof email !== 'string') return res.status(400).json({ error: 'Email required' });

    const col = await getReviewsCollection();
    if (!col) return res.status(500).json({ error: 'DB required for this operation' });

    const _id = (ObjectId && ObjectId.isValid(id)) ? new ObjectId(id) : null;
    if (!_id) return res.status(400).json({ error: 'Invalid id' });

    const doc = await col.findOne({ _id });
    if (!doc) return res.status(404).json({ error: 'Not found' });

    const ordersCol = await getOrdersCollection();
    let verified = false;
    if (ordersCol) {
      const normProduct = normalizeName(doc.product);
      const emailQuery = { email: { $regex: `^${escapeRegex(email)}$`, $options: 'i' } };
      const order = await ordersCol.findOne(emailQuery, { projection: { items: 1 } });
      if (order && Array.isArray(order.items)) {
        verified = order.items.some(it => normalizeName(it.name) === normProduct);
      }
    }

    await col.updateOne({ _id }, { $set: { email, verified } });
    res.json({ success: true, verified });
  } catch (e) {
    console.error('POST /api/reviews/:id/verify error:', e);
    res.status(500).json({ error: 'Failed to verify review' });
  }
});

// Owner reply to a review (admin)
app.post('/api/reviews/:id/reply', async (req, res) => {
  try {
    const adminHeader = req.headers['x-admin-secret'];
    const adminSecret = process.env.ADMIN_SECRET || '';
    if (!adminSecret || adminHeader !== adminSecret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const id = req.params.id;
    const { reply } = req.body;
    if (!reply || typeof reply !== 'string' || reply.trim().length < 2) {
      return res.status(400).json({ error: 'Reply too short' });
    }
    const payload = { text: reply.trim(), createdAt: new Date() };

    const col = await getReviewsCollection();
    if (col) {
      const _id = (ObjectId && ObjectId.isValid(id)) ? new ObjectId(id) : null;
      if (!_id) return res.status(400).json({ error: 'Invalid id' });
      await col.updateOne({ _id }, { $set: { reply: payload } });
      return res.json({ success: true });
    }

    fs.readFile(reviewsFile, 'utf8', (err, data) => {
      if (err) return res.status(500).json({ error: 'Unable to read reviews' });
      const all = JSON.parse(data || '{}');
      let updated = false;
      for (const key of Object.keys(all)) {
        const rev = (all[key] || []).find(r => r.id === id);
        if (rev) { rev.reply = { ...payload, createdAt: payload.createdAt.toISOString() }; updated = true; break; }
      }
      if (!updated) return res.status(404).json({ error: 'Not found' });
      fs.writeFile(reviewsFile, JSON.stringify(all, null, 2), (werr) => {
        if (werr) return res.status(500).json({ error: 'Failed to persist' });
        res.json({ success: true });
      });
    });
  } catch (e) {
    console.error('POST /api/reviews/:id/reply error:', e);
    res.status(500).json({ error: 'Failed to save reply' });
  }
});




const os = require('os');
const PORT = process.env.PORT || 5000;

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Server running on http://${localIP}:${PORT}`);
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
