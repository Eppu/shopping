import React from 'react';

interface FloatingButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onClick,
  children,
}) => {
  return (
    <div className="flex justify-end py-2">
      <button className="btn btn-destructive" onClick={onClick}>
        {children}
      </button>
    </div>
  );
};

export default FloatingButton;
