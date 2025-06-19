// ==== app/login/page.jsx ====
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) router.push('/');
    else setError('Invalid credentials');
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-4 border rounded shadow">
      <h1 className="text-xl mb-4 font-bold">Login</h1>
      <input className="w-full mb-2 border p-2"
        value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input className="w-full mb-2 border p-2"
        type="password" value={password} onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white p-2 rounded mt-2 cursor-pointer hover:bg-blue-700 transition"
      >
        Login
      </button>
    </div>
  );
}
