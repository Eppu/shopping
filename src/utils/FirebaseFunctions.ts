import {
  collection,
  addDoc,
  serverTimestamp,
  arrayUnion,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
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

  return lists;
}
