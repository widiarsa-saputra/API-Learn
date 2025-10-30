import Login from "./pages/Login.jsx";
import React, { useState, useEffect } from 'react';
import UserPage from './UserPage';
import { useNavigate, } from "react-router-dom";
import FormComponent from './components/FormComponent.jsx'
import StatusModal from "./components/StatusModal.jsx";
import ImageModal from './components/ImageModal.jsx';
import NavBar from "./components/NavBar.jsx";
import ImageInput from './components/ImageInput.jsx'
import LoadingComponent from "./components/LoadingComponent.jsx";


function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  function handleLoginSuccess(data) {
    // console.log("🚀 ~ handleLoginSuccess ~ data:", data);
    setToken(data.token);
    localStorage.setItem("token", data.token);

  }

  useEffect(() => {
    if (token) {
      navigate('/posts');
    }
  }, [token, navigate]);

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // return <LoadingComponent isLoading={true} title='test' /> 
}

export default App;
