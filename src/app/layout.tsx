import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ひらがなスロット',
  description: '3歳からあそべる、たのしいひらがなスロット！',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-['M_PLUS_Rounded_1c',_sans-serif] bg-sky-100 antialiased overflow-x-hidden selection:bg-pink-300">
        {children}
      </body>
    </html>
  );
}
