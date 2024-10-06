import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');  // Redirect to login page if not authenticated
    } else if (status === 'authenticated') {
      router.push('/profile'); // Redirect to profile page if authenticated
    }
  }, [status, router]);

  return <p>Redirecting...</p>;  // Optional: Show while redirecting
}
