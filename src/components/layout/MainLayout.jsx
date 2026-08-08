import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0d0e10] text-gray-900 dark:text-gray-200 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}