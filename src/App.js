import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import Footer from "../src/pages/footer";
import Header from "../src/pages/header";
import routes from "./routers";

import "./App.css";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  const currentRoute = routes.find((route) => route.path === location.pathname);

  const showHeader = currentRoute ? currentRoute.showHeader : true;

  const showFooter = currentRoute ? currentRoute.showFooter : true;

  return (
    <div>
      {showHeader && <Header />}
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
