import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Satguru AI',
  description: 'Secure Satguru AI central portal login.'
};

export default function HomePage() {
  redirect('/login');
}
