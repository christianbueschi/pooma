import type { Metadata } from 'next';
import { Providers } from '../toolkit/components/Providers';

export const metadata: Metadata = {
  title: 'Pooma',
  description: 'Planning poker made simple',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
