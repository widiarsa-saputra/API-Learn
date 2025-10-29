import React, { useState } from "react";
import axios from "axios";
import FormComponent from "./components/FormComponent";
import StatusModal from "./components/StatusModal";
import { useNavigate, } from "react-router-dom";

function Login({ onLoginSuccess }) {
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);
    const [data, setData] = useState({})
    // const [isActive, setIsActive] = useState(false);

    // function handleLogin() {
    //     setIsActive(true);
    //     postUserAccount();
    // }

    async function postUserAccount(data) {
        try {
            const response = await axios.post(
                "https://api.gotra.my.id/api/v1/login",
                {
                    email: data.email,
                    password: data.password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    responseType: "json",
                }
            );
            setModal(true);
            setData(response.data);
            onLoginSuccess((response.data));
            return response.data;
        } catch (error) {
            setModal(true);
            setData(error.response.data)
            console.error("Login gagal:", error.response.data.success);
            return Promise.reject(error);

        }
    }

    function loginSucceed() {
        setModal(false);

        if (data.success) {
            navigate('/posts')
        }
    }

    return (
        <>
            {modal
                ? <StatusModal
                    isOpen={modal}
                    onClose={loginSucceed} 
                    msg={data?.message}
                    status={data?.success}
                    ask={false}
                />
                : ''}
            <section className="bg-gray-100 min-h-screen flex justify-between">
                <div className='w-1/2 bg-gray-100 flex flex-col items-center justify-between p-8 text-gray-500 mt-8'>
                    <FormComponent
                        title='Log In'
                        reps={false}
                        sec='Sign Up'
                        onSubmit={postUserAccount} />
                    <p className="w-lg font-extralight text-xs tracking-widest [word-spacing:0.5rem] text-center">
                        © 2025 All Rights Reserved. TinyMCE® is a registered trademark of Tiny Technologies, Inc.
                        <span className="text-blue-500 font-normal"> Privacy Policy </span>
                        and
                        <span className="text-blue-500 font-normal"> Terms of Use </span>.
                    </p>
                </div>
                <div className="w-1/2 bg-[#1b1b32] flex items-center justify-center">
                    <img src='../public/revision-history.svg' />
                </div>
            </section>
        </>
    );
}

export default Login;
