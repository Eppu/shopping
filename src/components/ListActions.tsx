import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { deleteShoppingList } from '@/utils/FirebaseFunctions';

import { MoreHorizontal, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useShoppingList } from '@/context/ShoppingListContext';

type Props = {
  shoppingListId: string;
};

export default function ListActions({ shoppingListId }: Props) {
  const {
    shoppingLists,
    selectedShoppingList,
    setSelectedShoppingList,
    setShoppingLists,
  } = useShoppingList();

  const handleDeleteList = async () => {
    await deleteShoppingList(shoppingListId);
    // remove the list from the context
    const updatedLists = shoppingLists.filter(
      (list) => list.id !== shoppingListId
    );

    setShoppingLists(updatedLists);

    // If the selected list is the one being deleted, select the first list. If there are no lists, set the selected list to null
    if (selectedShoppingList?.id === shoppingListId) {
      setSelectedShoppingList(updatedLists[0] ?? null);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="sr-only">Avaa valikko</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Toiminnot</DropdownMenuLabel>
        {/* TODO: Add a alert dialog here to make sure the user is aware of deletion being permanent */}
        <DropdownMenuItem
          onClick={async (e) => {
            e.stopPropagation(); // Prevent the click event from bubbling up to the row
            await handleDeleteList();
          }}
          className="text-red-600 hover:text-red-700 cursor-pointer"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Poista</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
