import { createClient } from '@/utils/supabase/server'
import { UsersTable } from "@/components/admin/users-table"

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
    const supabase = await createClient()
    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">User Management</h1>
            <UsersTable users={users || []} />
        </div>
    )
}
