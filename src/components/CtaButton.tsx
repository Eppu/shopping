import React from 'react';
import { Button } from '@/components/ui/button';

interface CtaButtonProps {
  onClick: () => void;
  text: string;
}

const CtaButton: React.FC<CtaButtonProps> = ({ onClick, text }) => {
  return (
    <Button variant="default" onClick={onClick}>
      {text}
    </Button>
  );
};

export default CtaButton;
