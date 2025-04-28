'use client'
import { useEffect, useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { Plus, Search, Edit2, Trash2, Package, X, Loader2 } from 'lucide-react'

interface Product {
    id: string
    name: string
    sku: string
    description: string
    quantity: number
    minStock: number
    price: number
    unit: string
    categoryId: string | null
    supplierId: string | null
    category?: { name: string }
    supplier?: { name: string }
}

interface Category {
    id: string
    name: string
}

interface Supplier {
    id: string
    name: string
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [suppliers, setSuppliers] = useState<Supplier[]>([])

    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterCategory, setFilterCategory] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        description: '',
        quantity: 0,
        minStock: 10,
        price: 0,
        unit: 'pcs',
        categoryId: '',
        supplierId: ''
    })

    async function loadData() {
        setLoading(true)
        try {
            const [prodRes, catRes, supRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/categories'),
                fetch('/api/suppliers')
            ])
            setProducts(await prodRes.json())
            setCategories(await catRes.json())
            setSuppliers(await supRes.json())
        } catch (error) {
            console.error('Failed to load data:', error)
        }
        setLoading(false)
    }

    useEffect(() => { loadData() }, [])

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = filterCategory ? p.categoryId === filterCategory : true
        return matchesSearch && matchesCategory
    })

    function openAddModal() {
        setEditingId(null)
        setFormData({
            name: '', sku: '', description: '', quantity: 0, minStock: 10, price: 0, unit: 'pcs', categoryId: '', supplierId: ''
        })
        setIsModalOpen(true)
    }

    function openEditModal(product: Product) {
        setEditingId(product.id)
        setFormData({
            name: product.name,
            sku: product.sku,
            description: product.description || '',
            quantity: product.quantity,
            minStock: product.minStock,
            price: product.price,
            unit: product.unit,
            categoryId: product.categoryId || '',
            supplierId: product.supplierId || ''
        })
        setIsModalOpen(true)
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this product? All related transactions will also be deleted.')) return
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id))
            } else {
                alert('Failed to delete product')
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
            const url = editingId ? `/api/products/${editingId}` : '/api/products'
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
                alert(data.error || 'Failed to save product')
            }
        } catch (error) {
            console.error(error)
            alert('An error occurred')
        }
        setSaving(false)
    }

    return (
        <AppLayout title="Products" subtitle="Manage your inventory items">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Products</h1>
                    <p className="page-subtitle">{products.length} items total</p>
                </div>
                <button onClick={openAddModal} className="btn btn-primary">
                    <Plus size={16} /> Add Product
                </button>
            </div>

            <div className="card">
                <div className="toolbar">
                    <div className="search-box">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="filter-select"
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                        <div className="loading-spinner" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="empty-state">
                        <Package size={36} />
                        <h3>No products found</h3>
                        <p>Try adjusting your search or add a new product</p>
                        {products.length === 0 && (
                            <button onClick={openAddModal} className="btn btn-primary mt-1" style={{ marginTop: 16 }}>
                                Add First Product
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>SKU</th>
                                    <th>Category & Supplier</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th style={{ width: 100 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product.id}>
                                        <td>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{product.name}</div>
                                            {product.description && (
                                                <div className="truncate" style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 200 }}>
                                                    {product.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="font-mono">{product.sku}</td>
                                        <td>
                                            <div style={{ fontSize: 13 }}>
                                                {product.category?.name ? (
                                                    <span className="badge badge-purple mb-4" style={{ marginBottom: 4 }}>
                                                        {product.category.name}
                                                    </span>
                                                ) : <span className="text-muted">—</span>}
                                            </div>
                                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                                {product.supplier?.name || ''}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 500 }}>
                                            ETB {product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontWeight: 600 }}>{product.quantity}</span>
                                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{product.unit}</span>
                                            </div>
                                            {product.quantity <= product.minStock && (
                                                <span className="badge badge-warning" style={{ marginTop: 4 }}>Low Stock</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button onClick={() => openEditModal(product)} className="btn-icon text-muted hover-accent">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} className="btn-icon text-muted text-danger">
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
                            <h2 className="modal-title">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="modal-close">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Product Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">SKU *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.sku}
                                        onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                    />
                                    <div className="form-hint">Unique identifier</div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        <option value="">None</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Supplier</label>
                                    <select
                                        value={formData.supplierId}
                                        onChange={e => setFormData({ ...formData, supplierId: e.target.value })}
                                    >
                                        <option value="">None</option>
                                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row" style={{ marginTop: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Initial Quantity {editingId && '(Edit only if adjustment)'}</label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={formData.quantity}
                                        onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Unit</label>
                                    <input
                                        type="text"
                                        placeholder="pcs, kg, box..."
                                        value={formData.unit}
                                        onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Min Stock Alert</label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={formData.minStock}
                                        onChange={e => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: 16 }}>
                                <label className="form-label">Description</label>
                                <textarea
                                    rows={3}
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
                                    {saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
