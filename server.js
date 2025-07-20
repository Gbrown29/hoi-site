const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Client, environments, SquareClient } = require("square");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static("Public"));

const squareClient = new SquareClient({
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? "production"
      : "sandbox",
  accessToken: process.env.SQUARE_ACCESS_TOKEN
});

const ordersApi = squareClient.ordersApi;
const invoicesApi = squareClient.invoicesApi;
const locationId = process.env.SQUARE_LOCATION_ID;

app.post("/api/create-order", async (req, res) => {
  try {
    const { name, email, phone, address, cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    // Create order
    const orderResponse = await ordersApi.createOrder({
      order: {
        locationId,
        lineItems: cart.map((item) => ({
          name: item.name,
          quantity: item.quantity.toString(),
          basePriceMoney: {
            amount: Math.round(parseFloat(item.price) * 100),
            currency: "USD"
          }
        }))
      },
      idempotencyKey: Date.now().toString()
    });

    // Create invoice
    const invoiceResponse = await invoicesApi.createInvoice({
      invoice: {
        locationId,
        orderId: orderResponse.result.order.id,
        primaryRecipient: {
          emailAddress: email,
          displayName: name,
          phoneNumber: phone
        },
        paymentRequests: [
          {
            requestType: "BALANCE",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]
          }
        ],
        title: "Your House of India PA Order",
        deliveryMethod: "EMAIL"
      },
      idempotencyKey: Date.now().toString()
    });

    res.json({
      success: true,
      invoiceId: invoiceResponse.result.invoice.id,
      orderId: orderResponse.result.order.id
    });
  } catch (error) {
    console.error("Square API error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



