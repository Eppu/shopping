// src/components/CreateShoppingList.js
import React, { useState } from 'react';
// import { firestore, auth } from '../firebase/firebase';
import { createShoppingList } from '@/utils/FirebaseFunctions';

const CreateShoppingList = () => {
  const [listName, setListName] = useState('');

  const handleCreateList = async () => {
    try {
      const listId = await createShoppingList(listName);
      alert(`Shopping list created with ID: ${listId}`);
      setListName(''); // Clear the input after creating the list
    } catch (error) {
      console.error('Error creating shopping list:', error);
      alert(error);
    }
  };

  return (
    <div>
      <h2>Create a New Shopping List</h2>
      <input
        type="text"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        placeholder="List Name"
      />
      <button onClick={handleCreateList}>Create List</button>
    </div>
  );
};

export default CreateShoppingList;
