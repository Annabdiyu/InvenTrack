'use client'
import { signOut, useSession } from 'next-auth/react'
import { LogOut } from 'lucide-react'

interface HeaderProps {
    title: string
    subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
    const { data: session } = useSession()
    const initials = session?.user?.name
        ? session.user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U'

    return (
        <header className="header">
            <div>
                <div className="header-title">{title}</div>
                {subtitle && <div className="header-subtitle">{subtitle}</div>}
            </div>
            <div className="header-actions">
                <div className="sidebar-footer" style={{ padding: 0, border: 'none' }}>
                    <div className="user-card">
                        <div className="user-avatar">{initials}</div>
                        <div className="user-info">
                            <div className="user-name">{session?.user?.name ?? 'User'}</div>
                            <div className="user-role">{(session?.user as any)?.role ?? 'Staff'}</div>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="btn-icon"
                            title="Sign out"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
