import express from 'express';
import Group from '../models/groupModel.js';
import { isLoggedIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a new group
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const user = req.user;
        const { name, description, cluster, isPublic } = req.body;

        // Validate required fields
        if (!name || !description || !cluster) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                errors: {
                    name: !name ? 'Group name is required' : null,
                    description: !description ? 'Description is required' : null,
                    cluster: !cluster ? 'Category is required' : null
                }
            });
        }

        // Create new group with proper member structure
        const newGroup = new Group({
            name: name.trim(),
            description: description.trim(),
            cluster,
            isPublic: isPublic ?? true,
            owner: user._id,
            members: [{
                userId: user._id,
                role: 'admin',
                status: 'active',
                joinedAt: new Date()
            }]
        });

        // Save to database
        await newGroup.save();

        // Populate owner and members before sending response
        const populatedGroup = await Group.findById(newGroup._id)
            .populate('owner', 'name avatar')
            .populate('members.userId', 'name avatar');

        return res.status(201).json({
            success: true,
            message: 'Group created successfully',
            group: populatedGroup
        });

    } catch (error) {
        console.error('Error creating group:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = {};
            Object.keys(error.errors).forEach(key => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to create group'
        });
    }
});

// Get all groups
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find()
            .populate('owner', 'name avatar')
            .populate('members.userId', 'name avatar')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            groups
        });
    } catch (error) {
        console.error('Error fetching groups:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch groups'
        });
    }
});

// Get a specific group
router.get('/:id', async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
            .populate('owner', 'name avatar')
            .populate('members.userId', 'name avatar');

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        return res.status(200).json({
            success: true,
            group
        });
    } catch (error) {
        console.error('Error fetching group:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch group'
        });
    }
});

// Update a group
router.put('/:id', isLoggedIn, async (req, res) => {
    try {
        const user = req.user;
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Check if user is the owner
        if (group.owner.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this group'
            });
        }

        const updatedGroup = await Group.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    ...req.body,
                    updatedAt: new Date()
                }
            },
            {
                new: true,
                runValidators: true
            }
        )
            .populate('owner', 'name avatar')
            .populate('members.userId', 'name avatar');

        return res.status(200).json({
            success: true,
            group: updatedGroup
        });
    } catch (error) {
        console.error('Error updating group:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update group'
        });
    }
});

// Delete a group
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const user = req.user;
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Check if user is the owner
        if (group.owner.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this group'
            });
        }

        await Group.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Group deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting group:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete group'
        });
    }
});

// Join a group
router.post('/:id/join', isLoggedIn, async (req, res) => {
    try {
        const user = req.user;
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Check if user is already a member
        const isMember = group.members.some(member =>
            member.userId.toString() === user._id.toString()
        );

        if (isMember) {
            return res.status(400).json({
                success: false,
                message: 'You are already a member of this group'
            });
        }

        // Add user as member
        group.members.push({
            userId: user._id,
            role: 'member',
            status: group.isPublic ? 'active' : 'pending',
            joinedAt: new Date()
        });

        await group.save();

        // Populate the updated group
        const updatedGroup = await Group.findById(group._id)
            .populate('owner', 'name avatar')
            .populate('members.userId', 'name avatar');

        return res.status(200).json({
            success: true,
            message: group.isPublic ? 'Successfully joined the group' : 'Join request sent',
            group: updatedGroup
        });
    } catch (error) {
        console.error('Error joining group:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to join group'
        });
    }
});

// Leave a group
router.post('/:id/leave', isLoggedIn, async (req, res) => {
    try {
        const user = req.user;
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Check if user is the owner
        if (group.owner.toString() === user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Group owner cannot leave the group'
            });
        }

        // Remove user from members
        group.members = group.members.filter(member =>
            member.userId.toString() !== user._id.toString()
        );

        await group.save();

        // Populate the updated group
        const updatedGroup = await Group.findById(group._id)
            .populate('owner', 'name avatar')
            .populate('members.userId', 'name avatar');

        return res.status(200).json({
            success: true,
            message: 'Successfully left the group',
            group: updatedGroup
        });
    } catch (error) {
        console.error('Error leaving group:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to leave group'
        });
    }
});

export default router;