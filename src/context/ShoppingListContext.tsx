import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getShoppingListsForCurrentUser,
  subscribeToItemsForList,
  fetchUserSharedLists,
  deleteShoppingList,
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
  setSelectedShoppingList: (list: ShoppingList | null) => void;
  setSelectedShoppingListById: (id: string) => void;
  createNewShoppingList: (listName: string) => void;
  removeShoppingListById: (id: string) => void;
  loading: boolean;
  items: Item[];
}>({
  shoppingLists: [],
  setShoppingLists: () => {},
  sharedShoppingLists: [],
  selectedShoppingList: null,
  setSelectedShoppingList: () => {},
  setSelectedShoppingListById: () => {},
  createNewShoppingList: () => {},
  removeShoppingListById: () => {},
  loading: true,
  items: [],
});

type Props = { children: React.ReactNode };

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
  const navigate = useNavigate();
  const { listId } = useParams(); // Get the list ID from the URL

  // Function to set selected shopping list by ID
  const setSelectedShoppingListById = (id: string) => {
    const list =
      shoppingLists.find((list) => list.id === id) ||
      sharedShoppingLists.find((list) => list.id === id);

    if (list) {
      setLoading(true);
      setSelectedShoppingList(list);
      navigate(`/${list.id}`, { replace: true });
      setLoading(false);
    } else {
      console.error('Could not find list with id:', id);
    }
  };

  // Function to remove a shopping list by ID
  const removeShoppingListById = async (id: string) => {
    try {
      // Delete the list from the backend
      await deleteShoppingList(id);

      // Update the state by removing the list
      const updatedShoppingLists = shoppingLists.filter(
        (list) => list.id !== id
      );
      const updatedSharedLists = sharedShoppingLists.filter(
        (list) => list.id !== id
      );

      setShoppingLists(updatedShoppingLists);
      setSharedShoppingLists(updatedSharedLists);

      // If the deleted list was selected, choose another list
      if (selectedShoppingList?.id === id) {
        const fallbackList =
          updatedShoppingLists[0] || updatedSharedLists[0] || null;

        setSelectedShoppingList(fallbackList);

        if (fallbackList) {
          navigate(`/${fallbackList.id}`, { replace: true });
        } else {
          // No more lists available, navigate to a default page (e.g., home)
          navigate(`/`, { replace: true });
        }
      }
    } catch (error) {
      console.error('Error deleting shopping list:', error);
    }
  };

  const createNewShoppingList = async (listName: string) => {
    setLoading(true);
    try {
      // create a new shopping list and set it as the selected list
      const newList = await createShoppingList(listName);
      setSelectedShoppingList(newList);
      setShoppingLists([...shoppingLists, newList]);
      navigate(`/${newList.id}`, { replace: true });
    } catch (error) {
      console.error('Error creating shopping list:', error);
    }
    setLoading(false);
  };

  // Fetch shopping lists on mount or when the user changes
  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      try {
        const lists = await getShoppingListsForCurrentUser();
        const sharedLists = await fetchUserSharedLists();

        setShoppingLists(lists);
        setSharedShoppingLists(sharedLists);

        // If the user lands on a listId URL, check if the list exists
        if (listId) {
          const list =
            lists.find((list) => list.id === listId) ||
            sharedLists.find((list) => list.id === listId);

          // If list exists, select it, otherwise fallback to the first available list
          if (list) {
            setSelectedShoppingList(list);
          } else {
            console.error(`List with ID ${listId} not found or not accessible`);
            // Fallback to the first available list
            const fallbackList = lists[0] || sharedLists[0];
            if (fallbackList) {
              setSelectedShoppingList(fallbackList);
              navigate(`/${fallbackList.id}`, { replace: true });
            }
          }
        } else if (
          !selectedShoppingList &&
          (lists.length > 0 || sharedLists.length > 0)
        ) {
          // If no listId in URL, set the first available list as the default
          const firstAvailableList = lists[0] || sharedLists[0];
          if (firstAvailableList) {
            setSelectedShoppingList(firstAvailableList);
            navigate(`/${firstAvailableList.id}`, { replace: true });
          }
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
      // Clear state when user logs out
      setShoppingLists([]);
      setSharedShoppingLists([]);
      setSelectedShoppingList(null);
      setItems([]);
      setLoading(false);
    }
  }, [user, listId]); // Added listId here to handle direct URL entry

  // Fetch items for the selected shopping list
  useEffect(() => {
    if (!selectedShoppingList) return;

    const unsubscribe = subscribeToItemsForList(
      selectedShoppingList.id,
      (fetchedItems) => {
        setItems(fetchedItems);
        setLoading(false);
      }
    );

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
        setSelectedShoppingListById,
        removeShoppingListById,
        createNewShoppingList,
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
