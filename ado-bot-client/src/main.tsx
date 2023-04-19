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


const isAuthenticated = () => {
  return sessionStorage.getItem("username") ? true : false
}


const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthPage />,
  },
  {
    path: '/home',
    element: ( isAuthenticated() ? <App /> : <Navigate to="/" replace={true}/>)
  }

]);



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>,
)
