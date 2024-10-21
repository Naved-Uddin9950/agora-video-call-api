const express = require("express");
const cors = require("cors");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(cors({ origin: '*' })); 
app.use(express.json());

// Agora App details (replace with your actual Agora App ID and certificate)
const APP_ID = "243bf9f7323a48ab95f84739505a921f";
const APP_CERTIFICATE = "37e093701c62471bb3b446302ec158e3";

// Route to generate an Agora token
app.post("/token", (req, res) => {
  const { channelName, uid } = req.body;

  if (!channelName || uid == null) {
    return res.status(400).json({ error: "Channel name and UID are required" });
  }

  // Define user role: either publisher or subscriber
  let userRole = RtcRole.PUBLISHER;

  // Token expiration (default: 1 hour)
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  // Generate the Agora token
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    userRole,
    privilegeExpiredTs
  );

  // Respond with the token
  return res.json({ token });
});

// Home route
app.get("/", (req, res) => {
  res.send("Hello CodeSandbox!");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Sandbox listening on port ${port}`);
});