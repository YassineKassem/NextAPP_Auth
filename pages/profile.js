import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
//import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

// Custom hook for managing dark mode
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

export default function EditProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [theme, toggleTheme] = useDarkMode();
  const [profileData, setProfileData] = useState(null);

  const handleSignOut = () => {
    signOut({
      callbackUrl: '/login', // Redirect to login page after sign out
    });
  };

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    birthdate: '',
    address: '',
    phone: '',
    email: '',
    google_id: '',
    image_url: '', // Field to store image URL
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (status === 'authenticated') {
      const googleId = session.user.id;

      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('name, surname, birthdate, address, phone, email, google_id, image_url')
            .eq('google_id', googleId)
            .single();

          if (error) {
            console.error('Error fetching profile from Supabase:', error.message);
            setLoading(false);
            return;
          }

          setFormData({
            name: data?.name || '',
            surname: data?.surname || '',
            birthdate: data?.birthdate || '',
            address: data?.address || '',
            phone: data?.phone || '',
            email: data?.email || session.user.email || '',
            google_id: data?.google_id || googleId,
            image_url: data?.image_url || 'https://via.placeholder.com/150',
          });

          setProfileData(data);
          setLoading(false);
        } catch (err) {
          console.error('Unexpected error fetching profile:', err);
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [status, session]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
    if (!formData.birthdate) newErrors.birthdate = 'Birthdate is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const googleId = formData.google_id;

    const { error } = await supabase
      .from('profiles')
      .update({
        name: formData.name,
        surname: formData.surname,
        birthdate: formData.birthdate,
        address: formData.address,
        phone: formData.phone,
        image_url: formData.image_url,
      })
      .eq('google_id', googleId);

    if (error) {
      console.error('Error updating profile:', error.message);
    } else {
      alert('Profile updated successfully');
      router.push('/profile');
    }
  };

  if (loading) {
    return <p>Loading profile data...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      {/* Navbar */}
      <header className="bg-white dark:bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src={profileData?.image_url || 'https://via.placeholder.com/150'}
              alt="Profile Picture"
              width={50}
              height={50}
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              MyPortfolio
            </span>
          </div>
          <nav className="flex flex-wrap items-center space-x-4 sm:space-x-8">
            <Link href="/profile" className="text-gray-700 dark:text-white hover:text-blue-500">
              Profile
            </Link>
            <Link href="/profile/edit" className="text-gray-700 dark:text-white hover:text-blue-500">
              Edit Profile
            </Link>
            <button onClick={toggleTheme} className="text-gray-700 dark:text-white">
              {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
            <button onClick={handleSignOut} className="text-white bg-blue-500 px-3 py-2 rounded-md hover:bg-blue-600">
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 px-4">
        <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md lg:max-w-lg">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Edit Profile</h1>
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-white">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Surname Field */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-white">Surname</label>
              <input
                type="text"
                name="surname"
                value={formData.surname || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Surname"
              />
              {errors.surname && <p className="text-red-500 text-sm">{errors.surname}</p>}
            </div>

            {/* Birthdate Field */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-white">Birthdate</label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              {errors.birthdate && <p className="text-red-500 text-sm">{errors.birthdate}</p>}
            </div>

            {/* Address Field */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-white">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Address"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            {/* Phone Field */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-white">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Phone"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-white">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white bg-gray-100 dark:bg-gray-700"
                placeholder="Email"
              />
            </div>

            {/* Save Changes Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Save Changes
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
