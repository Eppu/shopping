import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import SignIn from './SignIn';
import SignUp from './SignUp';

type Props = {
  setIsSignIn: (value: boolean) => void;
  title: string;
  description: string;
};

export default function SignInSignUpCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error when signing in', error);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error when signing in', error);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      {isSignIn ? <SignIn /> : <SignUp />}
      <Button
        className="w-full mt-4"
        onClick={isSignIn ? handleSignIn : handleSignUp}
      >
        {isSignIn ? 'Sign in' : 'Sign up'}
      </Button>
    </Card>
  );
}
