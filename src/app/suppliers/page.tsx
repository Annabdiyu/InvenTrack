'use client'
import { useEffect, useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { Plus, Search, Edit2, Trash2, Truck, X, Loader2 } from 'lucide-react'

interface Supplier {
    id: string
    name: string
    contact: string | null
    email: string | null
    phone: string | null
    address: string | null
}

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        email: '',
        phone: '',
        address: ''
    })

    async function loadData() {
        setLoading(true)
        try {
            const res = await fetch('/api/suppliers')
            setSuppliers(await res.json())
        } catch (error) {
            console.error('Failed to load suppliers:', error)
        }
        setLoading(false)
    }

    useEffect(() => { loadData() }, [])

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.email && s.email.toLowerCase().includes(search.toLowerCase())) ||
        (s.phone && s.phone.toLowerCase().includes(search.toLowerCase()))
    )

    function openAddModal() {
        setEditingId(null)
        setFormData({ name: '', contact: '', email: '', phone: '', address: '' })
        setIsModalOpen(true)
    }

    function openEditModal(supplier: Supplier) {
        setEditingId(supplier.id)
        setFormData({
            name: supplier.name,
            contact: supplier.contact || '',
            email: supplier.email || '',
            phone: supplier.phone || '',
            address: supplier.address || ''
        })
        setIsModalOpen(true)
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this supplier? Products linked to this supplier will lose their supplier reference.')) return
        try {
            const res = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setSuppliers(suppliers.filter(s => s.id !== id))
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to delete supplier')
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        try {
            const method = editingId ? 'PUT' : 'POST'
            const url = editingId ? `/api/suppliers/${editingId}` : '/api/suppliers'
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setIsModalOpen(false)
                loadData()
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to save supplier')
            }
        } catch (error) {
            console.error(error)
            alert('An error occurred')
        }
        setSaving(false)
    }

    return (
        <AppLayout title="Suppliers" subtitle="Manage your product sources">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Suppliers</h1>
                    <p className="page-subtitle">{suppliers.length} suppliers total</p>
                </div>
                <button onClick={openAddModal} className="btn btn-primary">
                    <Plus size={16} /> Add Supplier
                </button>
            </div>

            <div className="card">
                <div className="toolbar">
                    <div className="search-box">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search suppliers..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                        <div className="loading-spinner" />
                    </div>
                ) : filteredSuppliers.length === 0 ? (
                    <div className="empty-state">
                        <Truck size={36} />
                        <h3>No suppliers found</h3>
                        <p>Try adjusting your search or add a new supplier</p>
                        {suppliers.length === 0 && (
                            <button onClick={openAddModal} className="btn btn-primary mt-1" style={{ marginTop: 16 }}>
                                Add First Supplier
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Contact Person</th>
                                    <th>Contact Info</th>
                                    <th>Address</th>
                                    <th style={{ width: 100 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSuppliers.map(supplier => (
                                    <tr key={supplier.id}>
                                        <td>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{supplier.name}</div>
                                        </td>
                                        <td>{supplier.contact || '—'}</td>
                                        <td>
                                            <div style={{ fontSize: 13 }}>
                                                {supplier.email && <div>{supplier.email}</div>}
                                                {supplier.phone && <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{supplier.phone}</div>}
                                                {!supplier.email && !supplier.phone && <span className="text-muted">—</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="truncate" style={{ maxWidth: 200, fontSize: 13, color: 'var(--text-secondary)' }}>
                                                {supplier.address || '—'}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button onClick={() => openEditModal(supplier)} className="btn-icon text-muted hover-accent">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(supplier.id)} className="btn-icon text-muted text-danger">
                                                    <Trash2 size={16} />
                                                </button>
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
                            <h2 className="modal-title">{editingId ? 'Edit Supplier' : 'Add New Supplier'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="modal-close">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Supplier Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Contact Person</label>
                                    <input
                                        type="text"
                                        value={formData.contact}
                                        onChange={e => setFormData({ ...formData, contact: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Address</label>
                                <textarea
                                    rows={2}
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="btn btn-primary">
                                    {saving && <Loader2 size={16} className="loading-spinner" style={{ animation: 'spin 0.6s linear infinite', border: 'none', borderTop: 'none', width: 'auto', height: 'auto' }} />}
                                    {saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Supplier')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
