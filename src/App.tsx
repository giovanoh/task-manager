import { BrowserRouter as Router } from 'react-router-dom'
import { TaskProvider } from './contexts/TaskContext'
import { AppRouter } from './AppRouter'

function App() {
  return (
    <TaskProvider>
      <Router>
        <AppRouter />
      </Router>
    </TaskProvider>
  )
}

export default App
