import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layouts/Header.jsx";
import Footer from "./components/layouts/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import ApartmentDetail from "./pages/ApartmentDetail.jsx";
import PostApartment from "./pages/AddApartment.jsx";
import Profile from "./pages/Profile";
import Package from "./components/package/Package";
import Posts from "./pages/Posts";
import Roommates from "./pages/Roommates";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/real-estate/:id" element={<ApartmentDetail />} />
            <Route path="/add-apartment" element={<PostApartment />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/packages" element={<Package />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/roommates" element={<Roommates />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
