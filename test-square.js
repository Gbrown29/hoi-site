const { Client, environments } = require("square");


const client = new Square.Client({
  environment: "sandbox",
  accessToken: "TEST"
});


console.log("✅ Client created");
console.log(client.ordersApi);
