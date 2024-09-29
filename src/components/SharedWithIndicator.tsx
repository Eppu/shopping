import { DropdownMenuShortcut } from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Users } from 'lucide-react';

export const SharedWithIndicator = ({
  sharedWith,
}: {
  sharedWith: string[];
}) => {
  console.log('sharedWith', sharedWith);
  return (
    <DropdownMenuShortcut className="opacity-100 tracking-normal font-normal">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* Show this if shared with others */}
            <Users className="mr-2 h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Jaettu {sharedWith.length} henkilön kanssa</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </DropdownMenuShortcut>
  );
};
