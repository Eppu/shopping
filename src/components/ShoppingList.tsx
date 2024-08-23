import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface Item {
  id: string;
  name: string;
  purchased: boolean;
}

const ShoppingList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to the WebSocket server
    const socketConnection = io('http://localhost:3000'); // Update the URL to match your backend
    console.log('Connected to WebSocket server');
    setSocket(socketConnection);

    // Listen for 'item-added' events
    socketConnection.on('item-added', (item: Item) => {
      setItems((prevItems) => [...prevItems, item]);
    });

    // Listen for 'item-purchased' events
    socketConnection.on('item-purchased', (itemId: string) => {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, purchased: true } : item
        )
      );
    });

    // Clean up the connection when the component unmounts
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const handleAddItem = () => {
    if (socket && newItem) {
      const item: Item = {
        id: Date.now().toString(),
        name: newItem,
        purchased: false,
      };
      socket.emit('add-item', item);
      setNewItem('');
    }
  };

  const handleMarkPurchased = (itemId: string) => {
    if (socket) {
      socket.emit('mark-purchased', itemId);
    }
  };

  return (
    <div>
      <h1>Shopping List</h1>
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Add new item"
      />
      <button onClick={handleAddItem}>Add Item</button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} {item.purchased ? '✅' : ''}
            {!item.purchased && (
              <button onClick={() => handleMarkPurchased(item.id)}>
                Mark as Purchased
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;
