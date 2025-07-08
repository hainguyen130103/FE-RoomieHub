import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layouts/Header.jsx";
import Footer from "./components/layouts/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import ApartmentDetail from "./pages/ApartmentDetail.jsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            {/* Route for the Home Page, which should contain RealEstateSection */}
            <Route path="/" element={<HomePage />} />

            {/* Route for the Real Estate Detail Page */}
            {/* The ':id' is a URL parameter that will capture the apartment ID */}
            <Route path="/real-estate/:id" element={<ApartmentDetail />} />

            {/* Add any other routes here */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
