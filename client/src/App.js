import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import OtherPage from './OtherPage';
import Fib from './Fib';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <header>
                    <img src={logo} className="App-logo" alt="logo" />
                    <div style={{ display: 'flex', justifyContent: "space-around", marginBottom: "30px" }}>
                        <Link to="/">Home</Link>
                        <Link to="/otherpage">Other Page</Link>
                    </div>
                </header>
                <Routes>
                    <Route path="/" element={<Fib />} />
                    <Route path="*" element={<OtherPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
