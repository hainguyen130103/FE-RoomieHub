import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layouts/Header.jsx";
import Footer from "./components/layouts/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import ApartmentDetail from "./components/Apartment/ApartmentDetail.jsx";
import PostApartment from "./components/Apartment/AddApartment.jsx";
import Profile from "./pages/Profile";
import Package from "./components/package/Package";
import Posts from "./pages/Posts";
import Roommates from "./pages/Roommates";
import AllApartmentsPage from "./components/Apartment/AllApartmentsPage.jsx";
import RoommatePosts from "./components/Roommate/RoommatePosts.jsx";
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import UserManagement from "./components/Admin/managePage/UserManagement.jsx";
import PostManagement from "./components/Admin/managePage/PostManagement.jsx";
import Dashboard from "./components/Admin/managePage/Dashboard.jsx";
import ProtectedAdminRoute from "./components/middleware/ProtectedAdminRoute.jsx";
import PaymentSuccess from "./components/payment/PaymentSuccess.jsx";
import PaymentCancel from "./components/payment/PaymentCancel.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* 👤 Layout cho người dùng (có Header + Footer) */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-gray-50">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route
                    path="/real-estate/:id"
                    element={<ApartmentDetail />}
                  />
                  <Route path="/add-apartment" element={<PostApartment />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/packages" element={<Package />} />
                  <Route path="/package" element={<Package />} />
                  <Route path="/posts" element={<Posts />} />
                  <Route path="/roommates" element={<Roommates />} />
                  <Route path="/real-estate" element={<AllApartmentsPage />} />
                  <Route path="/roommates-post" element={<RoommatePosts />} />
                  <Route path="/payment/success" element={<PaymentSuccess />} />
                  <Route path="/payment/cancel" element={<PaymentCancel />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />

        {/* 🛠️ Layout riêng cho Admin (không có Header/Footer) */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <UserManagement />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/posts"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <PostManagement />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
