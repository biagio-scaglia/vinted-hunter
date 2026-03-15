import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Vinted Hunter Pro - Research Center',
  description: 'Industrial-grade marketplace research and monitoring system.',
  manifest: '/manifest.json',
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Vinted Hunter Pro',
    description: 'Industrial-grade marketplace research center.',
    url: '/',
    siteName: 'Vinted Hunter Pro',
    images: [
      {
        url: '/favicon.ico',
        width: 64,
        height: 64,
      },
    ],
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vinted Hunter Pro',
    description: 'Advanced Marketplace Monitor',
  },
};

export const viewport = {
  themeColor: '#8b5cf6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <AntdRegistry>
          {children}
          <script dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `
          }} />
        </AntdRegistry>
      </body>
    </html>
  );
}
