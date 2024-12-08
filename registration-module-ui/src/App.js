import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationList from './pages/RegistrationList';
import AddRegistration from './pages/AddRegistration';
function App() {
  return (
    <Router>
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<RegistrationList />} />
          <Route path="/add" element={<AddRegistration />} />
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
