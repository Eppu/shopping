import { Plus, UserPlus, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ShareListDialogContent from './ShareListDialogContent';

import { SharedWithIndicator } from './SharedWithIndicator';

import { useShoppingList } from '@/context/ShoppingListContext';
import AddListDialogContent from './AddListDialogContent';
import ListActions from './ListActions';

export function ShoppingListSelector() {
  const {
    shoppingLists,
    sharedShoppingLists,
    selectedShoppingList,
    setSelectedShoppingList,
  } = useShoppingList();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-1 pt-3">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {/* Own lists */}
        <DropdownMenuLabel>Omat ostoslistat</DropdownMenuLabel>
        <DropdownMenuGroup>
          {shoppingLists.map((list) => (
            <DropdownMenuItem
              key={list.id}
              // active={selectedShoppingList?.id === list.id}
              className={`cursor-pointer
                ${
                  selectedShoppingList?.id === list.id
                    ? 'font-bold bg-gray-50'
                    : ''
                }
                `}
              onSelect={(e) => {
                e.preventDefault();
                setSelectedShoppingList(list);
              }}
            >
              <span>{list.name}</span>
              <DropdownMenuShortcut className="flex items-center opacity-100 tracking-normal font-normal">
                {list.sharedWith.length > 0 && (
                  <SharedWithIndicator sharedWith={list.sharedWith} />
                )}

                <ListActions shoppingListId={list.id} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {/* Shared lists */}
        <DropdownMenuLabel>Sinulle jaetut listat</DropdownMenuLabel>
        <DropdownMenuGroup>
          {sharedShoppingLists.length > 0 ? (
            sharedShoppingLists.map((list) => (
              // TODO: Refactor this to a shared component
              <DropdownMenuItem
                key={list.id}
                className={
                  selectedShoppingList?.id === list.id
                    ? 'font-bold bg-gray-50'
                    : ''
                }
              >
                <span>{list.name}</span>
                {list.sharedWith.length > 0 && (
                  <DropdownMenuShortcut className="flex items-center opacity-100 tracking-normal font-normal">
                    <SharedWithIndicator sharedWith={list.sharedWith} />
                  </DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem>
              <span>Ei vielä jaettuja listoja</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {/* Settings */}
        <DropdownMenuGroup>
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Uusi ostoslista</span>
                {/* <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            </DialogTrigger>
            <AddListDialogContent />
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Jaa lista</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <ShareListDialogContent />
          </Dialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// <Dialog>
// <DialogTrigger asChild>
//   <Button variant="outline">Edit Profile</Button>
// </DialogTrigger>
// <DialogContent className="sm:max-w-[425px]">
//   <DialogHeader>
//     <DialogTitle>Edit profile</DialogTitle>
//     <DialogDescription>
//       Make changes to your profile here. Click save when you're done.
//     </DialogDescription>
//   </DialogHeader>
//   <div className="grid gap-4 py-4">
//     <div className="grid grid-cols-4 items-center gap-4">
//       <Label htmlFor="name" className="text-right">
//         Name
//       </Label>
//       <Input
//         id="name"
//         defaultValue="Pedro Duarte"
//         className="col-span-3"
//       />
//     </div>
//     <div className="grid grid-cols-4 items-center gap-4">
//       <Label htmlFor="username" className="text-right">
//         Username
//       </Label>
//       <Input
//         id="username"
//         defaultValue="@peduarte"
//         className="col-span-3"
//       />
//     </div>
//   </div>
//   <DialogFooter>
//     <Button type="submit">Save changes</Button>
//   </DialogFooter>
// </DialogContent>
// </Dialog>
