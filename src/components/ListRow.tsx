import { TableCell, TableRow } from '@/components/ui/table';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  setItemPurchasedStatus,
  deleteItemFromList,
} from '@/utils/FirebaseFunctions';

import { MoreHorizontal, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Item } from '@/lib/types';

type Props = Item & {
  shoppingListId: string;

  // id: string;
  // purchased: boolean;
  // name: string;
  // addedBy: string;
  // createdAt: {
  //   seconds: number;
  //   milliseconds: number;
  // };
};

export default function ListRow({
  id,
  purchased,
  name,
  // addedBy,
  // createdAt,
  shoppingListId,
}: Props) {
  return (
    <TableRow
      className={`cursor-pointer ${purchased && 'bg-gray-100'}`}
      key={id}
      onClick={() => {
        setItemPurchasedStatus(shoppingListId, id, !purchased);
      }}
    >
      <TableCell>
        <div
          className={`font-medium ${purchased && 'line-through text-gray-500'}`}
        >
          {name}
        </div>
        {/* <div className="hidden text-sm text-muted-foreground md:inline">
          {addedBy}
        </div> */}
      </TableCell>

      {/* <TableCell className="hidden xl:table-column">
        <Badge className="text-xs" variant="outline">
          Approved
        </Badge>
      </TableCell> */}
      {/* <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
        {createdAt && createdAt.seconds}
      </TableCell> */}
      <TableCell className="text-right">{purchased ? '✅' : '⬛'}</TableCell>
      <TableCell className="text-right px-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Avaa valikko</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                deleteItemFromList(shoppingListId, id);
              }}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Poista</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
