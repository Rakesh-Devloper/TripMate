import React from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Toast from '../components/common/Toast.jsx';
import useAppContext from '../context/AppContext.jsx';

/**
 * Main application layout wrapper
 * Renders the persistent navigation bar, active page content, footer,
 * and floating notification toasts.
 */
export const MainLayout = ({ children }) => {
  const { toast } = useAppContext();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans antialiased selection:bg-purple-200 selection:text-[#6C3DF5]">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      {toast && <Toast toast={toast} onClose={() => {}} />}
    </div>
  );
};

export default MainLayout;
