import { useState } from 'react'

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://cccgroup.app.n8n.cloud/webhook/82314639-b60f-4750-bda6-7e87ae472be5'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">AI App Architect</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">Describe your dream app, and our AI will generate the blueprint instantly.</p>

        {status === 'success' ? (
          <div className="text-center">
            <div className="text-green-600 text-xl mb-2">✓ Blueprint Generated!</div>
            <p className="text-gray-600">Check the database for your new app design.</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 text-blue-600 hover:text-blue-800 underline"
            >
              Generate Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Describe Your App</label>
              <textarea
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Ex: A to-do list app for astronauts with dark mode and offline sync..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${status === 'sending'
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {status === 'sending' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating App...
                </span>
              ) : 'Generate App Blueprint'}
            </button>

            {status === 'error' && (
              <div className="text-red-500 text-sm text-center">
                Failed to connect to the architect. Please try again.
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

export default App
