'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  // 🔁 Re-check auth whenever pathname changes (login/logout nav triggers it)
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/auth-status', { cache: 'no-store' });
      const data = await res.json();
      setLoggedIn(data.loggedIn);
    };
    checkAuth();
  }, [pathname]); // 🔁 depend on pathname

  const handleLogout = async () => {
    await fetch('/api/logout');
    window.location.href = '/login'; // 🔁 forces full reload
  };

  const linkClass = (path) =>
    `px-4 py-2 rounded-md font-medium transition ${
      pathname === path
        ? 'bg-blue-600 text-white'
        : 'text-blue-700 hover:bg-blue-100'
    }`;

  return (
    <nav className='bg-white sticky top-0 shadow p-4 z-50'>
      <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2'>
        <Link href='/' className='text-xl font-bold text-blue-700'>
          Dhunki Product App
        </Link>
        <div className='flex gap-4 items-center'>
          <Link href='/add-wap' className={linkClass('/add-wap')}>
            Add Product
          </Link>
          <Link href='/all-waps' className={linkClass('/all-waps')}>
            All Products
          </Link>

          {loggedIn ? (
            <button
              onClick={handleLogout}
              className='bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md cursor-pointer transition'
            >
              Logout
            </button>
          ) : (
            <Link
              href='/login'
              className='bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition'
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
