import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EmojiLoader from '@/components/EmojiLoader';
import { Input } from '@/components/ui/input';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import ListRow from './ListRow';

import { ShoppingListSelector } from './ShoppingListSelector';

import { useShoppingList } from '@/context/ShoppingListContext';

import {
  addItemToList,
  removeAllItemsFromList,
} from '@/utils/FirebaseFunctions';

// TODO: Dismiss all toasts when changing shopping lists
import { toast } from 'sonner';

export default function List() {
  const {
    shoppingLists,
    sharedShoppingLists,
    selectedShoppingList,
    loading,
    items,
  } = useShoppingList();
  console.log('shoppingLists', shoppingLists);
  console.log('sharedShoppingLists', sharedShoppingLists);

  // check if all items are purchased
  const allItemsPurchased =
    items.length > 0 && items.every((item) => item.purchased);

  const [newItemName, setNewItemName] = useState('');
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (allItemsPurchased && selectedShoppingList) {
      const allItemsPurchasedToast = toast.success(
        <div className="flex w-full h-16 items-center justify-between gap-2">
          <div>Jee! Kaikki ostettu.</div>
          <div>
            <Button
              variant={'destructive'}
              onClick={() => {
                removeAllItemsFromList(selectedShoppingList.id);
                toast.dismiss(allItemsPurchasedToast);
              }}
              className="gap-2"
            >
              <>
                <p className="font-semibold">Tyhjennä lista</p>

                <Trash2 className="h-4 w-4" />
              </>
            </Button>
          </div>
        </div>,
        {
          duration: 60000,
        }
      );
    }

    return () => {
      toast.dismiss();
    };
  }, [allItemsPurchased, selectedShoppingList]);

  useEffect(() => {
    if (isAddMenuOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddMenuOpen]);

  if (loading) {
    return <EmojiLoader />;
  }

  if (!selectedShoppingList) {
    return <div>Ostolistaa ei ole valittu.</div>;
  }

  console.log('items', items);

  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <div className="flex items-center  gap-1">
            <CardTitle>{selectedShoppingList.name}</CardTitle>
            <ShoppingListSelector />
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className="ml-auto gap-1"
          onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
        >
          <Link to="#">
            Uusi tavara
            {isAddMenuOpen ? (
              <Minus className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        <Table className="overflow-x-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Tavara</TableHead>
              <TableHead className="text-right">Ostettu</TableHead>
              {/* <TableHead className="text-right">Lisännyt</TableHead> */}
              <TableHead className="text-right" />
              {/* Empty column for actions */}
            </TableRow>
            {isAddMenuOpen && (
              <TableRow>
                <TableCell colSpan={3}>
                  <div className="flex gap-4">
                    <Input
                      ref={inputRef}
                      placeholder="Lisää uusi tavara"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addItemToList(
                            selectedShoppingList.id,
                            newItemName.trim()
                          );
                          setNewItemName('');
                        }
                      }}
                    />
                    <Button
                      className="w-16"
                      onClick={() => {
                        addItemToList(
                          selectedShoppingList.id,
                          newItemName.trim()
                        );
                        setIsAddMenuOpen(false);
                        setNewItemName('');
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableHeader>

          <TableBody>
            {items.length !== 0 ? (
              items.map((item) => (
                <ListRow
                  //TODO: Just pass the item object
                  key={item.id}
                  id={item.id}
                  purchased={item.purchased}
                  name={item.name}
                  addedBy={item.addedBy}
                  createdAt={item.createdAt}
                  shoppingListId={selectedShoppingList.id}
                  quantity={item.quantity}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Ostoslistalla ei ole vielä mitään.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {allItemsPurchased && (
          <div className="flex flex-row justify-center p-6">
            <Button
              variant={'destructive'}
              onClick={() => {
                removeAllItemsFromList(selectedShoppingList.id);
                toast.dismiss();
              }}
              className="gap-2"
            >
              <>
                <p className="font-semibold">Tyhjennä lista</p>

                <Trash2 className="h-4 w-4" />
              </>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
