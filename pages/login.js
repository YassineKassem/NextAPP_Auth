import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect to profile if already logged in
  useEffect(() => {
    if (session) {
      router.push('/profile');
    }
  }, [session, router]);  // Added 'router' here

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h1>
        <p className="text-center text-gray-600 mb-8">Sign in to your account</p>

        <button
          onClick={() => signIn('google')}
          className="flex items-center justify-center w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          <svg
            className="w-5 h-5 mr-3"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8c0-17.7-1.6-35.3-4.6-52.2H249.2v99.4h134c-5.8 30.8-23.2 56.8-49.4 74.1v61.4h79.7c46.7-43.1 73.5-106.5 73.5-182.7zM249.2 482.8c64.5 0 118.7-21.5 158.2-58.1l-79.7-61.4c-22.2 15-50.5 24-78.5 24-60.7 0-112.2-41-130.6-96.4H89.3v61.9c39.2 77.7 120.4 130 213.8 130zM118.6 318.5c-6-17.7-9.4-36.6-9.4-56.5s3.4-38.8 9.4-56.5V143.5H89.3c-18.5 37.5-29.1 79.5-29.1 124.5s10.6 87 29.1 124.5l29.3-60.1zM249.2 97.6c34.8 0 66 12 90.9 35l67.9-67.9C369.3 30.1 312.8 0 249.2 0 155.8 0 74.5 52.3 35.3 130l29.3 60.1C137 146.2 188.5 97.6 249.2 97.6z"
            ></path>
          </svg>
          Sign in with Google
        </button>

        <p className="text-center text-gray-500 text-sm mt-6">
          By signing in, you agree to our{' '}
          <a href="#" className="underline text-blue-500">
            Terms
          </a>{' '}
          and{' '}
          <a href="#" className="underline text-blue-500">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
