import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { connectDB } from "./lib/db.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import { clerkMiddleware } from "@clerk/express";
import groupRoutes from "../src/routes/group.routes.js";
import expenseRoutes from "../src/routes/expense.routes.js";
import statsRoutes from "../src/routes/stats.routes.js";
import activityRoutes from "../src/routes/recentActivity.routes.js";

import cors from "cors";

const app = express();

const __dirname = path.resolve();

//middleware
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware()); //this adds req.auth

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/group", groupRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/recentActivity", activityRoutes);

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server", error);
  }
};

startServer();
