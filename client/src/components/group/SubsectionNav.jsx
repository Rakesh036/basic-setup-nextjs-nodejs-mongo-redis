"use client";
// components/group/SubsectionNav.jsx
import Link from 'next/link';
import { Video, Users, LayoutDashboard } from 'lucide-react';

const SUBSECTIONS = [
    {
        id: '',
        name: 'Overview',
        icon: LayoutDashboard
    },
    {
        id: 'members',
        name: 'Members',
        icon: Users
    },
    {
        id: 'videocall',
        name: 'Video Call',
        icon: Video
    }
];

export default function SubsectionNav({ groupId, activeSection }) {
    return (
        <div className="space-y-1">
            {SUBSECTIONS.map((section) => {
                const isActive = activeSection === section.id;

                return (
                    <Link
                        key={section.id}
                        href={`/group/${groupId}/${section.id}`}
                        className={`flex items-center py-2 px-3 text-sm rounded-md transition-colors ${isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                    >
                        <span className="mr-2">
                            <section.icon size={16} />
                        </span>
                        {section.name}
                    </Link>
                );
            })}
        </div>
    );
}