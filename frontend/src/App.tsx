import { useState } from 'react'
// import './App.css'

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')

  const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://cccgroup.app.n8n.cloud/webhook/82314639-b60f-4750-bda6-7e87ae472be5'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Sending...')

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setStatus('Success! Data sent to n8n.')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('Error submitting form.')
      }
    } catch (error) {
      console.error(error)
      setStatus('Network error.')
    }
  }

  return (
    <div className="container">
      <h1>Platform Dashboard</h1>
      <div className="card">
        <h2>Submit Data to n8n</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>
          <button type="submit">Send to Workflow</button>
        </form>
        {status && <p className="status">{status}</p>}
      </div>
    </div>
  )
}

export default App
