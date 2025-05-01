'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, ChevronLeft, AlertTriangle } from 'lucide-react';

const Test = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching data...');
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/test/pingAll`);
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
    fetchData();
  }, []);

  const getStatusIcon = (status) => {
    if (status === 'OK') {
      return <CheckCircle className="text-green-500" />;
    }
    return <XCircle className="text-red-500" />;
  };

  const getStatusColor = (status) => {
    return status === 'OK' ? 'bg-green-100 border-green-300 text-green-800' : 'bg-red-100 border-red-300 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">System Status</h1>
          <p className="mt-3 text-xl text-gray-500">Real-time monitoring of system components</p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-md bg-red-50 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">API Status Overview</h2>
              <p className="mt-1 text-sm text-gray-500">Current health status of all system components</p>
            </div>
            <div className="flex items-center">
              {loading ? (
                <RefreshCw className="animate-spin h-5 w-5 text-gray-500" />
              ) : (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${data?.status === "summary" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {data?.status}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="px-4 py-12 sm:px-6 text-center">
              <RefreshCw className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Loading status information...</p>
            </div>
          ) : data ? (
            <div className="border-t border-gray-200">
              <dl>
                {Object.entries(data.results || {}).map(([key, value], index) => (
                  <div key={key} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                    <dt className="text-sm font-medium text-gray-500 capitalize">{key}</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <div className="flex items-center">
                        {getStatusIcon(value)}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
                          {value}
                        </span>
                      </div>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <div className="px-4 py-5 sm:px-6 text-center">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={fetchData}
            className="inline-flex items-center px-4 py-2"
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>

          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="inline-flex items-center px-4 py-2"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        {data && (
          <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Raw Response Data</h3>
              <p className="mt-1 text-sm text-gray-500">JSON response from the API endpoint</p>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-xs">{JSON.stringify(data, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;