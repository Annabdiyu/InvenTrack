'use client'
import { useEffect, useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { Plus, Search, ArrowUp, ArrowDown, RefreshCw, ArrowLeftRight, X, Loader2 } from 'lucide-react'

interface Transaction {
    id: string
    type: string
    quantity: number
    note: string | null
    createdAt: string
    productId: string
    product: {
        name: string
        sku: string
    }
}

interface Product {
    id: string
    name: string
    sku: string
    quantity: number
    unit: string
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterType, setFilterType] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        productId: '',
        type: 'IN',
        quantity: 1,
        note: ''
    })

    async function loadData() {
        setLoading(true)
        try {
            const [transRes, prodRes] = await Promise.all([
                fetch('/api/transactions'),
                fetch('/api/products')
            ])
            setTransactions(await transRes.json())
            setProducts(await prodRes.json())
        } catch (error) {
            console.error('Failed to load data:', error)
        }
        setLoading(false)
    }

    useEffect(() => { loadData() }, [])

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.product?.name.toLowerCase().includes(search.toLowerCase()) ||
            t.product?.sku.toLowerCase().includes(search.toLowerCase()) ||
            (t.note && t.note.toLowerCase().includes(search.toLowerCase()))
        const matchesType = filterType ? t.type === filterType : true
        return matchesSearch && matchesType
    })

    function openAddModal() {
        setFormData({ productId: '', type: 'IN', quantity: 1, note: '' })
        setIsModalOpen(true)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setIsModalOpen(false)
                loadData()
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to record transaction')
            }
        } catch (error) {
            console.error(error)
            alert('An error occurred')
        }
        setSaving(false)
    }

    function typeIcon(type: string) {
        if (type === 'IN') return <ArrowDown size={14} />
        if (type === 'OUT') return <ArrowUp size={14} />
        return <RefreshCw size={14} />
    }

    function typeColor(type: string) {
        if (type === 'IN') return 'badge-success'
        if (type === 'OUT') return 'badge-danger'
        return 'badge-info'
    }

    return (
        <AppLayout title="Transactions" subtitle="Record and view stock movements">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Transactions</h1>
                    <p className="page-subtitle">{transactions.length} records</p>
                </div>
                <button onClick={openAddModal} className="btn btn-primary">
                    <Plus size={16} /> Record Transaction
                </button>
            </div>

            <div className="card">
                <div className="toolbar">
                    <div className="search-box">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search by product, SKU, or note..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="filter-select"
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="IN">Stock In</option>
                        <option value="OUT">Stock Out</option>
                        <option value="ADJUSTMENT">Adjustment</option>
                    </select>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                        <div className="loading-spinner" />
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="empty-state">
                        <ArrowLeftRight size={36} />
                        <h3>No transactions found</h3>
                        <p>Try adjusting your search or record a new stock movement</p>
                        {transactions.length === 0 && (
                            <button onClick={openAddModal} className="btn btn-primary mt-1" style={{ marginTop: 16 }}>
                                Record First Transaction
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Product</th>
                                    <th>Type</th>
                                    <th>Quantity</th>
                                    <th>Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map(t => (
                                    <tr key={t.id}>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                                            <div>{new Date(t.createdAt).toLocaleDateString()}</div>
                                            <div style={{ fontSize: 11, marginTop: 2 }}>{new Date(t.createdAt).toLocaleTimeString()}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.product?.name}</div>
                                            <div className="font-mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.product?.sku}</div>
                                        </td>
                                        <td>
                                            <span className={`badge ${typeColor(t.type)}`}>
                                                {typeIcon(t.type)} {t.type}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{t.quantity}</td>
                                        <td>
                                            <div className="truncate" style={{ maxWidth: 300, fontSize: 13, color: 'var(--text-secondary)' }}>
                                                {t.note || '—'}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Record Transaction</h2>
                            <button onClick={() => setIsModalOpen(false)} className="modal-close">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Product *</label>
                                <select
                                    required
                                    value={formData.productId}
                                    onChange={e => setFormData({ ...formData, productId: e.target.value })}
                                >
                                    <option value="" disabled>Select a product...</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} ({p.sku}) - Stock: {p.quantity} {p.unit}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Type *</label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="IN">Stock In</option>
                                        <option value="OUT">Stock Out</option>
                                        <option value="ADJUSTMENT">Adjustment (Set exact stock)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Quantity *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={formData.quantity}
                                        onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                                    />
                                    {formData.type === 'OUT' && (
                                        <div className="form-hint text-warning" style={{ color: 'var(--warning)' }}>Will reduce stock</div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Note</label>
                                <textarea
                                    rows={3}
                                    placeholder="Reason for stock movement..."
                                    value={formData.note}
                                    onChange={e => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="btn btn-primary">
                                    {saving && <Loader2 size={16} className="loading-spinner" style={{ animation: 'spin 0.6s linear infinite', border: 'none', borderTop: 'none', width: 'auto', height: 'auto' }} />}
                                    {saving ? 'Recording...' : 'Record Transaction'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
