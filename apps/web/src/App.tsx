import { Routes, Route, Link } from 'react-router-dom';
import ClientSignup from './pages/ClientSignup';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <header className="nav">
        <div className="nav-container">
          <h1>Prosper Health</h1>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/signup">Client Signup</Link>
            <Link to="/dashboard">Clinician Dashboard</Link>
          </nav>
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<ClientSignup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App; 