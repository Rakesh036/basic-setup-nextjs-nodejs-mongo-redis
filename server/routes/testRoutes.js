import express from "express";
const router = express.Router();
import mongoose from "mongoose";
import { redisClient } from "../config/dbRedisConnect.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://client:3000";

router.get("/pingServer", (req, res) => {
  res.json({ status: "success", message: "Server is alive!" });
});

router.get("/pingDb", async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  if (isConnected) {
    res.json({ status: "success", message: "MongoDB connection is healthy" });
  } else {
    res.status(500).json({ status: "fail", message: "MongoDB is not connected" });
  }
});

router.get("/pingRedis", async (req, res) => {
  try {
    const result = await redisClient.get("test");
    res.json({ status: "success", message: "Redis is working", data: result });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Redis check failed", error: err.message });
  }
});

router.get("/pingFrontend", async (req, res) => {
  console.log("Attempting to fetch:", FRONTEND_URL);
  try {
    const response = await fetch(FRONTEND_URL);
    const html = await response.text();
    res.json({ status: "success", message: "Frontend is reachable", preview: html.slice(0, 100) });
  } catch (err) {
    console.error("Fetch error:", err); // Log the full error
    res.status(500).json({ status: "fail", message: "Cannot reach frontend", error: err.message });
  }
});

router.get("/pingAll", async (req, res) => {
  const results = {};

  const serverCheck = Promise.resolve("OK");

  const dbCheck = mongoose.connection.readyState === 1
    ? Promise.resolve("OK")
    : Promise.reject("Disconnected");

  const redisCheck = redisClient ? redisClient.ping().then(() => "OK").catch(() => "ERROR") : Promise.resolve("Not Initialized");

  const frontendCheck = fetch(FRONTEND_URL)
    .then(response => response.ok ? "OK" : "Unreachable")
    .catch(() => "ERROR");

  const allResults = await Promise.allSettled([serverCheck, dbCheck, redisCheck, frontendCheck]);

  results.server = allResults[0].value || "ERROR";
  results.db = allResults[1].value || allResults[1].reason;
  results.redis = allResults[2].value || allResults[2].reason;
  results.frontend = allResults[3].value || allResults[3].reason;

  res.json({ status: "summary", results });
});

export default router;