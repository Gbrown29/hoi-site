// api/create-invoice.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Get the request body
  const { customerName, customerEmail, customerPhone, customerAddress, cartItems } = req.body;

  if (!customerName || !customerEmail || !cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
  const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

  const square = require('square');
  const { InvoicesApi, LocationsApi, CustomersApi } = square;

  const invoicesApi = new InvoicesApi();
  const customersApi = new CustomersApi();

  // Create or retrieve customer
  let customerId;
  try {
    const response = await customersApi.createCustomer({
      givenName: customerName,
      emailAddress: customerEmail,
      phoneNumber: customerPhone,
      address: {
        addressLine1: customerAddress
      }
    });
    customerId = response.result.customer.id;
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error creating customer" });
  }

  // Create invoice line items
  const lineItems = cartItems.map(item => ({
    name: item.name,
    quantity: item.quantity.toString(),
    basePriceMoney: {
      amount: Math.round(item.price * 100), // Convert to cents
      currency: 'USD'
    }
  }));

  try {
    const invoiceResponse = await invoicesApi.createInvoice({
      invoice: {
        locationId: SQUARE_LOCATION_ID,
        customerId: customerId,
        lineItems: lineItems,
        paymentRequests: [
          {
            requestType: 'BALANCE',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from today
          }
        ],
        title: 'New Order',
        description: 'Order created from website checkout.'
      }
    });

    const invoice = invoiceResponse.result.invoice;
    return res.status(200).json({ invoiceId: invoice.id, invoiceUrl: invoice.publicUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error creating invoice" });
  }
}



