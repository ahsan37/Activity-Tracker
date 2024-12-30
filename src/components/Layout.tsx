import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">

      {/* <header className="bg-gray-800 text-white py-4">
        <nav className="max-w-4xl mx-auto flex justify-around">
          <Link href="/">Home</Link>
          <Link href="/log-activity">Log Activity</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
      </header> */}

      <main className="flex-grow p-4">{children}</main>

      {/* <footer className="bg-gray-800 text-white py-2 text-center">
        &copy; 2024 Habit Tracker
      </footer> */}
    </div>
  );
}
