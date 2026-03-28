import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Hexis — AI Governance Platform',
    template: '%s | Hexis',
  },
  description:
    'Navigate EU AI Act compliance independently. AI-powered governance tools for SMEs.',
  metadataBase: new URL('https://app.hexis.center'),
  openGraph: {
    title: 'Hexis — AI Governance Platform',
    description: 'Navigate EU AI Act compliance independently.',
    url: 'https://app.hexis.center',
    siteName: 'Hexis',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dark-bg text-dark-type font-body antialiased">
        {children}
      </body>
    </html>
  );
}
