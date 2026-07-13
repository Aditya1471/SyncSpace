import Header from './components/Header'
import Sidebar from './components/Sidebar'
import SplitScreen from './components/SplitScreen'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app">

      <Header />

      <div className="workspace">
        <Sidebar />
        <SplitScreen />
      </div>

      <Footer />

    </div>
  )
}

export default App