import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Landing from "./pages/Landing";
import Navbar from './pages/Navbar';

function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleWalletConnected = (address:string) => {
    setWalletAddress(address);
  };

  return (
    <Router>
      <Navbar onWalletConnected={handleWalletConnected} />
      <Routes>
        <Route path="/" element={<Landing walletAddress={walletAddress} />} />
      </Routes>
    </Router>
  );
}

export default App;