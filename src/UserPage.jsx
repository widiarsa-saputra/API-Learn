import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "./pages/Post";
import { useNavigate } from "react-router-dom";
import { logout } from './services/logout';

function UserPage() {
    const token = `Bearer ${localStorage.getItem("token")}`;
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            const res = await logout();
            alert(res.message);
            navigate('/');
        } catch (err) {
            alert("Logout gagal", err);
        }
    }

    useEffect(() => {
        async function getUserProfile() {
            try {
                const response = await axios.get(
                    "https://api.gotra.my.id/api/v1/me",
                    {
                        headers: {
                            "Authorization": token,
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                    }
                );
                setUser(response.data);
            } catch (err) {
                console.error("GetUser gagal: ", token, err);
            }
        }

        getUserProfile();
    }, [token]);

    if (!user) return <div className="loading">Loading...</div>;

    return (
        <div className="profile-container">
            <img className="user-photo" src={user?.data.photo_url ? user?.data.photo_url : '../public/user.png'} />
            <div className="profile-card">
                <h1>Nama:  {user?.data.name}!</h1>
                <h1>Email: {user?.data.email}</h1>
                <h1>Phone: {user?.data.phone}</h1>
                <button className="navigate-btn" onClick={() => navigate('/posts')}>Posts</button>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
                <button className="navigate-btn" onClick={handleLogout}>Edit</button>
            </div>
        </div>
    );
}

export default UserPage;