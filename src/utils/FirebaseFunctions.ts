import {
  collection,
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { firestore, auth } from "../firebase/firebase";

import {
  PermissionTypes,
  ShoppingList,
  ShoppingLists,
  Items,
} from "@/lib/types";

import * as EmailValidator from "email-validator";

export async function createShoppingList(name: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const listRef = await addDoc(collection(firestore, "shoppingLists"), {
    name,
    ownerId: user.uid,
    createdAt: serverTimestamp(),
    sharedWith: [],
    permissions: {
      [user.uid]: PermissionTypes.Edit,
    },
  });

  const newList: ShoppingList = {
    id: listRef.id,
    name,
    ownerId: user.uid,
    createdAt: serverTimestamp(),
    sharedWith: [],
    permissions: {
      [user.uid]: PermissionTypes.Edit,
    },
  };

  return newList;
}

export async function deleteShoppingList(listId: string) {
  const listRef = doc(firestore, "shoppingLists", listId);

  await deleteDoc(listRef);
}

export async function addItemToList(
  listId: string,
  itemName: string,
  quantity = 1
) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  if (!itemName || itemName.trim() === "") {
    throw new Error("Item name cannot be empty");
  }

  const itemsRef = collection(firestore, "shoppingLists", listId, "items");

  await addDoc(itemsRef, {
    name: itemName,
    quantity,
    purchased: false,
    addedBy: user.uid,
    createdAt: serverTimestamp(),
  });
}

export async function deleteItemFromList(listId: string, itemId: string) {
  const itemRef = doc(firestore, "shoppingLists", listId, "items", itemId);

  console.log("got item ref", itemRef);

  await deleteDoc(itemRef);
}

export async function shareShoppingList(
  listId: string,
  userId: string,
  permission: unknown
) {
  const listRef = doc(firestore, "shoppingLists", listId);

  await updateDoc(listRef, {
    sharedWith: arrayUnion(userId),
    [`permissions.${userId}`]: permission,
  });
}

export async function getShoppingListsForCurrentUser() {
  // Gets the shopping lists for the current user. The user must be authenticated.
  // The user can either be the owner of the list or have been shared the list.
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const listsRef = collection(firestore, "shoppingLists");
  const querySnapshot = await getDocs(
    query(listsRef, where("ownerId", "==", user.uid))
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

  return lists as ShoppingLists;
}

export async function getItemsForShoppingList(listId: string) {
  const itemsRef = collection(firestore, "shoppingLists", listId, "items");
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
  callback: (items: Items) => void
) {
  const itemsRef = collection(firestore, "shoppingLists", listId, "items");

  return onSnapshot(itemsRef, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(items as Items); // Pass the updated items to the callback function
  });
}

// Function to mark an item as purchased
export async function setItemPurchasedStatus(
  listId: string,
  itemId: string,
  purchased: boolean = true
) {
  const itemRef = doc(firestore, "shoppingLists", listId, "items", itemId);

  try {
    await updateDoc(itemRef, {
      purchased: purchased, // Toggle the purchased status
    });
  } catch (error) {
    console.error("Error updating item: ", error);
  }
}

export async function removeAllItemsFromList(listId: string) {
  const itemsRef = collection(firestore, "shoppingLists", listId, "items");
  const querySnapshot = await getDocs(itemsRef);

  querySnapshot.docs.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
}

export async function removeSelectedItemsFromList(listId: string) {
  const itemsRef = collection(firestore, "shoppingLists", listId, "items");
  const querySnapshot = await getDocs(itemsRef);

  querySnapshot.docs.forEach(async (doc) => {
    const itemData = doc.data();
    if (itemData.purchased) {
      await deleteDoc(doc.ref);
    }
  });
}

// Adds a user to the sharedWith array based on their email
// Ideally we'd do this based on the user's ID, but for simplicity we're using email here
// I might change this later
export async function addUserToShoppingList(listId: string, email: string) {
  if (!EmailValidator.validate(email)) {
    throw new Error("Invalid email address");
  }
  console.log("adding user to list", email);

  const listRef = doc(firestore, "shoppingLists", listId);

  await updateDoc(listRef, {
    sharedWith: arrayUnion(email),
  });
}

export async function removeUserFromShoppingList(
  listId: string,
  email: string
) {
  const listRef = doc(firestore, "shoppingLists", listId);

  await updateDoc(listRef, {
    sharedWith: arrayRemove(email),
  });
}

export async function fetchUserSharedLists() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const listsRef = collection(firestore, "shoppingLists");
  const querySnapshot = await getDocs(
    query(listsRef, where("sharedWith", "array-contains", user.email))
  );

  const lists = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return lists as ShoppingLists;
}

export function onSharedUsersChange(
  listId: string,
  callback: (sharedWith: string[]) => void
) {
  const listRef = doc(firestore, "shoppingLists", listId);

  return onSnapshot(listRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const listData = docSnapshot.data();
      callback(listData.sharedWith || []);
    } else {
      callback([]);
    }
  });
}
