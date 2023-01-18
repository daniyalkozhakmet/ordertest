import { Header } from "./components/Header";
import { Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoggedIn, Protected } from "./utility/Protected";
import { AdminPage } from "./pages/AdminPage";
import { HomePage } from "./pages/HomePage";
import { OrderPage } from "./pages/OrderPage";
import { ProfilePage } from "./pages/ProfilePage";
import { OrdersPage } from "./pages/OrdersPage";
import { UsersPage } from "./pages/UsersPage";
import { useAppSelector } from "./hooks/hooks";
function App() {
  const { loggedIn } = useAppSelector((state) => state.user);
  return (
    <div className="font-poppins overflow-x-hidden">
      <Header />
      <div className="pt-16 mb-7">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route
            path="/login"
            element={
              <LoggedIn isLoggedIn={loggedIn}>
                <LoginPage />
              </LoggedIn>
            }
          />
          <Route
            path="/register"
            element={
              <LoggedIn isLoggedIn={loggedIn}>
                <RegisterPage />
              </LoggedIn>
            }
          />
          <Route
            path="/profile"
            element={
              <Protected isLoggedIn={loggedIn}>
                <ProfilePage />
              </Protected>
            }
          />
          <Route
            path="/users"
            element={
              <Protected isLoggedIn={loggedIn}>
                <UsersPage />
              </Protected>
            }
          />
          <Route
            path="/admin"
            element={
              <Protected isLoggedIn={loggedIn}>
                <AdminPage />
              </Protected>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
