import "./App.css";
import Navbar from "./Components/Navbar";
import AllRoutes from './Routes/AllRoutes';
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  if (isAdminPage) {
    return (
      <div className="admin-layout">
        <AllRoutes />
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <AllRoutes />
    </div>
  );
}

export default App;