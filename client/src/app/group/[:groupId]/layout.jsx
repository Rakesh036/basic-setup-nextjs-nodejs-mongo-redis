"use client";
// app/group/[id]/layout.jsx

import { useState, useEffect, createContext, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaUsers, FaLock, FaChevronDown } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axios from 'axios';
import { formatMemberCount, getInitials } from '@/utils/formatters';
import SubsectionNav from '@/components/group/SubsectionNav';
import { toast } from 'sonner';

// Create context for group data
export const GroupContext = createContext();

export default function GroupLayout({ children, params }) {
    const router = useRouter();
    const pathname = usePathname();
    const groupId = pathname.split('/')[2];
    const [group, setGroup] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const pathParts = pathname.split('/');
        const section = pathParts[pathParts.length - 1];
        if (section === groupId || section.includes('[')) {
            setActiveSection('');
        } else {
            setActiveSection(section);
        }
    }, [pathname, groupId]);

    // Fetch group data
    useEffect(() => {
        fetchGroupFn();
    }, [groupId]);

    const fetchGroupFn = async () => {
        try {
            const fetchGroup = await axios.get(
                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/groups/${groupId}`,
                { withCredentials: true }
            );
            setGroup(fetchGroup.data.group);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching group data:", error);
            toast.error('Failed to load group data');
            setIsLoading(false);
        }
    };

    // Handle group leaving
    const handleLeaveGroup = async () => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/groups/${groupId}/leave`,
                {},
                { withCredentials: true }
            );

            if (response.data.success) {
                toast.success('Successfully left the group');
                router.push('/group');
            }
        } catch (error) {
            console.error('Error leaving group:', error);
            toast.error(error.response?.data?.message || 'Failed to leave group');
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex justify-center">
                <div className="animate-pulse text-xl">Loading group...</div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Group not found</h2>
                <Link href="/group" className="text-blue-600 hover:underline">
                    Return to group listing
                </Link>
            </div>
        );
    }

    return (
        <GroupContext.Provider value={{ group, setGroup }}>
            <div className="container mx-auto px-4 py-8">
                {/* Group Header */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Group Image */}
                            <div className="relative w-full md:w-40 h-40">
                                <div className="rounded-lg overflow-hidden w-full h-full bg-muted">
                                    {group.image ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={group.image}
                                                alt={group.name}
                                                fill
                                                className="object-cover"
                                                sizes='40px'
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full bg-primary/10">
                                            <FaUsers size={48} className="text-primary" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Group Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h1 className="text-2xl font-bold">{group.name}</h1>
                                    {!group.isPublic && (
                                        <FaLock className="text-muted-foreground" size={16} />
                                    )}
                                </div>

                                <p className="text-muted-foreground mb-4">{group.description}</p>

                                <div className="flex flex-wrap gap-4 items-center">
                                    {/* Owner info */}
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={group.owner.avatar} alt={group.owner.name} />
                                            <AvatarFallback>{getInitials(group.owner.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="text-sm font-medium">{group.owner.name}</div>
                                            <div className="text-xs text-muted-foreground">Owner</div>
                                        </div>
                                    </div>

                                    {/* Member count */}
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <FaUsers size={14} />
                                        <span>{formatMemberCount(group.members.length)}</span>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="ml-auto">
                                        <Button
                                            variant="outline"
                                            onClick={handleLeaveGroup}
                                            className="text-sm"
                                        >
                                            Leave Group
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Group Content with Navigation */}
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-64 shrink-0">
                        <Card className="sticky top-20">
                            <CardContent className="p-4">
                                <nav className="space-y-1">
                                    <SubsectionNav
                                        groupId={groupId}
                                        activeSection={activeSection}
                                    />
                                </nav>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Main Content */}
                    <div className="flex-1">
                        <Card>
                            <CardContent className="p-0">
                                {children}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </GroupContext.Provider>
    );
}