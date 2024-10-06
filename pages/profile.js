import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient'; // Ensure correct path

// Custom hook for managing dark mode (remains the same)
const useDarkMode = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.add(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return [theme, toggleTheme];
};

export default function Profile() {
  const { data: session } = useSession();
  const router = useRouter();
  const [theme, toggleTheme] = useDarkMode(); // Manage dark mode
  const [profileData, setProfileData] = useState(null); // Store profile data
  const [loading, setLoading] = useState(true);

  // Fetch the profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) return;

      const googleId = session.user.id; // Assuming googleId is the identifier

      const { data, error } = await supabase
        .from('profiles')
        .select('name, image_url') // Make sure you select the image_url field
        .eq('google_id', googleId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error.message);
      } else {
        setProfileData(data); // Save fetched data
      }
      setLoading(false);
    };

    fetchProfile();
  }, [session]);

  if (!session || loading) {
    return <p>Loading...</p>;
  }

  const handleSignOut = () => {
    signOut({
      callbackUrl: '/login', // Redirect to login page after sign out
    });
  };

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-800`}>
      {/* Navbar */}
      <header className="bg-white dark:bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img
              className="h-10 w-auto"
              src={profileData?.image_url || 'https://via.placeholder.com/150'} // Use image_url from database
              alt="Logo"
            />
            <span className="ml-4 text-2xl font-bold text-gray-900 dark:text-white">
              MyPortfolio
            </span>
          </div>
          <nav className="flex items-center space-x-8">
            <Link href="/profile" className="text-gray-700 dark:text-white hover:text-blue-500">
              Profile
            </Link>
            <Link href="/profile/edit" className="text-gray-700 dark:text-white hover:text-blue-500">
              Edit Profile
            </Link>
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-4 text-gray-700 dark:text-white"
            >
              {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Avatar Section */}
        <div className="w-40 h-40 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900">
          <img
            className="w-full h-full object-cover"
            src={profileData?.image_url || 'https://via.placeholder.com/150'} // Use the image URL from the database
            alt="Profile Picture"
          />
        </div>

        {/* Profile Info */}
        <div className="mt-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Hey! <span role="img" aria-label="wave">👋</span>
          </h1>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mt-4">
            My name is {profileData?.name || 'User'} and I'm a Full Stack Developer
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl">
            This is my digital space where I write about the things I'm working on and share what I've learned.
          </p>
        </div>
      </main>
    </div>
  );
}
