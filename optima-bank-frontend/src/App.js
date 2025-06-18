import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './Page/Signup';
import LoginPage from './Page/login';
import Dashboard from './Page/Dashboard';
import ForgotPassword from './Page/ForgotPassword';
import './App.css'; // optional global reset/theme

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
