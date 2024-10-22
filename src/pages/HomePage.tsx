import { useUser } from '../context/AuthContext';
import { auth } from '../firebase/firebase';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import List from '@/components/List';
import { useState, useEffect } from 'react';
import { useShoppingList } from '@/context/ShoppingListContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Helmet } from 'react-helmet';

const HomePage = () => {
  const { user } = useUser();
  const [isSignIn, setIsSignIn] = useState(true);
  const {
    selectedShoppingList,
    shoppingLists,
    // sharedShoppingLists,
    setSelectedShoppingListById,
  } = useShoppingList();
  const { listId } = useParams();
  const navigate = useNavigate();

  // This is giga messy but it works for now. It's almost 2am and I couldn't be bothered to refactor it.
  // I will refactor it later. I promise.

  // This useEffect runs when listId or shoppingLists change
  // useEffect(() => {
  //   if (!shoppingLists.length) {
  //     return; // Exit if shopping lists haven't been loaded yet
  //   }

  //   // Handle the case where no listId is present in the URL
  //   if (!listId) {
  //     if (selectedShoppingList) {
  //       // Redirect to the selectedShoppingList's ID
  //       navigate(`/${selectedShoppingList.id}`, { replace: true });
  //     } else {
  //       console.log('hit else like a mofo');
  //       // Default to the first list if no list is selected
  //       const defaultList = shoppingLists[0];
  //       setSelectedShoppingListById(defaultList.id);
  //       // navigate(`/${defaultList.id}`, { replace: true });
  //     }
  //   } else {
  //     // If there's a listId, find the matching list

  //     // If the list exists and isn't already selected, select it
  //     if (!selectedShoppingList || selectedShoppingList.id !== listId) {
  //       setSelectedShoppingListById(listId);
  //     }
  //   }
  // }, [
  //   listId,
  //   shoppingLists,
  //   selectedShoppingList,
  //   navigate,
  //   setSelectedShoppingListById,
  // ]);

  return (
    <>
      <Helmet>
        <title>
          {selectedShoppingList ? selectedShoppingList.name : 'Ostis'}
        </title>
        <meta name="description" content="Home Page" />
      </Helmet>

      <div className="flex flex-col h-screen">
        <Toaster
          closeButton
          richColors
          position="bottom-center"
          expand
          visibleToasts={9}
        />

        <header className="p-4 bg-gray-800 text-white flex justify-between">
          <a href="/" className="flex gap-1 items-center">
            <div className="flex gap-1 items-center">
              <img src="/logo.svg" alt="logo" className="h-6" />
              <h1 className="text-xl font-poppinsMedium">ostis</h1>
            </div>
          </a>

          {/* Header */}
          {user ? (
            <button onClick={() => auth.signOut()}>Sign Out</button>
          ) : (
            <>
              <button
                onClick={() => setIsSignIn((prev) => !prev)}
                className="mb-4"
              >
                {isSignIn ? 'Sign Up' : 'Sign In'}
              </button>
              {isSignIn ? <SignIn /> : <SignUp />}
            </>
          )}
        </header>

        {user && (
          <main className="flex-1 overflow-auto w-full lg:max-w-4xl lg:mx-auto">
            {/* Pass handleListSelection to the List component to handle list selection */}
            {/* <List onListSelect={handleListSelection} /> */}
            <List />
          </main>
        )}
      </div>
    </>
  );
};

export default HomePage;
