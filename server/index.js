require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');

// Database connection
const connectDB = require('./db/connect');

// Authentication middleware
const autheticateUser = require('./middleware/authentication');

// Routers
const mainRouter = require('./routes/main');
const profileRouter = require('./routes/userProfile');
const notificationsRoute = require('./routes/notification');
const chatRequestRoutes = require('./routes/chatRequest');
const chatRoutes = require('./routes/chatService');
const messageRoute = require('./routes/messageRoute');
const taskListRelatedRoute = require('./routes/tasklistRoutes');
const QuestionAndAnswerRoute = require('./routes/Q&ARoute');

// Error handlers
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// Matching algorithm route
const matchingRoute = require('./routes/matchingAlgorithm');
const { log } = require('async');

// // CORS Configuration
// const corsOptions = {
//   origin: ['http://localhost:3000', 'https://skillswap-deployed-git-main-kanav31s-projects.vercel.app/'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   exposedHeaders: ['Content-Type', 'Authorization']
// };

// app.use(cors(corsOptions));

// Middleware
app.use(express.static('./public'));
app.use(express.json({ limit: '50mb' }));
// app.get("/", (req, res) => res.send("Express on Vercel"));
// Routes
app.use('/api/v1/auth', mainRouter);
app.use('/api/v1/profile', autheticateUser, profileRouter);
app.use('/api/v1/matching', autheticateUser, matchingRoute);
app.use('/api/v1/send', autheticateUser, notificationsRoute);
app.use('/api/v1/chat-request', autheticateUser, chatRequestRoutes);
app.use('/api/v1/chat', autheticateUser, chatRoutes);
app.use('/api/v1/message', autheticateUser, messageRoute);
app.use('/api/v1/tasklist-related', autheticateUser, taskListRelatedRoute);
app.use('/api/v1/Q&A', QuestionAndAnswerRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;

const server = app.listen(port, () =>
  console.log(`Server is listening on port ${port}...`)
);

const prodOrigins = [process.env.ORIGIN_1, process.env.ORIGIN_2]
const devOrigin = ['http://localhost:3000',]
const allowedOrigins = process.env.NODE_ENV === 'production' ? prodOrigins : devOrigin
const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: (origin, callback) => {
      console.log("hiii");

      const allowedOrigins = [...prodOrigins, ...devOrigin];
      if (allowedOrigins.includes(origin)) {
        console.log(origin, allowedOrigins);
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

io.on('connection', (socket) => {
  console.log('Connected to socket.io');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User Joined Room: ' + room);
  });

  socket.on('new message', (newMessageReceived) => {
    console.log('Message received');
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit('message received', newMessageReceived);
    });
  });
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
  } catch (error) {
    console.log(error);
  }
};

start();
