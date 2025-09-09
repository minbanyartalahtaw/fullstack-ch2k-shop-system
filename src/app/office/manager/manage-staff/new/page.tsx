'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AppIcon } from '@/components/app-icons'
import { createStaff, StaffFormData } from './action'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default function Page() {
    const [formData, setFormData] = useState<StaffFormData>({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        role: 'STAFF',
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const updateFormData = (field: keyof StaffFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const result = await createStaff(formData)

            if (result.success) {
                toast.success('Staff member added successfully')
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    password: '',
                    role: 'STAFF',
                })
            } else {
                toast.error(result.validationErrors?.join(', ') || 'Failed to add staff member')
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full h-full overflow-auto px-2">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AppIcon name="staffAdd" className="h-5 w-5" />
                        ဝန်ထမ်းအသစ်လုပ်ရန်
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">ဝန်ထမ်းအမည်</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => updateFormData('name', e.target.value)}
                                        placeholder="Enter staff name"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email (Optional)</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={(e) => updateFormData('email', e.target.value)}
                                        placeholder="Enter email address"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">ဖုန်းနံပါတ်</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => updateFormData('phone', e.target.value)}
                                        placeholder="Enter phone number"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">လိပ်စာ</Label>
                                    <Textarea
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => updateFormData('address', e.target.value)}
                                        placeholder="Enter address"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => updateFormData('password', e.target.value)}
                                        placeholder="Enter password"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select
                                        value={formData.role}
                                        onValueChange={(value) => updateFormData('role', value)}
                                    >
                                        <SelectTrigger id="role">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="STAFF">Staff</SelectItem>
                                            <SelectItem value="MANAGER">Manager</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="flex items-center gap-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Adding...' : 'Add Staff'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}


