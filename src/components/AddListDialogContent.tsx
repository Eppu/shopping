import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useShoppingList } from '@/context/ShoppingListContext';
import { useState } from 'react';
import { createShoppingList } from '@/utils/FirebaseFunctions';

import { X } from 'lucide-react';

export default function AddListDialogContent() {
  const { setSelectedShoppingList } = useShoppingList();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateList = async () => {
    setIsSubmitting(true);
    try {
      // create a new shopping list and set it as the selected list
      const newList = await createShoppingList(name);
      setSelectedShoppingList(newList);
      setName('');
    } catch (error) {
      console.error('Error creating shopping list:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Uusi lista</DialogTitle>
        {/* <DialogDescription>
          Luo
        </DialogDescription>
        <DialogDescription>
          Muista lähettää linkki henkilöille joille jaoit listan, sovellus ei
          lähetä kutsuja automaattisesti.
        </DialogDescription> */}
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex flex-col w-full max-w-sm space-y-2 ">
          <Label htmlFor="name" className="font-semibold">
            Nimi
          </Label>
          <Input
            type="email"
            placeholder="Ostoslista"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyUp={async (e) => {
              if (e.key === 'Enter' && !isSubmitting) {
                handleCreateList();
                setName(''); // Clear the input after adding the email
              }
            }}
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="outline"
            onClick={() => {
              setName('');
            }}
          >
            Sulje
            {/* <X className="h-4 w-4" /> */}
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            type="submit"
            onClick={async () => {
              handleCreateList();
            }}
          >
            Luo lista
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
