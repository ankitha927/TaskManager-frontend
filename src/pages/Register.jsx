
import { useState } from 'react'
import API from '../services/api'
import { useNavigate, Link } from 'react-router-dom'
import './styles.css'

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      await API.post('users/register/', form)

      alert('Registration successful!')
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

        <div className="auth-logo">
          <div className="auth-logo-icon">tf</div>
          <span className="auth-logo-text">TaskFlow</span>
        </div>

        <h1 className="auth-heading">Create account</h1>
        <p className="auth-subheading">Get started — it's free</p>

        <form onSubmit={handleSubmit}>

          {/* Username */}
          <div className="form-group">
            <label className="form-label">Username</label>

            <input
              type="text"
              className="form-input"
              placeholder="Choose a username"
              value={form.username}
              required
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>

            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={form.email}
              required
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>

            <input
              type="password"
              className="form-input"
              placeholder="Min. 8 characters"
              value={form.password}
              required
              minLength={8}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
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

