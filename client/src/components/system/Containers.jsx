import { Container, Volume } from 'lucide-react';

export const Containers = ({ data }) => {
    if (!data) return null;

    return (
        <div className="space-y-6">
            {/* Connected Containers */}
            {data.containers && data.containers.length > 0 ? (
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Connected Containers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.containers.map((container, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Container className="h-4 w-4 text-blue-500" />
                                    <p className="font-medium">{container.name}</p>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <p className="text-gray-600">ID: {container.id}</p>
                                    <p className="text-gray-600">IP: {container.ip}</p>
                                    <p className="text-gray-600">Network: {container.network}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-center py-8">
                        <Container className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No containers found</p>
                    </div>
                </div>
            )}

            {/* Mounted Volumes */}
            {data.volumes && data.volumes.length > 0 ? (
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Mounted Volumes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.volumes.map((volume, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Volume className="h-4 w-4 text-blue-500" />
                                    <p className="font-medium">Type: {volume.type}</p>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <p className="text-gray-600">Source: {volume.source}</p>
                                    <p className="text-gray-600">Destination: {volume.destination}</p>
                                    <p className="text-gray-600">Read Only: {volume.readOnly ? 'Yes' : 'No'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-center py-8">
                        <Volume className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No volumes found</p>
                    </div>
                </div>
            )}

            {/* Timestamp */}
            <div className="text-center text-sm text-gray-500">
                Last updated: {new Date(data.timestamp).toLocaleString()}
            </div>
        </div>
    );
}; 