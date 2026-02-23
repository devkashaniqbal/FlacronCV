import type { Metadata } from 'next';
import { Inter, Merriweather, Playfair_Display, Roboto, Lora, Open_Sans, Montserrat } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import LoadingBar from '@/components/shared/LoadingBar';
import { Toaster } from 'sonner';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const merriweather = Merriweather({ weight: ['300', '400', '700'], subsets: ['latin'], variable: '--font-merriweather' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const roboto = Roboto({ weight: ['300', '400', '500', '700'], subsets: ['latin'], variable: '--font-roboto' });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-opensans' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

const RTL_LOCALES = ['ar', 'ur'];

export const metadata: Metadata = {
  title: {
    default: 'FlacronCV – AI-Powered CV & Cover Letter Builder',
    template: '%s | FlacronCV',
  },
  description:
    'Create ATS-optimized CVs and cover letters in minutes using AI. Professional templates, PDF & DOCX export, multilingual support. Free to start.',
  keywords: [
    'CV builder',
    'resume builder',
    'cover letter generator',
    'AI CV',
    'ATS optimization',
    'professional CV',
    'job application',
    'free resume builder',
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://flacroncv-web.onrender.com',
  ),
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${merriweather.variable} ${playfair.variable} ${roboto.variable} ${lora.variable} ${openSans.variable} ${montserrat.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <ThemeProvider>
              <AuthProvider>
                <LoadingBar />
                {children}
                <Toaster position="bottom-right" richColors />
              </AuthProvider>
            </ThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
