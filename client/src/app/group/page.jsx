"use client"
import { useState, useEffect } from 'react';
import GroupList from '@/components/group/GroupList';
import GroupForm from '@/components/group/GroupForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CLUSTERS } from '@/lib/constants';
import { toast } from 'sonner';
import axios from 'axios';

export default function GroupPage() {
  const [groups, setGroups] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeCluster, setActiveCluster] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch groups from backend
  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/groups`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setGroups(response.data.groups);
      } else {
        toast.error(response.data.message || 'Failed to fetch groups');
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError(error.response?.data?.message || 'Failed to fetch groups');
      toast.error(error.response?.data?.message || 'Failed to fetch groups');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (newGroup) => {
    try {
      setGroups(prevGroups => [newGroup, ...prevGroups]);
      setIsCreateDialogOpen(false);
      toast.success('Group created successfully!');
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    }
  };

  const filteredGroups = activeCluster === 'all'
    ? groups
    : groups.filter(group => group.cluster === activeCluster);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Button
            onClick={fetchGroups}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Alumni Groups</h1>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          disabled={isLoading}
        >
          Create New Group
        </Button>
      </div>

      <div className="mb-6">
        <ul className="flex space-x-2 overflow-x-auto pb-2">
          <li>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeCluster === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              onClick={() => setActiveCluster('all')}
              disabled={isLoading}
            >
              All Groups
            </button>
          </li>
          {CLUSTERS.map(cluster => (
            <li key={cluster.id}>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${activeCluster === cluster.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                onClick={() => setActiveCluster(cluster.id)}
                disabled={isLoading}
              >
                {cluster.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <GroupList
          groups={filteredGroups}
          onCreateGroup={() => setIsCreateDialogOpen(true)}
        />
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <GroupForm
            onSubmit={handleCreateGroup}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}