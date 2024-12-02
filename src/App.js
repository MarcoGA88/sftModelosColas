import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Pics from './pages/pics';
import Picm from './pages/picm';
import Pfcs from './pages/pfcs';
import Pfcm from './pages/pfcm';

function App() {
  return (
    <div className="App">
      <Router>
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-64 bg-blue-900 text-white fixed h-full">
            <Sidebar />
          </div>

          {/* Content section */}
          <div className="ml-64 flex-grow overflow-y-auto p-4">
            <Routes>
              <Route path="/" element={<Pics />} />
              <Route path="/picm" element={<Picm />} />
              <Route path="/pfcs" element={<Pfcs />} />
              <Route path="/pfcm" element={<Pfcm />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;


