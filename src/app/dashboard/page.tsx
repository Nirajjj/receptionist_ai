// app/dashboard/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;

  if (!session) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div>
      <h1>Welcome {session.user?.email}</h1>

      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
