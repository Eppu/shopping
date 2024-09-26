import { Link } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const { shoppingLists, selectedShoppingList, loading, items } =
    useShoppingList();
  console.log('shoppingLists', shoppingLists);

  // check if all items are purchased
  const allItemsPurchased =
    items.length > 0 && items.every((item) => item.purchased);

  if (allItemsPurchased) {
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
        duration: 600000,
      }
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!selectedShoppingList) {
    return <div>No shopping list selected</div>;
  }

  return (
    <Card className="xl:col-span-2 ">
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
          onClick={() =>
            addItemToList(selectedShoppingList.id, 'jokin toinen tavara')
          }
        >
          <Link to="#">
            Lisää uusi
            <Plus className="h-4 w-4" />
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
          </TableHeader>
          <TableBody>
            {items.length !== 0 ? (
              items.map((item) => (
                <ListRow
                  key={item.id}
                  id={item.id}
                  purchased={item.purchased}
                  name={item.name}
                  addedBy={item.addedBy}
                  createdAt={item.createdAt}
                  shoppingListId={selectedShoppingList.id}
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
