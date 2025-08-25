import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Rocbird takehome',
  description: 'Rocbird takehome',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-[100dvh] bg-background text-foreground antialiased mx-auto font-sans'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <SonnerToaster />
      </body>
    </html>
  );
}
