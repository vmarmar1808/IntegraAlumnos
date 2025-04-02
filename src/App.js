
import AlumnoList from "./components/AlumnoList";
import AlumnoForm from "./components/AlumnoForm";
import Estadisticas from "./components/estadisticas";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import integraIcono from './assets/integraIcono.png'; 
import { Link } from "react-router-dom";

const App = () => {
  return (
    <Router>
      {/* Menú principal */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={integraIcono}
            alt="integraIcono"
            style={{
              width: '70px',
              height: '70px',
              marginRight: '15px',
            }}
          />
          <h1 style={{ margin: 0 }}>Integra Innovación</h1>
        </div>
        <nav style={{ display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ textDecoration: 'none', fontSize: '18px', color: '#007bff' }}>Alumnos</Link>
          <Link to="/estadisticas" style={{ textDecoration: 'none', fontSize: '18px', color: '#007bff' }}>Estadísticas</Link>
         
        </nav>
      </header>

      {/* Contenido principal */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<AlumnoList />} />
          <Route path="/alumno/:id" element={<AlumnoForm />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
