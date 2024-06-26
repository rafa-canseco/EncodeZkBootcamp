import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Landing from "./pages/Landing";
import Navbar from './pages/Navbar';
import ZeroKnowledgeProofs from './pages/ZeroKownledgeProofs';
import VerifyZKP from './pages/VerifyZKP';

function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleWalletConnected = (address:string) => {
    setWalletAddress(address);
  };

  return (
    <div className="bg-gray-300">
      <Router>
        <Navbar onWalletConnected={handleWalletConnected} />
        <Routes>
          <Route path="/" element={<Landing walletAddress={walletAddress} />} />
          <Route path="/zero-knowledge" element={<ZeroKnowledgeProofs />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;