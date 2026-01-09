'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UsersTableProps {
    users: any[]
}

export function UsersTable({ users }: UsersTableProps) {
    const router = useRouter()
    const supabase = createClient()
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    // State for confirmation dialog
    const [pendingUpdate, setPendingUpdate] = useState<{ userId: string, newRole: string } | null>(null)

    const handleRoleSelect = (userId: string, newRole: string) => {
        // Instead of confirm(), we set state to open the dialog
        setPendingUpdate({ userId, newRole })
    }

    const executeRoleUpdate = async () => {
        if (!pendingUpdate) return

        const { userId, newRole } = pendingUpdate
        setUpdatingId(userId)
        setPendingUpdate(null) // Close dialog immediately or wait? Better close to show loader in table

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId)

            if (error) throw error
            router.refresh()
        } catch (e) {
            console.error(e)
            alert('Failed to update role')
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider text-gray-500">User</th>
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider text-gray-500">Contact</th>
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider text-gray-500">Location</th>
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider text-gray-500">Role</th>
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4">
                                    <div className="font-medium text-gray-900">{user.full_name || 'No Name'}</div>
                                    <div className="text-xs text-muted-foreground">ID: {user.id.slice(0, 8)}...</div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {user.phone || '-'}
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {user.city || '-'}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                            user.role === 'staff' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end">
                                        <select
                                            disabled={updatingId === user.id}
                                            value={user.role}
                                            onChange={(e) => handleRoleSelect(user.id, e.target.value)}
                                            className="text-sm border rounded-md px-2 py-1 bg-white focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer hover:border-gray-400 transition-colors disabled:opacity-50"
                                        >
                                            <option value="user">User</option>
                                            <option value="staff">Staff</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        {updatingId === user.id && <Loader2 className="ml-2 w-4 h-4 animate-spin text-muted-foreground" />}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AlertDialog open={!!pendingUpdate} onOpenChange={(open) => !open && setPendingUpdate(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change User Role?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to change the role of this user to <span className="font-bold text-foreground">{pendingUpdate?.newRole}</span>?
                            {pendingUpdate?.newRole === 'admin' && " This will give them full access to the dashboard."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={executeRoleUpdate}>Confirm Change</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
