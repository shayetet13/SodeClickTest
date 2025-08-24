import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './components/ui/toast'
import AdminDashboard from './components/AdminDashboard'
import HealthCheck from './components/HealthCheck'
import JoinChatRoom from './components/JoinChatRoom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>,
)
