"use client"

// components/group/GroupForm.jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CLUSTERS, MAX_LENGTHS } from '@/lib/constants';
import { toast } from 'sonner';
import axios from 'axios';

export default function GroupForm({ initialData, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        cluster: initialData?.cluster || '',
        isPublic: initialData?.isPublic ?? true,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleClusterChange = (value) => {
        setFormData(prev => ({ ...prev, cluster: value }));
        if (errors.cluster) {
            setErrors(prev => ({ ...prev, cluster: null }));
        }
    };

    const handlePublicToggle = (checked) => {
        setFormData(prev => ({ ...prev, isPublic: checked }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Group name is required';
        } else if (formData.name.length > MAX_LENGTHS.GROUP_NAME) {
            newErrors.name = `Group name must be ${MAX_LENGTHS.GROUP_NAME} characters or less`;
        }

        // Description validation
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length > MAX_LENGTHS.GROUP_DESCRIPTION) {
            newErrors.description = `Description must be ${MAX_LENGTHS.GROUP_DESCRIPTION} characters or less`;
        }

        // Cluster validation
        if (!formData.cluster) {
            newErrors.cluster = 'Please select a category';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/groups`,
                {
                    name: formData.name.trim(),
                    description: formData.description.trim(),
                    cluster: formData.cluster,
                    isPublic: formData.isPublic
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Group created successfully!');
                onSubmit(response.data.group);
            } else {
                toast.error(response.data.message || 'Failed to create group');
            }
        } catch (error) {
            console.error('Error creating group:', error);

            // Handle validation errors from backend
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error(error.response?.data?.message || 'Failed to create group');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter group name"
                    maxLength={MAX_LENGTHS.GROUP_NAME}
                    disabled={isSubmitting}
                    className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                <p className="text-gray-500 text-sm">{formData.name.length}/{MAX_LENGTHS.GROUP_NAME}</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="What is your group about?"
                    rows={4}
                    maxLength={MAX_LENGTHS.GROUP_DESCRIPTION}
                    disabled={isSubmitting}
                    className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                <p className="text-gray-500 text-sm">{formData.description.length}/{MAX_LENGTHS.GROUP_DESCRIPTION}</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="cluster">Category</Label>
                <Select
                    value={formData.cluster}
                    onValueChange={handleClusterChange}
                    disabled={isSubmitting}
                >
                    <SelectTrigger
                        id="cluster"
                        className={errors.cluster ? 'border-red-500' : ''}
                    >
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {CLUSTERS.map(cluster => (
                            <SelectItem key={cluster.id} value={cluster.id}>
                                {cluster.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.cluster && <p className="text-red-500 text-sm">{errors.cluster}</p>}
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={handlePublicToggle}
                    disabled={isSubmitting}
                />
                <Label htmlFor="isPublic" className="cursor-pointer">
                    Make this group public
                </Label>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating...' : (initialData ? 'Update Group' : 'Create Group')}
                </Button>
            </div>
        </form>
    );
}