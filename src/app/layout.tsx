import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EDGE.NODE IoT - Telemetry Gateway & Monitoring Suhu DHT22',
  description: 'Dashboard Web Monitoring Sensor DHT22 Suhu dan Kelembapan dengan Next.js dan Firebase RTDB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-background text-on-surface antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
