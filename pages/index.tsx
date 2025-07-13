import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to ranking page as the default public page
    router.replace('/ranking');
  }, [router]);

  return null; // No content needed as we're redirecting
}
