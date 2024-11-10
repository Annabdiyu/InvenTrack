'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BarChart3, Mail, Lock, Loader2 } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        const res = await signIn('credentials', { email, password, redirect: false })
        setLoading(false)
        if (res?.error) setError('Invalid email or password')
        else router.push('/dashboard')
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <div className="login-logo-icon">
                        <BarChart3 size={22} color="#fff" />
                    </div>
                    <div>
                        <div className="login-title">InvenTrack</div>
                    </div>
                </div>
                <p className="login-subtitle">Sign in to manage your inventory</p>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@inven.com"
                                style={{ paddingLeft: 38 }}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ paddingLeft: 38 }}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? <Loader2 size={16} style={{ animation: 'spin 0.6s linear infinite' }} /> : 'Sign in'}
                    </button>
                </form>

                <div className="demo-creds">
                    <strong>Demo credentials:</strong><br />
                    Email: <strong>admin@inven.com</strong><br />
                    Password: <strong>admin123</strong>
                </div>
            </div>
        </div>
    )
}
