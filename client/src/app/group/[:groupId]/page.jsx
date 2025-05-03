"use client";
import { useContext } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/formatters';
import { GroupContext } from './layout';

export default function GroupDetailPage() {
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
            <h2 className="text-2xl font-bold mb-6">Group Overview</h2>

            <div className="grid gap-6">
                {/* Group Description */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">About</h3>
                        <p className="text-gray-600">{group.description}</p>
                    </CardContent>
                </Card>

                {/* Group Members */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Members</h3>
                        <div className="space-y-4">
                            {group.members.map((member) => (
                                <div key={member._id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={member.userId.avatar} />
                                            <AvatarFallback>{getInitials(member.userId.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{member.userId.name}</p>
                                            <p className="text-sm text-gray-500">{member.role}</p>
                                        </div>
                                    </div>
                                    {member.status === 'pending' && (
                                        <span className="text-sm text-yellow-600">Pending</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
