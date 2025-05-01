import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1 className="text-4xl font-bold">Hello, World!</h1>
      <p className="mt-4 text-lg">This is a simple Next.js app.</p>
      <p className="mt-2 text-sm text-gray-500">Using Tailwind CSS for styling.</p>
      <p className="mt-2 text-sm text-gray-500">Using Google Fonts for typography.</p>
      <p className="mt-2 text-sm text-gray-500">Using Next.js for server-side rendering.</p>
      <p className="mt-2 text-sm text-gray-500">Using React for building UI components.</p>
      <Link href="/test" className="mt-25">
        <Button variant="destructive">Test route</Button>
      </Link>
    </div>
  );
}
