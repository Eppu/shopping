import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';

require('dotenv').config();
const PORT = process.env.PORT || 3000;

const app = express();

// Create HTTP server
const httpServer = createServer(app);

console.log('created http server', httpServer);

const expressServer = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Set up middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);

// Initialize Socket.IO server
const io = new Server(expressServer, {
  cors: {
    origin: '*', // Update this with your frontend's origin if needed
    methods: ['GET', 'POST'],
  },
});

// WebSocket connection event
io.on('connection', (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle adding a new item to the shopping list
  socket.on('add-item', (item: string) => {
    console.log(`Item added: ${JSON.stringify(item)}`);
    // Broadcast the new item to all connected clients
    io.emit('item-added', item);
  });

  // Handle marking an item as purchased
  socket.on('mark-purchased', (itemId: string) => {
    console.log(`Item purchased: ${itemId}`);
    // Broadcast the updated item to all connected clients
    io.emit('item-purchased', itemId);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
