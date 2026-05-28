import { useState } from 'react'
import API from '../services/api'
import { useNavigate, Link } from 'react-router-dom'
import './styles.css'

function Register() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await API.post('register/', form)
      navigate('/login')
    } catch (error) {
      console.log(error.response?.data || error.message)
      alert('Registration failed. Please try again.')
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

        <h1 className="auth-heading">Create account</h1>
        <p className="auth-subheading">Get started — it's free</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="Choose a username"
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
              placeholder="Min. 8 characters"
              value={form.password}
              required
              minLength={8}
              autoComplete="new-password"
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
                Creating account…
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register