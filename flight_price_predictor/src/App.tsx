import React, { useState } from 'react';
import Navbar from './components/Navbar';
import FlightSearch from './components/FlightSearch';
import AIAssistant from './components/AIAssitant';
import About from './components/About';
import './App.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'ai' | 'about'>('search');

  return (
    <div className="app">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {activeTab === 'search' ? (
          <FlightSearch />
        ) : activeTab === 'ai' ? (
          <AIAssistant />
        ) : (
          <About />
        )}
      </main>
      <footer className="footer">
        <p>© 2025 FlightSavvy - Powered by AI</p>
        <div className="footer-links">
          <a href="#about" onClick={() => setActiveTab('about')}>About Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default App;