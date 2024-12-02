import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutGrid, 
  Server, 
  BarChart3, 
  Workflow 
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="bg-blue-900 text-white h-screen w-64 p-6 fixed left-0 top-0 shadow-2xl">
      <div className="mb-12 text-center">
        <h1 className="text-2xl font-bold text-white">Queue Models</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link 
              to="/" 
              className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors group"
            >
              <LayoutGrid className="text-blue-300 group-hover:text-white" />
              <span className="font-medium">PICS</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/picm" 
              className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors group"
            >
              <Server className="text-blue-300 group-hover:text-white" />
              <span className="font-medium">PICM</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/pfcs" 
              className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors group"
            >
              <BarChart3 className="text-blue-300 group-hover:text-white" />
              <span className="font-medium">PFCS</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/pfcm" 
              className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors group"
            >
              <Workflow className="text-blue-300 group-hover:text-white" />
              <span className="font-medium">PFCM</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

