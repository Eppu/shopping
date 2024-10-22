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
