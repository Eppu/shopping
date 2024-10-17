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
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Users className="mr-2 h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Jaettu {sharedWith.length} henkilön kanssa</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
