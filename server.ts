import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialization of Stripe to prevent crash if key is missing on startup
let stripeClient: Stripe | null = null;
function getStripe() {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key.length < 10 || key.includes("1111") || key === "YOUR_STRIPE_SECRET_KEY") {
      throw new Error("Invalid or missing STRIPE_SECRET_KEY. Please add a valid Stripe Secret Key to the 'Secrets' panel in Settings.");
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Stripe Payment Intent Route
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = "usd" } = req.body;
      
      const stripe = getStripe();
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects cents
        currency,
        metadata: { integration_check: "accept_a_payment" },
      });

      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error("Stripe Error:", error);
      res.status(500).send({ error: error.message });
    }
  });

  // Mock API Routes for the Microservices Architecture
  app.get("/api/v1/menu", (req, res) => {
    // This would typically call the 'Menu Service'
    res.json({ status: "success", data: [] });
  });

  app.post("/api/v1/reservations", (req, res) => {
    // This would typically call the 'Reservation Service'
    res.json({ status: "success", message: "Reservation request received" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`
🚀 Obumpa Eats Premium Server Running
---------------------------------------
Environment: ${process.env.NODE_ENV || 'development'}
Port:        ${PORT}
URL:         http://localhost:${PORT}
    `);
  });
}

startServer();
