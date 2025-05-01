'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, ChevronLeft, AlertTriangle, Server, Database, Globe, Info } from 'lucide-react';

const Test = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = async (endpoint = 'pingAll') => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching data...');
      const res = await fetch(`/api/test/${endpoint}`, {
        credentials: 'include',
      })
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
      return <CheckCircle className="text-green-500 h-5 w-5" />;
    }
    return <XCircle className="text-red-500 h-5 w-5" />;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const renderConnectionInfo = () => {
    if (!data?.service?.connectionInfo) return null;
    const { internal, external, api } = data.service.connectionInfo;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Internal Connections</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-blue-700">Docker Network</p>
                <p className="text-sm text-blue-600">{internal.docker.url}</p>
                <p className="text-xs text-blue-500">{internal.docker.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Localhost</p>
                <p className="text-sm text-blue-600">{internal.localhost.url}</p>
                <p className="text-xs text-blue-500">{internal.localhost.description}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">External Connection</h3>
            <div>
              <p className="text-sm font-medium text-green-700">URL</p>
              <p className="text-sm text-green-600">{external.url}</p>
              <p className="text-xs text-green-500">{external.description}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">Available API Endpoints</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {api.endpoints.map((endpoint, index) => (
              <div key={index} className="bg-white p-2 rounded">
                <p className="text-sm font-medium text-purple-700">{endpoint.path}</p>
                <p className="text-xs text-purple-500">{endpoint.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSystemInfo = () => {
    if (!data?.service) return null;
    const { platform, memory, uptime, network } = data.service;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Platform Information</h3>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium">OS:</span> {platform.os}</p>
              <p className="text-sm"><span className="font-medium">Architecture:</span> {platform.arch}</p>
              <p className="text-sm"><span className="font-medium">Release:</span> {platform.release}</p>
              <p className="text-sm"><span className="font-medium">Type:</span> {platform.type}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Memory Usage</h3>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium">Total:</span> {formatBytes(memory.total)}</p>
              <p className="text-sm"><span className="font-medium">Free:</span> {formatBytes(memory.free)}</p>
              <p className="text-sm"><span className="font-medium">Used:</span> {formatBytes(memory.used)}</p>
              <p className="text-sm"><span className="font-medium">Uptime:</span> {formatUptime(uptime)}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Network Interfaces</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {network.map((iface, index) => (
              <div key={index} className="bg-white p-3 rounded">
                <p className="text-sm font-medium">{iface.interface}</p>
                <p className="text-xs text-gray-600">IP: {iface.address}</p>
                <p className="text-xs text-gray-600">MAC: {iface.mac}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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

        <div className="mb-8 flex justify-center space-x-4">
          <Button
            onClick={() => { setActiveTab('overview'); fetchData('pingAll'); }}
            className={`inline-flex items-center px-4 py-2 ${activeTab === 'overview' ? 'bg-blue-600' : ''}`}
          >
            <Server className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button
            onClick={() => { setActiveTab('connection'); fetchData('connectionInfo'); }}
            className={`inline-flex items-center px-4 py-2 ${activeTab === 'connection' ? 'bg-blue-600' : ''}`}
          >
            <Globe className="mr-2 h-4 w-4" />
            Connection Info
          </Button>
          <Button
            onClick={() => { setActiveTab('system'); fetchData('serviceInfo'); }}
            className={`inline-flex items-center px-4 py-2 ${activeTab === 'system' ? 'bg-blue-600' : ''}`}
          >
            <Info className="mr-2 h-4 w-4" />
            System Info
          </Button>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
          {loading ? (
            <div className="px-4 py-12 sm:px-6 text-center">
              <RefreshCw className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Loading status information...</p>
            </div>
          ) : (
            <div className="px-4 py-5 sm:px-6">
              {activeTab === 'overview' && data?.results && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(data.results).map(([key, value]) => (
                          <tr key={key}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{key}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getStatusIcon(value.status)}
                              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value.status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {value.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(value.details || value.service, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'connection' && renderConnectionInfo()}
                {activeTab === 'system' && renderSystemInfo()}
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => fetchData(activeTab === 'overview' ? 'pingAll' : activeTab === 'connection' ? 'connectionInfo' : 'serviceInfo')}
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
      </div>
    </div>
  );
};

export default Test;