import { useState } from 'react'
import API from '../services/api'
import { useNavigate, Link } from 'react-router-dom'
import './styles.css'

function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await API.post('token/', form)
      localStorage.setItem('token', response.data.access)
      navigate('/dashboard')
    } catch (error) {
      console.log(error.response?.data || error.message)
      alert('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-panel">

        {/* Brand */}
        <div className="auth-logo">
          <div className="auth-logo-icon">tf</div>
          <span className="auth-logo-text">TaskFlow</span>
        </div>

        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-subheading">Sign in to your workspace</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="you@example.com"
              value={form.username}
              required
              autoComplete="username"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              required
              autoComplete="current-password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Create one free</Link>
        </p>
      </div>
    </div>
  )
}

export default Login