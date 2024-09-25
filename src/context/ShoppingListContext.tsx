// src/context/ShoppingListContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import {
  getShoppingListsForCurrentUser,
  getItemsForShoppingList,
  subscribeToItemsForList,
} from '../utils/FirebaseFunctions';
import { useUser } from './AuthContext';

// Create the context
const ShoppingListContext = createContext<{
  shoppingLists: any[];
  setShoppingLists: (lists: any[]) => void;
  selectedShoppingList: any;
  setSelectedShoppingList: (list: any) => void;
  loading: boolean;
  items: any[];
}>({
  shoppingLists: [],
  setShoppingLists: () => {},
  selectedShoppingList: null,
  setSelectedShoppingList: () => {},
  loading: true,
  items: [],
});

type Props = { children: React.ReactNode };
// Create a provider component
export const ShoppingListProvider = ({ children }: Props) => {
  const [shoppingLists, setShoppingLists] = useState<{ id: string }[]>([]);
  const [selectedShoppingList, setSelectedShoppingList] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  const { user } = useUser();

  useEffect(() => {
    console.log('useEffect in ShoppingListProvider');
    const fetchLists = async () => {
      try {
        const lists = await getShoppingListsForCurrentUser();
        setShoppingLists(lists);
        if (lists.length > 0) {
          setSelectedShoppingList(lists[0]);
        }
      } catch (error) {
        console.error('Error fetching shopping lists:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchLists();
    }
  }, [user]);

  useEffect(() => {
    if (!selectedShoppingList) {
      return;
    }

    setLoading(true);

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
