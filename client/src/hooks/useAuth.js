'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setError, setLoading, logout } from '@/redux/slices/authSlice.js';

export const useAuthCheck = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/me`,
          { withCredentials: true }
        );

        if (response.data.user) {
          dispatch(setUser(response.data.user));
        }
      } catch (error) {
        console.error('Auth check error:', error);
        dispatch(logout());
      }
    };

    checkAuth();
  }, [dispatch]);
};

export default function useAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('m@m.m');
  const [password, setPassword] = useState('m123456');
  const [name, setName] = useState('m');
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      if (isSignUp) {
        // Sign up
        if (!name) throw new Error('Name is required');
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/register`,
          { name, email, password },
          { withCredentials: true }
        );
        if (res.status === 201) {
          toast.success('Registration successful', {
            style: { fontSize: '80px' },
            description: 'Your account has been created.',
          });
          dispatch(setUser(res.data.user));
          router.push('/');
        }
      } else {
        // Sign in
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/login`,
          { email, password },
          { withCredentials: true }
        );
        if (res.status === 200) {
          toast.success('Login successful', {
            style: { fontSize: '80px' },
            description: 'Welcome back!',
          });
          dispatch(setUser(res.data.user));
          router.push('/');
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      toast.error('Authentication Error', {
        style: { fontSize: '80px' },
        description: errorMessage,
        action: {
          label: 'Retry',
          onClick: () => handleSubmit(e),
        },
      });
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(logout());
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if server request fails
      dispatch(logout());
      router.push('/login');
    }
  };

  return {
    isSignUp,
    setIsSignUp,
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    loading,
    error,
    isAuthenticated,
    handleSubmit,
    handleLogout,
  };
}
