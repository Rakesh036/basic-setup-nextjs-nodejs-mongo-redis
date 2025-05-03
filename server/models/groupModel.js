// models/groupModel.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const MemberSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'rejected'],
        default: 'active'
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
});

const GroupSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Group name is required'],
        trim: true,
        maxlength: [50, 'Group name cannot be more than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Group description is required'],
        trim: true,
        maxlength: [500, 'Group description cannot be more than 500 characters']
    },
    image: {
        type: String,
        default: '/default-group.png'
    },
    cluster: {
        type: String,
        required: [true, 'Group category is required']
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [MemberSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field on save
GroupSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create the model only if it doesn't exist already
export default mongoose.models.Group || mongoose.model('Group', GroupSchema);