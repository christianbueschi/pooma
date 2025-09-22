import type { Metadata } from 'next';
import { Providers } from '../toolkit/components/Providers';

export const metadata: Metadata = {
  title: 'Pooma',
  description: 'Planning poker made simple',
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
