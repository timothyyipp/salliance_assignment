// Import Dependencies
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const session = require('express-session');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const axios = require("axios");
dotenv.config();

// Initialize Express App, HTTP Server and Socket.IO
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*' },
  methods: ['GET', 'POST']
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'));

// Import Models
const User = require('./models/User');
const Message = require('./models/message');

/**
 * @function generates a LinkedIn OAuth 2.0 authorization URL using environment variables.
 * @returns {string} The encoded LinkedIn OAuth 2.0 authorization URL.
 */
const auth=() => {
  return encodeURI(`https://linkedin.com/oauth/v2/authorization?client_id=${process.env.LINKEDIN_CLIENT_ID}&response_type=code&scope=${process.env.SCOPE}&redirect_uri=${process.env.REDIRECT_URI}`); 
}

/**
 * @route GET /auth/linkedin
 * @desc Redirect to LinkedIn OAuth login
 */
app.get("/auth/linkedin", (req, res) => {
  return res.redirect(auth());
});

/**
 * @route GET /auth/linkedin/callback
 * @desc Handle LinkedIn OAuth callback and retrieve user info
 */
app.get("/auth/linkedin/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ error: "Missing code from LinkedIn callback" });
  }

  try {
    const tokenResponse = await axios.post(
      `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&client_id=${process.env.LINKEDIN_CLIENT_ID}&client_secret=${process.env.LINKEDIN_CLIENT_SECRET}&redirect_uri=${process.env.REDIRECT_URI}`
    );

    const accessToken = tokenResponse.data.access_token;
    console.log("Access Token: ", accessToken);

    // Get basic profile info (e.g. name, email, etc.)
    const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = profileResponse.data;

    // Check if user exists in DB, if not, create
    let user = await User.findOne({ linkedinId: userData.sub });
    if (!user) {
      user = new User({
        linkedinId: userData.sub,
        name: userData.name,
        email: userData.email,
      });
      await user.save();
    }

    // Create JWT payload
    const payload = {
      id: user.linkedinId,
      name: user.name,
      email: user.email,
    };

    // Sign JWT
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      token: jwtToken,
      user: payload,
    });

  } catch (error) {
    console.error("LinkedIn token error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to get user info" });
  }
});

/**
 * Middleware: Authenticate JWT token from Authorization header
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
      res.status(401).json({ error: 'No token provided' });
  }
};

// Socket.IO: Handle real-time communication
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  /**
   * @event send_message
   * @desc Receive a new message from a client and store in DB
   */
  socket.on('send_message', async ({ senderId, receiverId, content }) => {
    const message = new Message({ senderId, receiverId, content });
    await message.save();
    // Emit 'receive_message' here for real-time updates
    io.to(receiverId).emit('receiveMessage', {
      senderId,
      receiverId,
      content,
      timestamp: newMessage.timestamp,
    });
    // Emit to sender as well for confirmation
    socket.emit('messageSent', {
      senderId,
      receiverId,
      content,
      timestamp: newMessage.timestamp,
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

/**
 * @route POST /messages
 * @desc Send a message from authenticated user to another user
 * @access Private
 */
app.post('/messages', authenticateToken, async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user.id;

  if (!receiverId || !content) {
    return res.status(400).json({ error: 'Missing receiverId or content' });
  }

  try {
    const message = new Message({ senderId, receiverId, content });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

/**
 * @route GET /messages/:userId
 * @desc Get chat history between authenticated user and another user
 * @access Private
 */
app.get('/messages/:userId', authenticateToken, async (req, res) => {
  const userId = req.params.userId;
  const currentUserId = req.user.id;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ]
    }).sort({ timestamp: 1 }); // ascending order (oldest to newest)

    res.json(messages);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
});

// Start Server
server.listen(process.env.PORT, () => console.log('Server running'));
