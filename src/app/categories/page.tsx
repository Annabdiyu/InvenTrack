'use client'
import { useEffect, useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { Plus, Search, Edit2, Trash2, Tag, X, Loader2 } from 'lucide-react'

interface Category {
    id: string
    name: string
    description: string | null
    _count?: { products: number }
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    })

    async function loadData() {
        setLoading(true)
        try {
            const res = await fetch('/api/categories')
            setCategories(await res.json())
        } catch (error) {
            console.error('Failed to load categories:', error)
        }
        setLoading(false)
    }

    useEffect(() => { loadData() }, [])

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    )

    function openAddModal() {
        setEditingId(null)
        setFormData({ name: '', description: '' })
        setIsModalOpen(true)
    }

    function openEditModal(category: Category) {
        setEditingId(category.id)
        setFormData({
            name: category.name,
            description: category.description || ''
        })
        setIsModalOpen(true)
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this category? Products in this category may be affected.')) return
        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setCategories(categories.filter(c => c.id !== id))
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to delete category')
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
            const url = editingId ? `/api/categories/${editingId}` : '/api/categories'
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
                alert(data.error || 'Failed to save category')
            }
        } catch (error) {
            console.error(error)
            alert('An error occurred')
        }
        setSaving(false)
    }

    return (
        <AppLayout title="Categories" subtitle="Group and organize products">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Categories</h1>
                    <p className="page-subtitle">{categories.length} categories total</p>
                </div>
                <button onClick={openAddModal} className="btn btn-primary">
                    <Plus size={16} /> Add Category
                </button>
            </div>

            <div className="card">
                <div className="toolbar">
                    <div className="search-box">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                        <div className="loading-spinner" />
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="empty-state">
                        <Tag size={36} />
                        <h3>No categories found</h3>
                        <p>Try adjusting your search or add a new category</p>
                        {categories.length === 0 && (
                            <button onClick={openAddModal} className="btn btn-primary mt-1" style={{ marginTop: 16 }}>
                                Add First Category
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th style={{ width: 100 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map(category => (
                                    <tr key={category.id}>
                                        <td>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{category.name}</div>
                                        </td>
                                        <td>
                                            <div className="truncate" style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 400 }}>
                                                {category.description || '—'}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button onClick={() => openEditModal(category)} className="btn-icon text-muted hover-accent">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(category.id)} className="btn-icon text-muted text-danger">
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
                            <h2 className="modal-title">{editingId ? 'Edit Category' : 'Add New Category'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="modal-close">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Category Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="btn btn-primary">
                                    {saving && <Loader2 size={16} className="loading-spinner" style={{ animation: 'spin 0.6s linear infinite', border: 'none', borderTop: 'none', width: 'auto', height: 'auto' }} />}
                                    {saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Category')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
