import express from "express";
const router = express.Router();
import mongoose from "mongoose";
import { redisClient } from "../config/dbRedisConnect.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://client:3000";
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "localhost";
const ENVIRONMENT = process.env.NODE_ENV || "development";

// Determine if running in Docker or localhost
const isDocker = process.env.RUNNING_IN_DOCKER === "true" || false;
const serviceLocation = isDocker ? `docker:${PORT}` : `${HOST}:${PORT}`;

// Helper to add service location to all responses
const withServiceInfo = (responseObj) => {
  return {
    ...responseObj,
    service: {
      location: serviceLocation,
      environment: ENVIRONMENT,
      host: HOST,
      port: PORT,
      isDocker: isDocker
    }
  };
};

router.get("/pingServer", (req, res) => {
  res.json(withServiceInfo({
    status: "success",
    message: "Server is alive!"
  }));
});

router.get("/pingDb", async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  if (isConnected) {
    res.json(withServiceInfo({
      status: "success",
      message: "MongoDB connection is healthy"
    }));
  } else {
    res.status(500).json(withServiceInfo({
      status: "fail",
      message: "MongoDB is not connected"
    }));
  }
});

router.get("/pingRedis", async (req, res) => {
  try {
    const result = await redisClient.get("test");
    res.json(withServiceInfo({
      status: "success",
      message: "Redis is working",
      data: result
    }));
  } catch (err) {
    res.status(500).json(withServiceInfo({
      status: "error",
      message: "Redis check failed",
      error: err.message
    }));
  }
});

router.get("/pingFrontend", async (req, res) => {
  console.log("Attempting to fetch:", FRONTEND_URL);
  try {
    const response = await fetch(FRONTEND_URL);
    const html = await response.text();
    res.json(withServiceInfo({
      status: "success",
      message: "Frontend is reachable",
      preview: html.slice(0, 100)
    }));
  } catch (err) {
    console.error("Fetch error:", err); // Log the full error
    res.status(500).json(withServiceInfo({
      status: "fail",
      message: "Cannot reach frontend",
      error: err.message
    }));
  }
});

router.get("/pingAll", async (req, res) => {
  // Create service info object
  const serviceInfo = {
    location: serviceLocation,
    environment: ENVIRONMENT,
    host: HOST,
    port: PORT,
    isDocker: isDocker
  };

  // Create individual service checks
  const serverCheck = Promise.resolve({
    status: "OK",
    service: { ...serviceInfo, name: "server" }
  });

  const dbCheck = mongoose.connection.readyState === 1
    ? Promise.resolve({
      status: "OK",
      service: { ...serviceInfo, name: "database" }
    })
    : Promise.reject({
      status: "Disconnected",
      service: { ...serviceInfo, name: "database" }
    });

  const redisCheck = redisClient
    ? redisClient.ping()
      .then(() => ({
        status: "OK",
        service: { ...serviceInfo, name: "redis" }
      }))
      .catch(() => ({
        status: "ERROR",
        service: { ...serviceInfo, name: "redis" }
      }))
    : Promise.resolve({
      status: "Not Initialized",
      service: { ...serviceInfo, name: "redis" }
    });

  const frontendCheck = fetch(FRONTEND_URL)
    .then(response => ({
      status: response.ok ? "OK" : "Unreachable",
      service: { ...serviceInfo, name: "frontend", url: FRONTEND_URL }
    }))
    .catch(() => ({
      status: "ERROR",
      service: { ...serviceInfo, name: "frontend", url: FRONTEND_URL }
    }));

  const allResults = await Promise.allSettled([serverCheck, dbCheck, redisCheck, frontendCheck]);

  const results = {
    server: {
      status: allResults[0].value?.status || "ERROR",
      service: allResults[0].value?.service || { ...serviceInfo, name: "server" }
    },
    db: {
      status: allResults[1].status === "fulfilled" ? allResults[1].value.status : allResults[1].reason.status,
      service: allResults[1].status === "fulfilled" ? allResults[1].value.service : allResults[1].reason.service
    },
    redis: {
      status: allResults[2].value?.status || "ERROR",
      service: allResults[2].value?.service || { ...serviceInfo, name: "redis" }
    },
    frontend: {
      status: allResults[3].value?.status || "ERROR",
      service: allResults[3].value?.service || { ...serviceInfo, name: "frontend", url: FRONTEND_URL }
    }
  };

  res.json({
    status: "summary",
    mainService: serviceInfo,
    results
  });
});

// Add a new endpoint that returns service information only
router.get("/serviceInfo", (req, res) => {
  res.json({
    service: {
      location: serviceLocation,
      environment: ENVIRONMENT,
      host: HOST,
      port: PORT,
      isDocker: isDocker
    }
  });
});

export default router;