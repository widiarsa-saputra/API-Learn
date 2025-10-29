import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import LoadingComponent from "./LoadingComponent";


function FormComponent({ onSubmit, title, reps, sec }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);
    const [repPassword, setRepPassword] = useState('');
    const [emailMsg, setEmailMsg] = useState('');
    const [passwordMsg, setPasswordMsg] = useState('');

    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);
    const [hideRepsPassword, setHideRepsPassword] = useState(true);

    function changeVisiblePassword() {
        setHidePassword((prev) => !prev);
    }
    function changeVisibleRepsPassword() {
        setHideRepsPassword((prev) => !prev);
    }

    function handleSubmit() {
        setIsSubmit(true);
        onSubmit({
            email, password
        }).finally(() => {
            setIsSubmit(false)
        });
    }

    function emailValidator(e) {
        const value = e.target.value;
        setEmail(value);

        if (value === '') {
            setEmailMsg('')
            return;
        }

        if (!value.includes('@')) {
            setEmailMsg(`Please include an '@' in the email address. '${value}' is missing an '@'.`);
            return;
        }

        const atIndex = value.indexOf('@');

        if (atIndex === 0) {
            setEmailMsg(`Please enter local-part before '@'. '${value}' has no local-part.`)
            return;
        }

        if (atIndex === value.length - 1) {
            setEmailMsg(`Please enter the domain after '@'. '${value}' has no domain`)
            return;
        }

        const regexDomain = /@.+\..+/;
        const regexDot = /@.+\./;
        if (!regexDomain.test(value) || !regexDot.test(value)) {
            setEmailMsg(`Please enter the TLD after dot (ex: x@xx.xx) '${value}' has no TLD`)
            return
        }
        setEmailMsg('');
        setValidEmail(true);
    }

    function passwordValidator(e, isPassword) {
        const value = e.target.value;
        isPassword ? setPassword(value) : setRepPassword(value);

        if (value === '') {
            setPasswordMsg('');
            return
        }

        if (isPassword) {
            if (!/\d/.test(value)) {
                setPasswordMsg(`Password needs at least one number [0-9] in it.`)
                return;
            }

            if (reps) {
                if (value !== repPassword) {
                    setPasswordMsg(`current password is not the same as the repeated password`)
                    return;
                }
            } else {
                setPasswordMsg('');
                setValidPassword(true)
            }

        } else {

            if (value !== password) {
                setPasswordMsg(`The repeated password is not the same as the password above.`)
                return;
            }

        }
        setPasswordMsg('');
        setValidPassword(true)
    }

    return (
        <div className="bg-white rounded-xl shadow-lg w-lg">
            <div className="border-b-1 border-[#e0e0e0] p-6 flex items-center justify-between">
                <h2 className="font-bold text-3xl tracking-widest text-[#002d74]">{title}</h2>
                <button
                    className='sec-btn rounded-xl text-white py-2 p-5 cursor-pointer'
                    onClick={handleSubmit}
                >{sec}</button>
            </div>
            <div className="flex flex-col gap-4 p-6">
                <label className="text-[#002d74] -mb-3 font-bold">Email</label>
                <input
                    className="p-2 px-6 border-1 border-[#e0e0e0]"
                    type="text"
                    placeholder="widiarsa@example.com"
                    value={email}
                    onChange={emailValidator}
                />
                {emailMsg
                    ? <div className="-mt-3 flex gap-2 items-center">
                        <div>
                            <p className="bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
                                !
                            </p>
                        </div>
                        <p className="text-red-500">{emailMsg}</p>
                    </div>
                    : ''}
                <label className="text-[#002d74] -mb-3 font-bold">Password</label>
                <div className="flex">
                    <input
                        className="p-2 px-6 border-1 border-[#e0e0e0] w-full border-r-0"
                        type={hidePassword ? "password" : "text"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => passwordValidator(e, true)}
                    />
                    <FontAwesomeIcon
                        icon={hidePassword ? faEye : faEyeSlash}
                        className="p-4 flex items-center justify-center text-[#002d74] text-xs border-1 border-[#e0e0e0] cursor-pointer"
                        onClick={changeVisiblePassword}
                    />
                </div>
                {
                    !reps && passwordMsg && (
                        <div className="-mt-3 flex gap-2">
                            <div>
                                <p className="bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
                                    !
                                </p>
                            </div>
                            <p className="text-red-500">{passwordMsg}</p>
                        </div>
                    )
                }
                {reps && (
                    <>
                        <label className="text-[#002d74] -mb-3 font-bold">Repeat Password</label>
                        <div className="flex">
                            <input
                                className="p-2 px-6 border-1 border-[#e0e0e0] w-full border-r-0"
                                type={hideRepsPassword ? "password" : "text"}
                                placeholder="••••••••"
                                value={repPassword}
                                onChange={(e) => passwordValidator(e, false)}
                            />
                            <FontAwesomeIcon
                                icon={hideRepsPassword ? faEye : faEyeSlash}
                                className="p-4 flex items-center justify-center text-[#002d74] text-xs border-1 border-[#e0e0e0] cursor-pointer"
                                onClick={changeVisibleRepsPassword}
                            />
                        </div>
                        {passwordMsg && (
                            <div className="-mt-3 flex gap-2">
                                <div>
                                    <p className="bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
                                        !
                                    </p>
                                </div>
                                <p className="text-red-500">{passwordMsg}</p>
                            </div>
                        )}
                    </>
                )}

                <button
                    className={`login-btn ${isSubmit ? "active" : ''} bg-[#002d74] rounded-xl text-white py-2 duration-300 h-12
                        ${!validEmail || !validPassword ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    onClick={handleSubmit}
                    disabled={!validEmail || !validPassword}
                >
                    <div className="flex items-center justify-center w-full rounded-lg">
                        <LoadingComponent isLoading={isSubmit} title={title} />
                    </div>
                </button>
            </div>
        </div>
    );
}

export default FormComponent