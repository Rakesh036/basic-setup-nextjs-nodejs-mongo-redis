'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ChevronLeft, AlertTriangle, Server, Network, Container } from 'lucide-react';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { Overview } from '@/components/system/Overview';
import { Containers } from '@/components/system/Containers';
import { NetworkComponent  } from '@/components/system/Network';

const Test = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data, loading, error, fetchData } = useSystemStatus(
    activeTab === 'overview' ? 'pingAll' : activeTab === 'network' ? 'network' : 'containers'
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchData(tab === 'overview' ? 'pingAll' : tab === 'network' ? 'network' : 'containers');
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
            onClick={() => handleTabChange('overview')}
            className={`inline-flex items-center px-4 py-2 ${activeTab === 'overview' ? 'bg-blue-600' : ''}`}
          >
            <Server className="mr-2 h-4 w-4" />
            Services
          </Button>
          <Button
            onClick={() => handleTabChange('network')}
            className={`inline-flex items-center px-4 py-2 ${activeTab === 'network' ? 'bg-blue-600' : ''}`}
          >
            <Network className="mr-2 h-4 w-4" />
            Network
          </Button>
          <Button
            onClick={() => handleTabChange('containers')}
            className={`inline-flex items-center px-4 py-2 ${activeTab === 'containers' ? 'bg-blue-600' : ''}`}
          >
            <Container className="mr-2 h-4 w-4" />
            Containers
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
                {activeTab === 'overview' && <Overview data={data} />}
                {activeTab === 'network' && <NetworkComponent data={data} />}
                {activeTab === 'containers' && <Containers data={data} />}
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => fetchData(activeTab === 'overview' ? 'pingAll' : activeTab === 'network' ? 'network' : 'containers')}
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