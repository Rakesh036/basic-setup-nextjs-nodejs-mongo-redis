import { useState, useEffect } from 'react';

export const useSystemStatus = (initialEndpoint = 'pingAll') => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async (endpoint = initialEndpoint) => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching data...');
            console.log('hitting url is:', `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/test/${endpoint}`);
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/test/${endpoint}`, {
                credentials: 'include',
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const responseData = await res.json();
            console.log('Data fetched:', responseData);
            setData(responseData);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(initialEndpoint);
    }, [initialEndpoint]);

    return { data, loading, error, fetchData };
}; 