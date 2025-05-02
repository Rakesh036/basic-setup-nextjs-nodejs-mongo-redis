import { CheckCircle, XCircle } from 'lucide-react';

export const Overview = ({ data }) => {
    const getStatusIcon = (status) => {
        if (status === 'OK') {
            return <CheckCircle className="text-green-500 h-5 w-5" />;
        }
        return <XCircle className="text-red-500 h-5 w-5" />;
    };

    if (!data?.results) return null;

    return (
        <div className="space-y-4">
            {Object?.entries(data.results)?.map(([service, info]) => (
                <div key={service} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold capitalize">{service}</h3>
                        <div className="flex items-center">
                            {getStatusIcon(info.status)}
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${info.status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {info.status}
                            </span>
                        </div>
                    </div>

                    {/* Service Details */}
                    <div className="mt-4 space-y-4">
                        {/* Platform Info */}
                        <div className="bg-gray-50 p-3 rounded">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Platform Information</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <p><span className="text-gray-600">OS:</span> {info?.service?.platform?.os}</p>
                                <p><span className="text-gray-600">Architecture:</span> {info?.service?.platform?.arch}</p>
                                <p><span className="text-gray-600">Release:</span> {info?.service?.platform?.release}</p>
                                <p><span className="text-gray-600">Type:</span> {info?.service?.platform?.type}</p>
                            </div>
                        </div>

                        {/* Network Info */}
                        <div className="bg-gray-50 p-3 rounded">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Network Information</h4>
                            {info.service.network.map((iface, index) => (
                                <div key={index} className="grid grid-cols-2 gap-2 text-sm">
                                    <p><span className="text-gray-600">Interface:</span> {iface?.interface}</p>
                                    <p><span className="text-gray-600">IP:</span> {iface?.address}</p>
                                    <p><span className="text-gray-600">Netmask:</span> {iface?.netmask}</p>
                                    <p><span className="text-gray-600">MAC:</span> {iface?.mac}</p>
                                </div>
                            ))}
                        </div>

                        {/* Service Specific Details */}
                        {info?.details && (
                            <div className="bg-gray-50 p-3 rounded">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Service Details</h4>
                                {service === 'mongo' && info?.details?.details && (
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <p><span className="text-gray-600">Host:</span> {info?.details?.details?.host}</p>
                                        <p><span className="text-gray-600">Port:</span> {info?.details?.details?.port}</p>
                                        <p><span className="text-gray-600">Database:</span> {info?.details?.details?.database}</p>
                                        <p><span className="text-gray-600">Connection String:</span> {info?.details?.details?.connectionString}</p>
                                    </div>
                                )}
                                {service === 'redis' && (
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <p className="font-medium text-gray-700">Server Info:</p>
                                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                                                {info?.details?.status}
                                            </pre>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-700">Memory Usage:</p>
                                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                                                {info?.details?.memory}
                                            </pre>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-700">Client Connections:</p>
                                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                                                {info?.details?.clients}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                                {service === 'frontend' && (
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <p><span className="text-gray-600">URL:</span> {info?.details?.url}</p>
                                        <p><span className="text-gray-600">Status:</span> {info?.details?.status}</p>
                                        <p><span className="text-gray-600">Status Text:</span> {info?.details?.statusText}</p>
                                        <p><span className="text-gray-600">Content Type:</span> {info?.details?.headers?.['content-type']}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}; 