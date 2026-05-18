import type {Metadata} from 'next';
import { Inter, Bebas_Neue, Archivo_Black } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo-black',
});

export const metadata: Metadata = {
  title: 'MAJOR Portfolio Clone',
  description: 'Cinematic sports portfolio clone',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable} ${archivoBlack.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-text" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
