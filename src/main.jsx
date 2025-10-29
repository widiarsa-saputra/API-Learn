import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Post from './Post.jsx'
import PostsAdmin from './PostsAdmin.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PostDetail from './PostDetail.jsx';
import UserPage from './UserPage.jsx'
import Labels from './Labels.jsx'
import Categories from './Categories.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/user',
    element: <UserPage />
  },
  {
    path: '/posts',
    element: <Post />
  },
  {
    path: '/admin',
    element: <PostsAdmin />
  },
  {
    path: '/category',
    element: <Categories />
  },
  {
    path: '/labels',
    element: <Labels />
  },
  {
    path: '/posts/:id',
    element: <PostDetail />
  },
    {
    path: '*',
    element: <NotFoundPage />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
