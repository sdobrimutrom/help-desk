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
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PrivateRoute from "./components/PrivateRoute";
import AdminPanelPage from "./pages/AdminPanelPage";
import Header from "./components/Header";

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
              <Header/>
              <HomePage/>
            </PrivateRoute>
          }
        />

        <Route path="/tickets"
          element = {
            <PrivateRoute>
              <Header/>
              <MyTicketsPage/>
            </PrivateRoute>
          }
        />

        <Route path="/tickets/new"
          element={
            <PrivateRoute>
              <Header/>
              <CreateTicketPage/>
            </PrivateRoute>
          }
        />

        <Route path="/assigned"
          element={
            <PrivateRoute>
              <Header/>
              <AssignedTicketsPage/>
            </PrivateRoute>
          }
        />

        <Route path = "/tickets/:id"
          element = {
            <PrivateRoute>
              <Header/>
              <TicketDetailsPage/>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Header/>
              <ProfilePage/>
            </PrivateRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <PrivateRoute>
              <Header/>
              <ChangePasswordPage/>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Header/>
              <AdminPanelPage/>
            </PrivateRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>    
        <Route path="/reset/:uid64/:token" element={<ResetPasswordPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;