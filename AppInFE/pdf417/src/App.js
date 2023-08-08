import logo from './logo.svg';
import './App.css';
import Profile from './components/Profile'
import BarcodeScanner from './components/BarcodeScanner'

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <BarcodeScanner />
      </header>      
    </div>
  );
}

export default App;
