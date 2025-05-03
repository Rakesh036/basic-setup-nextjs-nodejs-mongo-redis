import { Container, Network } from 'lucide-react';

export const NetworkComponent = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Docker Status */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Docker Status</h3>
        <div className="bg-gray-50 p-3 rounded">
          <div className="flex items-center space-x-2">
            <Container
              className={`h-5 w-5 ${data.docker?.isDocker ? 'text-green-500' : 'text-gray-400'}`}
            />
            <p className="font-medium">
              Docker Environment: {data.docker?.isDocker ? 'Running in Docker' : 'Not in Docker'}
            </p>
          </div>
          {data.docker?.error && (
            <p className="text-sm text-red-600 mt-2">Error: {data.docker.error}</p>
          )}
        </div>
      </div>

      {/* Network Interfaces */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Network Interfaces</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.network?.map((iface, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <Network className="h-4 w-4 text-blue-500" />
                <p className="font-medium">{iface.interface}</p>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600">IP: {iface.address}</p>
                <p className="text-gray-600">Netmask: {iface.netmask}</p>
                <p className="text-gray-600">MAC: {iface.mac}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timestamp */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date(data.timestamp).toLocaleString()}
      </div>
    </div>
  );
};
