import { ReactNode } from 'react';

interface MainContainerProps {
  children: ReactNode;
}

export const MainContainer = ({ children }: MainContainerProps) => {
  return (
    <div className="w-full h-fit pt-10 overflow-y-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-14 py-6 sm:py-8 lg:py-14">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};