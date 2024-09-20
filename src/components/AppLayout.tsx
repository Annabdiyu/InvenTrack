'use client'
import { SessionProvider } from 'next-auth/react'
import Sidebar from './Sidebar'
import Header from './Header'

interface AppLayoutProps {
    children: React.ReactNode
    title: string
    subtitle?: string
}

export default function AppLayout({ children, title, subtitle }: AppLayoutProps) {
    return (
        <SessionProvider>
            <div className="app-layout">
                <Sidebar />
                <div className="main-content">
                    <Header title={title} subtitle={subtitle} />
                    <main className="page-body">{children}</main>
                </div>
            </div>
        </SessionProvider>
    )
}
