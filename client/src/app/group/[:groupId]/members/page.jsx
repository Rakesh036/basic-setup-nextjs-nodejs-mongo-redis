"use client";
import { useContext } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/formatters';
import { GroupContext } from '../layout';

export default function MembersPage() {
    const { group } = useContext(GroupContext);

    if (!group) {
        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold text-red-600">Group not found</h2>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Members</h2>
                <div className="text-sm text-gray-500">
                    {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                </div>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {group.members.map((member) => (
                            <div key={member._id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={member.userId.avatar} />
                                        <AvatarFallback>{getInitials(member.userId.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{member.userId.name}</p>
                                        <p className="text-sm text-gray-500">{member.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {member.status === 'pending' && (
                                        <span className="text-sm text-yellow-600">Pending</span>
                                    )}
                                    {member.role === 'admin' && (
                                        <span className="text-sm text-blue-600">Admin</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 