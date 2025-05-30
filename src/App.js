import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Inicio from './pages/home';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import "@iconscout/unicons/css/line.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Inicio />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
