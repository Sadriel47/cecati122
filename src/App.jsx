import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Cursos from './pages/Cursos';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <SiteConfigProvider>
        <Router>
          <ScrollToTop />
          <div className="app-container flex flex-col min-h-screen">
            <Header />
            
            {/* Main page content area */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/cursos" element={<Cursos />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPostDetail />} />
                {/* Ruta pública para login / protegida dentro del componente o mediante Guard */}
                <Route path="/admin" element={<Admin />} />
                {/* Ruta para páginas no encontradas (404) */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </SiteConfigProvider>
    </AuthProvider>
  );
}

