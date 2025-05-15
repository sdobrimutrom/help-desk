import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserInfo from "./components/UserInfo";

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/me" element={<UserInfo/>}/>
        <Route path="/register" element={<RegisterPage />}/>
      </Routes>
    </Router>
  );
}

export default App;