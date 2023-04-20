import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom"
import './index.css'
import AuthPage from './pages/AuthPage'


const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthPage />,
  },
  {
    path: '/home',
    element: <App />
  }

]);



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>,
)
