import { useUser } from '../context/AuthContext';
import { auth } from '../firebase/firebase';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import List from '@/components/List';
import { useState, useEffect } from 'react';
import { useShoppingList } from '@/context/ShoppingListContext';
import { useParams } from 'react-router-dom';

import { Toaster } from '@/components/ui/sonner';

import { Helmet } from 'react-helmet';

const HomePage = () => {
  const { user } = useUser();
  const [isSignIn, setIsSignIn] = useState(true);
  const { selectedShoppingList, shoppingLists, setSelectedShoppingList } =
    useShoppingList();
  const { listId } = useParams();

  // When the user enters the page, check if the listId is in the shoppingLists. If it is, and the currently selected list is not already selected, set it as the selected list
  // This is kind of messy but it works for now. I should probably refactor this.
  useEffect(() => {
    // if there is no listId, but there is a selectedShoppingList, set the listId to the selectedShoppingList id
    if (!listId && selectedShoppingList) {
      window.history.pushState(null, '', `/${selectedShoppingList.id}`);
    }

    if (listId && shoppingLists.length > 0) {
      const list = shoppingLists.find((list) => list.id === listId);
      if (list && !selectedShoppingList) {
        setSelectedShoppingList(list);
      }
    }
  }, [listId, shoppingLists, selectedShoppingList, setSelectedShoppingList]);

  return (
    <>
      <Helmet>
        <title>
          {/* TODO: Explore shogiwn count of items here. Could be nice for mobile tab use. */}
          {selectedShoppingList ? selectedShoppingList.name : 'Ostoslistat'}
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
              <img src="/logo.svg" alt="logo" className="h-10" />
              <h1 className="text-2xl font-poppinsMedium">ostis</h1>
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
            {/* <CreateShoppingList /> */}
            <List />
          </main>
        )}
      </div>
    </>
  );
};

export default HomePage;
