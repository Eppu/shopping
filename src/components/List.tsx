import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { ShoppingListSelector } from './ShoppingListSelector';

import { useShoppingList } from '@/context/ShoppingListContext';

import {
  addItemToList,
  setItemPurchasedStatus,
} from '@/utils/FirebaseFunctions';

export default function List() {
  const [lists, setLists] = useState<{ id: string }[]>([]);

  const { shoppingLists, selectedShoppingList, loading, items } =
    useShoppingList();
  console.log('shoppingLists', shoppingLists);
  console.log('selectedShoppingList', selectedShoppingList);
  console.log('loading', loading);
  console.log('items in List', items);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Card className="xl:col-span-2 ">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <div className="flex items-center  gap-1">
            <CardTitle>{selectedShoppingList.name}</CardTitle>
            <ShoppingListSelector />
          </div>
          {/* <CardDescription>
            Recent transactions from your store.
          </CardDescription> */}
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
              <TableHead className="hidden xl:table-column">Type</TableHead>
              <TableHead className="hidden xl:table-column">Status</TableHead>
              <TableHead className="hidden xl:table-column">Date</TableHead>
              <TableHead className="text-right">Ostettu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items &&
              items.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => {
                    setItemPurchasedStatus(
                      selectedShoppingList.id,
                      item.id,
                      !item.purchased
                    );
                  }}
                >
                  <TableCell>
                    <div className="font-medium">{item.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {item.addedBy}
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">Sale</TableCell>
                  <TableCell className="hidden xl:table-column">
                    <Badge className="text-xs" variant="outline">
                      Approved
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                    {item.createdAt && item.createdAt.seconds}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.purchased ? '✅' : '-'}
                  </TableCell>
                </TableRow>
              ))}
            <TableRow>
              <TableCell>
                <div className="font-medium">Liam Johnson</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  liam@example.com
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Sale</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">
                  Approved
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                2023-06-23
              </TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
