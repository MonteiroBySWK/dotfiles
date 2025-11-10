import { ReactNode } from 'react';

interface MainContainerProps {
  children: ReactNode;
}

export const MainContainer = ({ children }: MainContainerProps) => {
  return (
    <div className="w-full flex-grow overflow-y-scroll">
      <div className="container mx-auto p-4 sm:px-6 lg:px-14 sm:py-8 lg:py-14">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};