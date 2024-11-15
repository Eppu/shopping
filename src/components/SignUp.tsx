import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebase';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error when signing in', error);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Luo tili</CardTitle>
        <CardDescription>
          Luo uusi käyttäjätili ja aloita listojen jakaminen.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 px-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Sähköposti</Label>
          <Input
            id="email"
            type="email"
            placeholder="test@example.com"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Salasana</Label>
          <Input
            id="password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full mt-4" onClick={handleSignUp}>
          Luo tili
        </Button>
      </CardFooter>
    </Card>
  );
}
