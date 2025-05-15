import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserInfo from "./components/UserInfo";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/me"
        element={
          <PrivateRoute>
            <UserInfo/>
          </PrivateRoute>
          }
        />
        <Route path="/register" element={<RegisterPage />}/>
      </Routes>
    </Router>
  );
}

export default App;