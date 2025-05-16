import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TicketListPage from "./pages/TicketListPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ProfilePage from "./pages/ProfilePage";
import UserInfo from "./components/UserInfo";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/me"
        element={
          <PrivateRoute>
            <UserInfo/>
          </PrivateRoute>
          }
        />
        <Route path="/tickets"
          element = {
            <PrivateRoute>
              <TicketListPage/>
            </PrivateRoute>
          }
        />
        <Route path="/tickets/new"
          element={
            <PrivateRoute>
              <CreateTicketPage/>
            </PrivateRoute>
          }
        />
        <Route path = "/tickets/:id"
          element = {
            <PrivateRoute>
              <TicketDetailsPage/>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage/>
            </PrivateRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <PrivateRoute>
              <ChangePasswordPage/>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;