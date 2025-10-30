import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from './pages/Login';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  function handleLoginSuccess(data) {
    setToken(data);
    localStorage.setItem("token", data);
  }

  useEffect(() => {
    if (token) navigate("/posts");
  }, [token, navigate]);

  if (!token) return <Login onLoginSuccess={handleLoginSuccess} />;

  return null;
}

export default App;
