// src/context/ShoppingListContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import {
  getShoppingListsForCurrentUser,
  subscribeToItemsForList,
  fetchUserSharedLists,
  createShoppingList,
} from '../utils/FirebaseFunctions';
import { useUser } from './AuthContext';

import { Item, ShoppingList } from '@/lib/types';

// Create the context
const ShoppingListContext = createContext<{
  shoppingLists: ShoppingList[];
  setShoppingLists: (lists: ShoppingList[]) => void;
  sharedShoppingLists: ShoppingList[];
  selectedShoppingList: ShoppingList | null;
  setSelectedShoppingList: (list: ShoppingList) => void;
  loading: boolean;
  items: Item[];
}>({
  shoppingLists: [],
  setShoppingLists: () => {},
  sharedShoppingLists: [],
  selectedShoppingList: null,
  setSelectedShoppingList: () => {},
  loading: true,
  items: [],
});

type Props = { children: React.ReactNode };
// Create a provider component
export const ShoppingListProvider = ({ children }: Props) => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [sharedShoppingLists, setSharedShoppingLists] = useState<
    ShoppingList[]
  >([]);
  const [selectedShoppingList, setSelectedShoppingList] =
    useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);

  const { user } = useUser();

  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      try {
        const lists = await getShoppingListsForCurrentUser();
        setShoppingLists(lists);

        const sharedLists = await fetchUserSharedLists();
        setSharedShoppingLists(sharedLists);

        if (lists.length > 0) {
          setSelectedShoppingList(lists[0]);
        } else if (sharedLists.length > 0) {
          setSelectedShoppingList(sharedLists[0]);
        }
      } catch (error) {
        console.error('Error fetching shopping lists:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchLists();
    } else {
      setShoppingLists([]);
      setSelectedShoppingList(null);
      setItems([]);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!selectedShoppingList) {
      return;
    }

    setLoading(true);

    // fetch shopping lists in case a new list was created
    const fetchLists = async () => {
      try {
        const lists = await getShoppingListsForCurrentUser();
        setShoppingLists(lists);
      } catch (error) {
        console.error('Error fetching shopping lists:', error);
      }
    };

    fetchLists();

    const unsubscribe = subscribeToItemsForList(
      selectedShoppingList.id,
      (items) => {
        setItems(items);
        setLoading(false);
      }
    );

    // Clean up the subscription
    return () => unsubscribe();
  }, [selectedShoppingList]);

  return (
    <ShoppingListContext.Provider
      value={{
        shoppingLists,
        setShoppingLists,
        sharedShoppingLists,
        selectedShoppingList,
        setSelectedShoppingList,
        items,
        loading,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

// Custom hook to use the ShoppingListContext
export const useShoppingList = () => {
  return useContext(ShoppingListContext);
};
