import { useUser } from '../context/AuthContext';
import { auth } from '../firebase/firebase';
import { SignIn } from '@/components/SignIn';
import { SignUp } from '@/components/SignUp';
import List from '@/components/List';
import { useState } from 'react';

const HomePage = () => {
  const { user } = useUser();
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-gray-800 text-white">Header</header>
      <main className="flex-1 overflow-auto">
        <List />
      </main>
    </div>
    // <main className="mx-auto max-w-screen-xl flex flex-col max-h-screen px-4 pt-10 sm:px-6 sm:pt-24 lg:px-8">
    //   <section className="px-4 sm:px-6 lg:px-8 mb-6">
    //     <div className="flex flex-col justify-between flex-shrink-0">
    //       <h1 className="block text-2xl font-bold sm:text-4xl flex-shrink">
    //         Ostoslista
    //       </h1>
    //       <p>Current User : {user?.email || 'None'}</p>
    //     </div>
    //     {user && <button onClick={() => auth.signOut()}>Sign Out</button>}
    //   </section>

    //   {user ? (
    //     <section className="flex-1 w-full bg-slate-700">
    //       <List />
    //     </section>
    //   ) : (
    //     <>
    //       <button onClick={() => setIsSignIn((prev) => !prev)} className="mb-4">
    //         {isSignIn ? 'Sign Up' : 'Sign In'}
    //       </button>
    //       {isSignIn ? <SignIn /> : <SignUp />}
    //     </>
    //   )}
    // </main>
  );
};

export default HomePage;
