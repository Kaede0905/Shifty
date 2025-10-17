import './App.css'
import AppRoute from './Routes'
import { Toaster } from 'sonner'

const App: React.FC = () => {
  return (
    <>
      <AppRoute />
      <Toaster richColors position="top-center" />
    </>

  )
}

export default App

