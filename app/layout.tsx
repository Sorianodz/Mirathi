import type {Metadata, Viewport} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'حاسبة المواريث والزكاة',
  description: 'حاسبة المواريث والزكاة وفق قانون الأسرة الجزائري - المذهب المالكي',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar" dir="rtl">
      <body suppressHydrationWarning className="font-sans antialiased text-gray-900">
        {children}
      </body>
    </html>
  );
}
