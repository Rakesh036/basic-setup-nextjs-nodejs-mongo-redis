import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

export default function useAuth() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('m@m.m');
    const [password, setPassword] = useState('m123456');
    const [name, setName] = useState('m');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

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
                        description: 'Your account has been created.'
                    });

                    router.push('/');
                }
            } else {
                // Sign in - Fixed the API endpoint by removing the "dsvfdsf" suffix
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/login`,
                    { email, password },
                    { withCredentials: true }
                );
                if (res.status === 200) {
                    toast.success('Login successful', {
                        style: { fontSize: '80px' },
                        description: 'Welcome back!'
                    });
                   console.log('res.data');
                    console.log(res.data);
                    router.push('/');
                }
            }
        } catch (err) {
            toast.error("Authentication Error", {
                style: { fontSize: '80px' },
                description: err.response?.data?.message || err.message || 'An error occurred',
                action: {
                    label: "Retry",
                    onClick: () => handleSubmit(e),
                },
            });
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setLoading(false);
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
        handleSubmit,
    };
}