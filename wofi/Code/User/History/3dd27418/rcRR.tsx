import { ReactNode } from 'react';

interface MainContainerProps {
  children: ReactNode;
}

export const MainContainer = ({ children }: MainContainerProps) => {
  return (
    <div className="w-full flex-grow overflow-y-scroll">
      <div className="container mx-auto p-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};