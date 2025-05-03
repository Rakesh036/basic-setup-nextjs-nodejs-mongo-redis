import express from "express";
const router = express.Router();
import mongoose from "mongoose";
import { redisClient } from "../config/dbRedisConnect.js";
import os from 'os';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

router.use('/', (req, res, next) => {
  console.log('Request received:', req.method, req.url);
  next();
});


// Enhanced Docker detection
const isDocker = () => {
  try {
    // Check for .dockerenv file
    // if (fs.existsSync('/.dockerenv')) return true;

    // Check cgroup for docker
    if (fs.existsSync('/proc/self/cgroup')) {
      const cgroup = fs.readFileSync('/proc/self/cgroup', 'utf8');
      if (cgroup.includes('docker')) return true;
    }

    // Check hostname for docker container pattern
    const hostname = os.hostname();
    if (/^[a-f0-9]{12}$/.test(hostname)) return true;

    // Check environment variables
    if (process.env.KUBERNETES_SERVICE_HOST) return true;
    if (process.env.DOCKER_CONTAINER) return true;

    return false;
  } catch (err) {
    return false;
  }
};

// Environment detection
// const isRunningInDocker = isDocker();
const HOST = process.env.HOST || os.hostname();
const PORT = process.env.PORT || 8080;
const ENVIRONMENT = process.env.NODE_ENV || "development";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://client:3000";

// Get network interfaces for better host detection
const getNetworkInfo = () => {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  Object.keys(interfaces).forEach((interfaceName) => {
    interfaces[interfaceName].forEach((iface) => {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({
          interface: interfaceName,
          address: iface.address,
          netmask: iface.netmask,
          mac: iface.mac
        });
      }
    });
  });

  return addresses;
};

// Get connection instructions
const getConnectionInfo = () => {
  const networkInfo = getNetworkInfo();
  const externalIP = networkInfo.find(iface => iface.interface === 'eth0')?.address || 'localhost';

  return {
    internal: {
      docker: {
        url: `http://server:${PORT}`,
        description: "For services within Docker network"
      },
      localhost: {
        url: `http://localhost:${PORT}`,
        description: "For local development"
      }
    },
    external: {
      url: `http://${externalIP}:${PORT}`,
      description: "For external access (if port is exposed)"
    },
    api: {
      baseUrl: `/api`,
      endpoints: [
        { path: '/test/pingAll', method: 'GET', description: 'Check all services status' },
        { path: '/test/pingServer', method: 'GET', description: 'Check server status' },
        { path: '/test/pingDb', method: 'GET', description: 'Check database connection' },
        { path: '/test/pingRedis', method: 'GET', description: 'Check Redis connection' },
        { path: '/test/pingFrontend', method: 'GET', description: 'Check frontend connection' },
        { path: '/test/serviceInfo', method: 'GET', description: 'Get detailed service information' }
      ]
    }
  };
};

// Enhanced service info
const getServiceInfo = () => {
  const networkInfo = getNetworkInfo();
  const serviceInfo = {
    name: "server",
    environment: ENVIRONMENT,
    host: HOST,
    port: PORT,
    isDocker: isRunningInDocker,
    dockerInfo: isRunningInDocker ? {
      containerId: process.env.HOSTNAME || os.hostname(),
      networkMode: process.env.NETWORK_MODE || 'bridge',
      detectedBy: isDocker() ? 'multiple checks' : 'environment variable'
    } : null,
    network: networkInfo,
    platform: {
      os: os.platform(),
      arch: os.arch(),
      release: os.release(),
      type: os.type()
    },
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem()
    },
    uptime: os.uptime(),
    connectionInfo: getConnectionInfo()
  };
  return serviceInfo;
};

// Helper to add service location to all responses
const withServiceInfo = (responseObj) => {
  return {
    ...responseObj,
    service: getServiceInfo(),
    timestamp: new Date().toISOString()
  };
};

router.get("/pingServer", (req, res) => {
  res.json(withServiceInfo({
    status: "success",
    message: "Server is alive!",
    timestamp: new Date().toISOString()
  }));
});

router.get("/pingDb", async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  const dbInfo = {
    status: isConnected ? "connected" : "disconnected",
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name,
    port: mongoose.connection.port
  };

  if (isConnected) {
    res.json(withServiceInfo({
      status: "success",
      message: "MongoDB connection is healthy",
      database: dbInfo
    }));
  } else {
    res.status(500).json(withServiceInfo({
      status: "fail",
      message: "MongoDB is not connected",
      database: dbInfo
    }));
  }
});

router.get("/pingRedis", async (req, res) => {
  try {
    const redisInfo = {
      status: "connected",
      version: await redisClient.info('server'),
      memory: await redisClient.info('memory'),
      clients: await redisClient.info('clients')
    };

    res.json(withServiceInfo({
      status: "success",
      message: "Redis is working",
      redis: redisInfo
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
      frontend: {
        url: FRONTEND_URL,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        preview: html.slice(0, 100)
      }
    }));
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json(withServiceInfo({
      status: "fail",
      message: "Cannot reach frontend",
      error: err.message
    }));
  }
});

// Get container info without using docker CLI
const getContainerInfo = () => {
  try {
    const hostname = os.hostname();
    const networkInfo = getNetworkInfo();
    const eth0 = networkInfo.find(iface => iface.interface === 'eth0');

    return {
      isDocker: true,
      containerId: hostname,
      containerName: process.env.HOSTNAME || hostname,
      network: {
        name: 'rakeshNetwork',
        ip: eth0?.address,
        gateway: eth0?.netmask,
        mac: eth0?.mac
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        HOST: process.env.HOST,
        PORT: process.env.PORT
      }
    };
  } catch (err) {
    return {
      isDocker: false,
      error: err.message
    };
  }
};

// Update getDockerInfo function
const getDockerInfo = async () => {
  try {
    const containerInfo = getContainerInfo();
    const networkInfo = getNetworkInfo();

    return {
      ...containerInfo,
      network: networkInfo,
      containers: [
        {
          id: containerInfo.containerId,
          name: containerInfo.containerName,
          ip: containerInfo.network.ip,
          network: 'rakeshNetwork'
        }
      ],
      exposedPorts: [
        {
          container: '8080/tcp',
          host: '8080',
          protocol: 'tcp'
        }
      ],
      volumes: [
        {
          source: '/app',
          destination: '/app',
          type: 'bind',
          readOnly: false
        }
      ]
    };
  } catch (err) {
    return {
      isDocker: false,
      error: err.message
    };
  }
};

// Get service health with detailed network info
const getServiceHealth = async () => {
  const dockerInfo = await getDockerInfo();
  const networkInfo = getNetworkInfo();

  const serviceInfo = {
    name: "server",
    environment: process.env.NODE_ENV || "development",
    host: process.env.HOST || os.hostname(),
    port: process.env.PORT || 8080,
    docker: dockerInfo,
    network: networkInfo,
    platform: {
      os: os.platform(),
      arch: os.arch(),
      release: os.release(),
      type: os.type()
    }
  };

  // Test MongoDB connection
  const mongoStatus = mongoose.connection.readyState === 1;
  const mongoInfo = {
    status: mongoStatus ? "OK" : "ERROR",
    details: {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      database: mongoose.connection.name,
      readyState: mongoose.connection.readyState,
      connectionString: mongoose.connection.client?.s?.url || 'Not available'
    }
  };

  // Test Redis connection
  let redisStatus = "ERROR";
  let redisInfo = {};
  try {
    await redisClient.ping();
    redisStatus = "OK";
    redisInfo = {
      host: redisClient.options?.host,
      port: redisClient.options?.port,
      status: await redisClient.info('server'),
      memory: await redisClient.info('memory'),
      clients: await redisClient.info('clients')
    };
  } catch (err) {
    redisInfo = { error: err.message };
  }

  // Test frontend connection
  let frontendStatus = "ERROR";
  let frontendInfo = {};
  try {
    const response = await fetch('http://client:3000');
    frontendStatus = response.ok ? "OK" : "ERROR";
    frontendInfo = {
      url: 'http://client:3000',
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (err) {
    frontendInfo = { error: err.message };
  }

  return {
    timestamp: new Date().toISOString(),
    service: serviceInfo,
    results: {
      server: {
        status: "OK",
        service: { ...serviceInfo, name: "server" }
      },
      mongo: {
        status: mongoStatus ? "OK" : "ERROR",
        service: { ...serviceInfo, name: "mongo" },
        details: mongoInfo
      },
      redis: {
        status: redisStatus,
        service: { ...serviceInfo, name: "redis" },
        details: redisInfo
      },
      frontend: {
        status: frontendStatus,
        service: { ...serviceInfo, name: "frontend" },
        details: frontendInfo
      }
    },
    network: {
      containers: dockerInfo.containers || [],
      exposedPorts: dockerInfo.exposedPorts || [],
      volumes: dockerInfo.volumes || []
    }
  };
};

// Routes
router.get("/pingAll", async (req, res) => {
  try {
    const healthInfo = await getServiceHealth();
    res.json(healthInfo);
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.get("/network", async (req, res) => {
  try {
    const dockerInfo = await getDockerInfo();
    res.json({
      docker: dockerInfo,
      network: getNetworkInfo(),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.get("/containers", async (req, res) => {
  try {
    const dockerInfo = await getDockerInfo();
    res.json({
      containers: dockerInfo.containers || [],
      volumes: dockerInfo.volumes || [],
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Add a new endpoint that returns detailed service information
router.get("/serviceInfo", (req, res) => {
  res.json({
    service: getServiceInfo(),
    timestamp: new Date().toISOString()
  });
});

// Add a new endpoint for connection information
router.get("/connectionInfo", (req, res) => {
  res.json({
    service: getServiceInfo(),
    connectionInfo: getConnectionInfo(),
    timestamp: new Date().toISOString()
  });
});

export default router;