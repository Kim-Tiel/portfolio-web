import { createBrowserRouter } from 'react-router-dom'
import { Home } from './pages/Home'
import { ProjectDetail } from './pages/ProjectDetail'
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/projects/:slug',
    element: <ProjectDetail />,
  },
])
