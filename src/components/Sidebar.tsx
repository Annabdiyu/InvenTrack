'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Package,
    Tag,
    Truck,
    ArrowLeftRight,
    BarChart3,
} from 'lucide-react'

const nav = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/categories', label: 'Categories', icon: Tag },
    { href: '/suppliers', label: 'Suppliers', icon: Truck },
    { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
]

export default function Sidebar() {
    const pathname = usePathname()
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <BarChart3 size={20} color="#fff" />
                </div>
                <div>
                    <div className="sidebar-logo-text">InvenTrack</div>
                    <div className="sidebar-logo-sub">Inventory Management</div>
                </div>
            </div>
            <nav className="sidebar-nav">
                <div className="sidebar-section">
                    <div className="sidebar-section-label">Main</div>
                    {nav.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`nav-item ${pathname.startsWith(href) ? 'active' : ''}`}
                        >
                            <Icon size={18} className="nav-icon" />
                            {label}
                        </Link>
                    ))}
                </div>
            </nav>
        </aside>
    )
}
