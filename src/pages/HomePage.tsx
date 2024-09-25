import { useUser } from '../context/AuthContext';
import { auth } from '../firebase/firebase';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import List from '@/components/List';
import { useState } from 'react';
import CtaButton from '@/components/CtaButton';
import CreateShoppingList from '@/components/AddShoppingListButton';

const HomePage = () => {
  const { user } = useUser();
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="flex flex-col h-screen">
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
        <main className="flex-1 overflow-auto">
          {/* <CreateShoppingList /> */}
          <List />
        </main>
      )}
    </div>
  );
};

export default HomePage;
