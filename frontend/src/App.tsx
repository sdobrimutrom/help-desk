import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import AssignedTicketsPage from "./pages/AssignedTicketsPage";
import PrivateRoute from "./components/PrivateRoute";
import AdminPanelPage from "./pages/AdminPanelPage";

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>

        <Route path="/register" element={<RegisterPage />}/>

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage/>
            </PrivateRoute>
          }
        />

        <Route path="/tickets"
          element = {
            <PrivateRoute>
              <MyTicketsPage/>
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

        <Route path="/assigned"
          element={
            <PrivateRoute>
              <AssignedTicketsPage/>
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

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanelPage/>
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;