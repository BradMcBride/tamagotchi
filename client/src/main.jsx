import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Pet from './Pet.jsx'
import Home from './Home.jsx'
import './index.css'
import 'vite/modulepreload-polyfill'
import {createHashRouter, RouterProvider } from 'react-router-dom'


const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "/pet/:id",
        element: <Pet />
      }
    ]
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
