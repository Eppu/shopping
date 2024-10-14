import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useShoppingList } from '@/context/ShoppingListContext';
import { useState, useEffect } from 'react';
import {
  addUserToShoppingList,
  removeUserFromShoppingList,
  onSharedUsersChange,
} from '@/utils/FirebaseFunctions';

import { X } from 'lucide-react';

export default function ShareListDialogContent() {
  const { selectedShoppingList } = useShoppingList();
  const [email, setEmail] = useState('');
  const [sharedWith, setSharedWith] = useState<string[]>([]);

  // This is ugly but works for now. I think I'll need to refactor this to be included in the ShoppingListContext.
  useEffect(() => {
    if (!selectedShoppingList) {
      return;
    }

    const unsubscribe = onSharedUsersChange(
      selectedShoppingList.id,
      (users) => {
        setSharedWith(users);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [selectedShoppingList]);

  const handleAddUser = async () => {
    if (!selectedShoppingList) {
      return;
    }
    console.log('adding user to list', email);

    if (email) {
      try {
        await addUserToShoppingList(selectedShoppingList.id, email);
        setEmail(''); // Clear the input after adding the email
      } catch (error) {
        console.error('Error adding user to shopping list:', error);
      }
    }
  };

  const handleRemoveUser = async (email: string) => {
    console.log('Remove user:', email);
    if (!selectedShoppingList) {
      return;
    }
    try {
      await removeUserFromShoppingList(selectedShoppingList.id, email);
    } catch (error) {
      console.error('Error removing user from shopping list:', error);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Jaa lista "{selectedShoppingList?.name}"</DialogTitle>
        <DialogDescription>
          Lisää sähköpostiosoitteet, joiden kanssa haluat jakaa listan.
        </DialogDescription>
        <DialogDescription>
          Muista lähettää linkki henkilöille joille jaoit listan, sovellus ei
          lähetä kutsuja automaattisesti.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {/* <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Add email"
            className="col-span-3"
          />
          <Button onClick={handleAddUser}>Add</Button>
        </div> */}
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="email"
            placeholder="Sähköpostiosoite"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" onClick={() => handleAddUser()}>
            Lisää
          </Button>
        </div>

        <ScrollArea className="h-72 w-full rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">
              Jaettu käyttäjille:
            </h4>
            {sharedWith.map((userEmail) => (
              <>
                <div
                  key={userEmail}
                  className="flex justify-between items-center"
                >
                  <p className="text-sm">{userEmail}</p>
                  <Button
                    variant="ghost"
                    className="p-0 h-4 w-4"
                    onClick={() => handleRemoveUser(userEmail)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Separator className="my-2" />
              </>
            ))}
          </div>
        </ScrollArea>
        {/* <div>
          <h3>Shared with:</h3>
          <ul>
            {selectedShoppingList?.sharedWith.map((userEmail) => (
              <li key={userEmail} className="flex justify-between items-center">
                <span>{userEmail}</span>
                <Button
                  variant="ghost"
                  onClick={() => handleRemoveUser(userEmail)}
                >
                  x
                </Button> *
              </li>
            ))}
          </ul>
        </div> */}
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit">Sulje ikkuna</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
