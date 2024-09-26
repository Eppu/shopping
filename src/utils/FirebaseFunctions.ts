import {
  collection,
  addDoc,
  serverTimestamp,
  arrayUnion,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { firestore, auth } from '../firebase/firebase';

export async function createShoppingList(name: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const listRef = await addDoc(collection(firestore, 'shoppingLists'), {
    name,
    ownerId: user.uid,
    createdAt: serverTimestamp(),
    sharedWith: [],
    permissions: {
      [user.uid]: 'edit',
    },
  });

  return listRef.id;
}

export async function addItemToList(
  listId: string,
  itemName: string,
  quantity = 1
) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const itemsRef = collection(firestore, 'shoppingLists', listId, 'items');

  await addDoc(itemsRef, {
    name: itemName,
    quantity,
    purchased: false,
    addedBy: user.uid,
    createdAt: serverTimestamp(),
  });
}

export async function deleteItemFromList(listId: string, itemId: string) {
  const itemRef = doc(firestore, 'shoppingLists', listId, 'items', itemId);

  console.log('got item ref', itemRef);

  await deleteDoc(itemRef);
}

export async function shareShoppingList(
  listId: string,
  userId: string,
  permission: unknown
) {
  const listRef = doc(firestore, 'shoppingLists', listId);

  await updateDoc(listRef, {
    sharedWith: arrayUnion(userId),
    [`permissions.${userId}`]: permission,
  });
}

export async function getShoppingListsForCurrentUser() {
  // Gets the shopping lists for the current user. The user must be authenticated.
  // The user can either be the owner of the list or have been shared the list.
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const listsRef = collection(firestore, 'shoppingLists');
  const querySnapshot = await getDocs(
    query(listsRef, where('ownerId', '==', user.uid))
  );

  const lists = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  //   const lists = await Promise.all(
  //     querySnapshot.docs.map(async (doc) => {
  //       const listData = { id: doc.id, ...doc.data() };

  //       // Fetch items for each shopping list
  //       const itemsRef = collection(firestore, 'shoppingLists', doc.id, 'items');
  //       const itemsSnapshot = await getDocs(itemsRef);
  //       const items = itemsSnapshot.docs.map((itemDoc) => ({
  //         id: itemDoc.id,
  //         ...itemDoc.data(),
  //       }));

  //       return { ...listData, items };
  //     })
  //   );

  //   return lists;
  // }

  return lists;
}

export async function getItemsForShoppingList(listId: string) {
  const itemsRef = collection(firestore, 'shoppingLists', listId, 'items');
  const querySnapshot = await getDocs(itemsRef);

  const items = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return items;
}

// src/firebaseFunctions.js

// Function to listen for real-time updates on items for a specific list
export function subscribeToItemsForList(
  listId: string,
  callback: (items: any[]) => void
) {
  const itemsRef = collection(firestore, 'shoppingLists', listId, 'items');

  return onSnapshot(itemsRef, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(items); // Pass the updated items to the callback function
  });
}

// Function to mark an item as purchased
export async function setItemPurchasedStatus(
  listId: string,
  itemId: string,
  purchased: boolean = true
) {
  const itemRef = doc(firestore, 'shoppingLists', listId, 'items', itemId);

  try {
    await updateDoc(itemRef, {
      purchased: purchased, // Toggle the purchased status
    });
  } catch (error) {
    console.error('Error updating item: ', error);
  }
}

export async function removeAllItemsFromList(listId: string) {
  const itemsRef = collection(firestore, 'shoppingLists', listId, 'items');
  const querySnapshot = await getDocs(itemsRef);

  querySnapshot.docs.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
}
