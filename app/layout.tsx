import type { Metadata } from 'next'; import './globals.css'; import { Header } from '@/components/Header'; import { Footer } from '@/components/Footer';
export const metadata: Metadata = { title: 'Satguru AI Central Portal', description: 'Internal application hub for Satguru AI tools' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><Header/><main>{children}</main><Footer/></body></html> }
