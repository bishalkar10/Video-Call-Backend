const express = require("express");
const { AccessToken } = require("livekit-server-sdk");
const cors = require("cors");

const app = express();
const port = 3001;

const API_KEY = "devkey";
const API_SECRET = "secret";

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.post("/generate-token", async (req, res) => {
  const { roomName, participantName } = req.body;

  if (!roomName || !participantName) {
    return res
      .status(400)
      .json({ error: "Room name and participant name are required." });
  }

  try {
    const at = new AccessToken(API_KEY, API_SECRET, {
      identity: participantName,
    });

    const videoGrant = {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    };

    at.addGrant(videoGrant);

    const token = await at.toJwt();
    console.log("Generated token:", token);
    res.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Failed to generate token." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
