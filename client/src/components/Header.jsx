'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Navigation items configuration
const NAV_ITEMS = [
  { name: 'Home', path: '/' },
  { name: 'Test', path: '/test' },
  { name: 'Group', path: '/group' },
];

// Logo Component
const Logo = () => (
  <Link href="/" className="flex items-center">
    <motion.div
      className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      A
    </motion.div>
    <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">AuthSys</span>
  </Link>
);

// Desktop Navigation Component
const DesktopNav = ({ navItems }) => (
  <nav className="hidden md:flex space-x-8">
    {navItems.map((item) => (
      <motion.div key={item.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href={item.path}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium"
        >
          {item.name}
        </Link>
      </motion.div>
    ))}
  </nav>
);

// User Dropdown Component
const UserDropdown = ({ user, isOpen, onToggle, onLogout }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        onClick={() => onToggle(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <User size={18} />
        </div>
        <span className="font-medium">{user?.name?.split(' ')[0] || 'User'}</span>
        <ChevronDown
          size={16}
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50"
          >
            <Link
              href="/test"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Your test
            </Link>
            <Link
              href="/"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              home
            </Link>
            <button
              onClick={onLogout}
              className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex items-center">
                <LogOut size={16} className="mr-2" />
                <span>Logout</span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Auth Buttons Component
const AuthButtons = () => (
  <div className="flex space-x-4">
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        href="/login"
        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium"
      >
        Login
      </Link>
    </motion.div>
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        href="/signup"
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
      >
        Sign Up
      </Link>
    </motion.div>
  </div>
);

// Mobile Navigation Component
const MobileNav = ({ isOpen, onClose, navItems, isAuthenticated, onLogout }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="md:hidden bg-white dark:bg-gray-900 shadow-md"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <motion.div key={item.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={item.path}
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                onClick={onClose}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}

          {isAuthenticated ? (
            <>
              <div className="border-t dark:border-gray-700 my-2"></div>
              <Link
                href="/test"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                onClick={onClose}
              >
                Your test
              </Link>
              <Link
                href="/home"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                onClick={onClose}
              >
                home
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full text-left block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              >
                <div className="flex items-center">
                  <LogOut size={16} className="mr-2" />
                  <span>Logout</span>
                </div>
              </button>
            </>
          ) : (
            <>
              <div className="border-t dark:border-gray-700 my-2"></div>
              <Link
                href="/login"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                onClick={onClose}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block px-3 py-2 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                onClick={onClose}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Main Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleDropdownToggle = (value) => {
    setIsDropdownOpen(value);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        dispatch(logout());
        toast.success('Logged out successfully');
        router.push('/');
      } else {
        toast.error('Logout failed');
        console.log('response: ', response);
      }
    } catch (error) {
      toast.error('An error occurred during logout');
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <DesktopNav navItems={NAV_ITEMS} />

          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <UserDropdown
                user={user}
                isOpen={isDropdownOpen}
                onToggle={handleDropdownToggle}
                onLogout={handleLogout}
              />
            ) : (
              <AuthButtons />
            )}
          </div>

          <div className="md:hidden flex items-center">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      <MobileNav
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navItems={NAV_ITEMS}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
    </header>
  );
};

export default Header;
