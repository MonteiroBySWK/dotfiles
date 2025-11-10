import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <PrimeReactProvider>{children}</PrimeReactProvider>
      </body>
    </html>
  );
}
