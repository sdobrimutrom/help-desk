import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UserInfo from "./components/UserInfo";

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/me" element={<UserInfo/>}/>
      </Routes>
    </Router>
  );
}

export default App;