import Header from "./components/layouts/Header.jsx";
import Footer from "./components/layouts/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}

export default App;
