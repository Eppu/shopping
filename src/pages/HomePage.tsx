import { useUser } from '../context/AuthContext';
import { auth } from '../firebase/firebase';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import List from '@/components/List';
import { useState } from 'react';
import { useShoppingList } from '@/context/ShoppingListContext';

import { Toaster } from '@/components/ui/sonner';

import { Helmet } from 'react-helmet';

const HomePage = () => {
  const { user } = useUser();
  const [isSignIn, setIsSignIn] = useState(true);
  const { selectedShoppingList } = useShoppingList();

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
          Header
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
