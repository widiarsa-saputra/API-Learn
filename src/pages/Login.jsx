import React, { useState } from "react";
import FormComponent from "../components/FormComponent";
import StatusModal from "../components/StatusModal";
import { useNavigate, } from "react-router-dom";
import { login } from "../services/login";

function Login({ onLoginSuccess }) {
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);
    const [data, setData] = useState({});

    async function postUserAccount(form) {
        try {
            console.log({form})
            const res = await login(form);
            console.log({ res });

            setModal(true);
            setData(res);
            onLoginSuccess(res);
        } catch (err) {
            setData(err.response.data);
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
                    <img src='https://api.gotra.my.id/uploads/posts/post-1761834520-tzEx.png' />
                </div>
            </section>
        </>
    );
}

export default Login;
