// components/group/GroupList.jsx
import GroupCard from './GroupCard.jsx';

export default function GroupList({ groups, onCreateGroup }) {
    console.log('groups: ',groups);
    if (groups.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">No groups found</h3>
                <p className="text-gray-600 mb-4">Be the first to create a group in this category!</p>
                <button
                    onClick={onCreateGroup}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    Create a Group
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(group => (
                <GroupCard
                    key={group._id}
                    group={group}
                />
            ))}
        </div>
    );
}

