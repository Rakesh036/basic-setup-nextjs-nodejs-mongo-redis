import { FaComments, FaBullhorn, FaUserTie, FaVideo, FaQuestion, FaThumbsUp, FaFile, FaUsers } from 'react-icons/fa';

// Subsection definitions
export const SUBSECTIONS = [
    { id: 'groupChat', name: 'Group Chat', icon: FaComments },
    // { id: 'announcements', name: 'Announcements', icon: FaBullhorn },
    // { id: 'talkToOwner', name: 'Talk to Owner', icon: FaUserTie },
    // { id: 'videoCall', name: 'Video Call', icon: FaVideo },
    // { id: 'quiz', name: 'Quiz', icon: FaQuestion },
    // { id: 'posts', name: 'Posts', icon: FaThumbsUp },
    // { id: 'resources', name: 'Resources', icon: FaFile },
    // { id: 'projectBuddy', name: 'Project Buddy', icon: FaUsers }
];

// Maximum character lengths
export const MAX_LENGTHS = {
    GROUP_NAME: 50,
    GROUP_DESCRIPTION: 500,
    MESSAGE: 1000,
    ANNOUNCEMENT_TITLE: 100,
    ANNOUNCEMENT_CONTENT: 2000,
    POST_CONTENT: 1000,
    RESOURCE_TITLE: 100,
    PROJECT_TITLE: 100,
    PROJECT_DESCRIPTION: 1000,
    MILESTONE_TITLE: 100,
    TASK_TITLE: 100
};

// Group clusters for filtering
export const CLUSTERS = [
    { id: 'tech', name: 'Technology' },
    { id: 'business', name: 'Business' },
    { id: 'creative', name: 'Creative Arts' },
    { id: 'science', name: 'Science' },
    { id: 'other', name: 'Other' }
];

// User roles in groups
export const ROLES = {
    OWNER: 'owner',
    MEMBER: 'member',
    PENDING: 'pending'
};

// Quiz question types
export const QUESTION_TYPES = {
    MULTIPLE_CHOICE: 'multiple-choice',
    TRUE_FALSE: 'true-false',
    SHORT_ANSWER: 'short-answer'
};

// Project task statuses
export const TASK_STATUSES = {
    NOT_STARTED: 'not-started',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
    BLOCKED: 'blocked'
};