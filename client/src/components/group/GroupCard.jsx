"use client"
// components/group/GroupCard.jsx
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CLUSTERS } from '@/lib/constants';
import { useSelector } from "react-redux";
import axios from 'axios';
import { toast } from 'sonner';

export default function GroupCard({ group }) {
    console.log('group: ', group);
    const userId = useSelector((state) => state.auth?.user?.id);
    // console.log('t:',t);
    const [isJoined, setIsJoined] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const clusterObj = CLUSTERS.find(c => c.id === group.cluster) || { name: 'Miscellaneous' };

    const handleJoin = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!userId) {
            toast.error('Please login to join groups');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/groups/${group._id}/join`,
                {},
                { withCredentials: true }
            );

            if (response.data.success) {
                if (group.isPublic) {
                    setIsJoined(true);
                    toast.success('Successfully joined the group');
                } else {
                    setIsPending(true);
                    toast.success('Join request sent');
                }
            }
        } catch (error) {
            console.error('Error joining group:', error);
            toast.error(error.response?.data?.message || 'Failed to join group');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (group?.members && userId) {
            const member = group.members.find(m => m.userId._id === userId);
            if (member) {
                setIsJoined(member.status === 'active');
                setIsPending(member.status === 'pending');
            }
        }
    }, [group, userId]);


    return (
        <Link href={`/group/${group._id}`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                <div className="h-40 bg-gray-200 relative">
                    {group.image && (
                        <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute top-3 left-3">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {clusterObj.name}
                        </span>
                    </div>
                    <div className="absolute top-3 right-3">
                        <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded ${group.isPublic ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {group.isPublic ? 'Public' : 'Private'}
                        </span>
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{group.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{group.description}</p>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                                    <img src={group.owner.avatar || "avatar.webp"} alt={group.owner.name} className="w-full h-full object-cover" />
                                </div>
                                {group.members.slice(1, 2).map((member, index) => (
                                    <div key={member._id} className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                                        <img src={member.avatar || "avatar.webp"} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                {group.members.length > 2 && (
                                    <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                                        +{group.members.length - 2}
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-gray-600 ml-2">
                                {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                            </span>
                        </div>

                        <Button
                            variant={isJoined ? "outline" : "default"}
                            size="sm"
                            onClick={handleJoin}
                            disabled={isLoading || isPending || isJoined}
                        >
                            {isLoading ? 'Joining...' : isJoined ? 'Joined' : isPending ? 'Pending' : 'Join'}
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
