import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RemovePurchasedItemsButtonProps {
  onClick: () => void;
}

const RemovePurchasedItemsButton: React.FC<RemovePurchasedItemsButtonProps> = ({
  onClick,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="p-1" variant="ghost" onClick={onClick}>
            <Check className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Poista ostetut</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RemovePurchasedItemsButton;
