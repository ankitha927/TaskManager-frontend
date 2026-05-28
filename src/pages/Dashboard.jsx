import { useEffect, useState } from 'react'
import API from '../services/api'
import './styles.css'

/* ── Priority badge helper ── */
function PriorityBadge({ priority }) {
  const map = {
    High:   'badge badge-high',
    Medium: 'badge badge-medium',
    Low:    'badge badge-low',
  }
  return (
    <span className={map[priority] || 'badge badge-medium'}>
      <span className="badge-dot" />
      {priority}
    </span>
  )
}

/* ── Status badge helper ── */
function StatusBadge({ completed }) {
  return completed
    ? <span className="badge badge-done"><span className="badge-dot" />Done</span>
    : <span className="badge badge-pending"><span className="badge-dot" />Pending</span>
}

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', priority: 'Medium', due_date: ''
  })

  const fetchTasks = async () => {
    const response = await API.get('tasks/')
    setTasks(response.data)
  }

  useEffect(() => { fetchTasks() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.due_date) { alert('Please select a due date'); return }
    try {
      if (editingTask) {
        await API.put(`tasks/${editingTask.id}/`, form)
        setEditingTask(null)
      } else {
        await API.post('tasks/', form)
      }
      setForm({ title: '', description: '', priority: 'Medium', due_date: '' })
      setShowForm(false)
      fetchTasks()
    } catch (err) {
      console.log(err.response?.data || err.message)
      alert('Something went wrong')
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      due_date: task.due_date
    })
    setShowForm(true)
  }

  const handleCancel = () => {
    setEditingTask(null)
    setForm({ title: '', description: '', priority: 'Medium', due_date: '' })
    setShowForm(false)
  }

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return
    await API.delete(`tasks/${id}/`)
    fetchTasks()
  }

  const toggleComplete = async (task) => {
    await API.put(`tasks/${task.id}/`, { ...task, completed: !task.completed })
    fetchTasks()
  }

  /* Stats */
  const total     = tasks.length
  const done      = tasks.filter(t => t.completed).length
  const pending   = total - done

  /* Today's date string */
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  })

  return (
    <div className="dashboard-wrapper">

      {/* ── Topbar ── */}
      <header className="topbar">
        <div className="topbar-brand">
          <div className="topbar-logo">tf</div>
          <span className="topbar-title">TaskFlow</span>
        </div>
        <div className="topbar-right">
          <span className="topbar-date">{today}</span>
        </div>
      </header>

      <main className="dashboard-main">

        {/* ── Page header ── */}
        <div className="dashboard-header">
          <h1 className="dashboard-greeting">Your workspace</h1>
          <p className="dashboard-subtitle">Manage and track your tasks</p>
        </div>

        {/* ── Stats ── */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Total</div>
            <div className="stat-value">{total}</div>
          </div>
          <div className="stat-card stat-done">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{done}</div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{pending}</div>
          </div>
        </div>

        {/* ── Add / Edit Form ── */}
        {!showForm ? (
          <div style={{ marginBottom: '28px' }}>
            <button
              className="btn btn-submit"
              style={{ display: 'inline-flex' }}
              onClick={() => setShowForm(true)}
            >
              + New task
            </button>
          </div>
        ) : (
          <div className="form-card">
            <div className="form-card-title">
              {editingTask ? 'Edit task' : 'New task'}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Task title…"
                  value={form.title}
                  required
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Optional description…"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Due date</label>
                  <input
                    type="date"
                    className="form-input"
                    required
                    value={form.due_date}
                    onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-submit">
                  {editingTask ? 'Update task' : 'Add task'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Task List ── */}
        <div className="section-header">
          <span className="section-title">Tasks</span>
          <span className="task-count-badge">{total} total</span>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◻</div>
            <p className="empty-state-text">No tasks yet — add one above</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`task-card${task.completed ? ' completed' : ''}`}
              >
                <div className="task-body">
                  <div className="task-title">{task.title}</div>
                  {task.description && (
                    <div className="task-description">{task.description}</div>
                  )}
                  <div className="task-meta">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge completed={task.completed} />
                    {task.due_date && (
                      <span className="task-due">
                        ⏱ {task.due_date}
                      </span>
                    )}
                  </div>
                </div>

                <div className="task-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => toggleComplete(task)}
                  >
                    {task.completed ? 'Undo' : 'Done'}
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard