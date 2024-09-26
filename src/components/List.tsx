import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
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

import { addItemToList } from '@/utils/FirebaseFunctions';

export default function List() {
  const { shoppingLists, selectedShoppingList, loading, items } =
    useShoppingList();
  console.log('shoppingLists', shoppingLists);

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
              <TableHead className="text-right" />{' '}
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
                  No items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
