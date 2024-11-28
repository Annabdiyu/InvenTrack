'use client'
import { useEffect, useState } from 'react'
import AppLayout from '@/components/AppLayout'
import {
    Package, AlertTriangle, TrendingUp, Users, Tag,
    ArrowUp, ArrowDown, RefreshCw
} from 'lucide-react'
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts'

interface Stats {
    totalProducts: number
    lowStockCount: number
    totalCategories: number
    totalSuppliers: number
    totalValue: number
    recentTransactions: Array<{
        id: string
        type: string
        quantity: number
        note: string
        createdAt: string
        product: { name: string; sku: string }
    }>
    lowStockItems: Array<{ name: string; sku: string; quantity: number; minStock: number }>
}

function formatCurrency(n: number) {
    return 'ETB ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function typeColor(type: string) {
    if (type === 'IN') return 'badge-success'
    if (type === 'OUT') return 'badge-danger'
    return 'badge-info'
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    async function load() {
        setLoading(true)
        try {
            const res = await fetch('/api/dashboard/stats')
            const data = await res.json()
            if (res.ok) {
                setStats(data)
            } else {
                setStats(null)
                console.error('Failed to load dashboard stats:', data.error)
            }
        } catch (error) {
            console.error('Fetch error:', error)
            setStats(null)
        }
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    // Build chart data from recentTransactions (group by day)
    const chartData = (() => {
        if (!stats || !stats.recentTransactions) return []
        const map: Record<string, { date: string; IN: number; OUT: number }> = {}
        stats.recentTransactions.forEach((t) => {
            const date = new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            if (!map[date]) map[date] = { date, IN: 0, OUT: 0 }
            if (t.type === 'IN') map[date].IN += t.quantity
            if (t.type === 'OUT') map[date].OUT += t.quantity
        })
        return Object.values(map).slice(0, 7).reverse()
    })()

    return (
        <AppLayout title="Dashboard" subtitle="Overview of your inventory">
            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                    <div className="loading-spinner" />
                </div>
            ) : stats ? (
                <>
                    {/* Stat Cards */}
                    <div className="stat-grid">
                        <div className="stat-card">
                            <div className="stat-icon purple"><Package size={22} /></div>
                            <div>
                                <div className="stat-value">{stats.totalProducts}</div>
                                <div className="stat-label">Total Products</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon green"><TrendingUp size={22} /></div>
                            <div>
                                <div className="stat-value">{formatCurrency(stats.totalValue)}</div>
                                <div className="stat-label">Total Inventory Value</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon orange"><AlertTriangle size={22} /></div>
                            <div>
                                <div className="stat-value">{stats.lowStockCount}</div>
                                <div className="stat-label">Low Stock Items</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon blue"><Users size={22} /></div>
                            <div>
                                <div className="stat-value">{stats.totalSuppliers}</div>
                                <div className="stat-label">Suppliers</div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        {/* Chart */}
                        <div className="card chart-card">
                            <div className="flex items-center justify-between mb-4">
                                <div className="chart-title">Stock Movements (Recent)</div>
                                <button onClick={load} className="btn-icon text-muted"><RefreshCw size={15} /></button>
                            </div>
                            {chartData.length === 0 ? (
                                <div className="empty-state">
                                    <Package size={36} />
                                    <h3>No transactions yet</h3>
                                    <p>Record your first stock movement to see the chart</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={chartData} barSize={28}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                        <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
                                        <Bar dataKey="IN" fill="var(--success)" radius={[4, 4, 0, 0]} opacity={0.85} />
                                        <Bar dataKey="OUT" fill="var(--danger)" radius={[4, 4, 0, 0]} opacity={0.85} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Low Stock Alerts */}
                        <div className="card" style={{ padding: 20 }}>
                            <div className="chart-title flex items-center gap-2">
                                <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
                                Low Stock Alerts
                            </div>
                            {stats.lowStockItems.length === 0 ? (
                                <div className="empty-state" style={{ padding: '32px 0' }}>
                                    <Tag size={28} />
                                    <h3>All stocked up!</h3>
                                    <p>No items below minimum stock</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                                    {stats.lowStockItems.map((item) => (
                                        <div key={item.sku} className="alert alert-warning" style={{ marginBottom: 0 }}>
                                            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
                                                <div style={{ fontSize: 12, marginTop: 2 }}>
                                                    Stock: <strong>{item.quantity}</strong> / Min: {item.minStock}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="card" style={{ marginTop: 20 }}>
                        <div className="chart-title">Recent Transactions</div>
                        {stats.recentTransactions.length === 0 ? (
                            <div className="empty-state">
                                <ArrowUp size={28} />
                                <h3>No transactions yet</h3>
                                <p>Go to Transactions to record stock movements</p>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Type</th>
                                            <th>Qty</th>
                                            <th>Note</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentTransactions.map((t) => (
                                            <tr key={t.id}>
                                                <td>
                                                    <div style={{ fontWeight: 600 }}>{t.product.name}</div>
                                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.product.sku}</div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${typeColor(t.type)}`}>
                                                        {t.type === 'IN' ? <ArrowDown size={10} /> : t.type === 'OUT' ? <ArrowUp size={10} /> : <RefreshCw size={10} />}
                                                        {t.type}
                                                    </span>
                                                </td>
                                                <td style={{ fontWeight: 600 }}>{t.quantity}</td>
                                                <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{t.note || '—'}</td>
                                                <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                                                    {new Date(t.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="alert alert-danger">Failed to load dashboard stats.</div>
            )}
        </AppLayout>
    )
}
