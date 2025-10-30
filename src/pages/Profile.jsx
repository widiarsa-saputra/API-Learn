import { useEffect, useState } from "react";
import { changeProfilePassword, getProfile, updatePhotoProfile, updateProfile } from "../services/profile";
import Navbar from '../components/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserLock, faPen, faMedal, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import StatusModal from "../components/StatusModal";
import LoadingComponent from "../components/LoadingComponent"

function Profile() {
    const [profile, setProfile] = useState(null);
    const [preview, setPreview] = useState('');
    const [bar, setBar] = useState('general');
    const [change, setChange] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [img, setImg] = useState(null);
    const [imgChange, setImgChange] = useState(false);
    const [modal, setModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [hideOldPassword, setHideOldPassword] = useState(true);
    const [hideNewPassword, setHideNewPassword] = useState(true);
    const [passwordMsg, setPasswordMsg] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);

    useEffect(() => {
        async function getData() {
            try {
                const response = await getProfile();
                setProfile(response.data);
                // console.log({response});
            } catch (err) {
                console.error("Get User Error ", err);
            }
        }
        getData();
    }, [bar, change]);

    useEffect(() => {
        if (profile) {
            setName(profile.name || "");
            setEmail(profile.email || "");
            setPhone(profile.phone || "");
            setPreview(profile.photo_url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROy1nYckwRfsYamc-mheMx-OCe75gst00qXA&s");
        }
    }, [profile]);

    async function updateData(formData) {
        try {
            const response = await updateProfile(formData);

            setProfile(response.data.data);
            setChange(response.data);
            setModal(true);
        } catch (err) {
            setModal(true);
            setChange(err);
            console.error('Update Data Error ', err)
        }
    }

    async function updatePhoto(formData) {
        try {
            const response = await updatePhotoProfile(formData);

            setChange(response.data);
            setModal(true);
        } catch (err) {
            setModal(true);
            setChange(err);
            console.error('Update Photo Error ', err)
        }
    }

    async function changePassword(e) {
        e.preventDefault();
        setIsSubmit(true);

        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append('old_password', oldPassword);
        formData.append('new_password', newPassword);

        try {
            const response = await changeProfilePassword(formData);
            console.log({response});
            localStorage.removeItem("token");
            
            setChange(response.data);
            setModal(true);
            setIsSubmit(false);
        } catch (err) {
            setModal(true);
            setIsSubmit(false);
            setChange(err);
            console.error('Change Password Error ', err)
        }
    }


    function handleChange(e) {
        const file = e.target.files[0];

        if (file) {
            setImgChange(true);
            setImg(file);
            const reader = new FileReader;
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    function handleSubmit(e) {
        e.preventDefault()

        if (
            name !== profile?.name
            || email !== profile?.email
            || phone !== profile?.phone
        ) {
            const formData = new FormData();
            formData.append("_method", "PUT");
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);

            updateData(formData);
        } else if (imgChange) {
            const formData = new FormData();
            formData.append("_method", "PUT");
            formData.append('photo', img);

            updatePhoto(formData)
        } else {
            alert('Nothing to change');
        }

    }

    function passwordValidator(e, isNew) {
        const value = e.target.value;
        // console.log({value, isNew});

        if (isNew) {
            setNewPassword(value);
        } else {
            setOldPassword(value);
        }

        if ((newPassword === value || oldPassword === value) && value !== '') {
            setPasswordMsg('New Password has same value as the Old password');
            return;
        }

        setPasswordMsg('');
        setValidPassword(true);
    }

    function mainContent() {
        let content;

        switch (bar) {
            case 'general':
                content = <>
                    <p className="my-2 py-2 px-2 text-3xl w-full border-b">General</p>
                    <form className="flex gap-30" onSubmit={handleSubmit}>
                        <div>
                            <div className="flex flex-col mt-6">
                                <label className="font-bold">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    value={name}
                                    className="ml-1 my-2 w-lg px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-2 outline-none"
                                    type="text"
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <p className="ml-1 text-sm text-gray-400">This is the name given to you at birth.</p>
                            </div>
                            <div className="flex flex-col mt-6">
                                <label className="font-bold">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    value={email}
                                    className="ml-1 my-2 w-lg px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-2 outline-none"
                                    type="text"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <p className="ml-1 text-sm text-gray-400">You can manage verified email addresses in your email settings.</p>
                            </div>
                            <div className="flex flex-col mt-6">
                                <label className="font-bold">
                                    Phone
                                </label>
                                <input
                                    id="phone"
                                    value={phone}
                                    className="ml-1 my-2 w-lg px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-2 outline-none"
                                    type="text"
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <p className="ml-1 text-sm text-gray-400">Please use verified phone numbers. Do not enter it with 123456789!</p>
                            </div>
                            <button
                                type="submit"
                                className="text-white px-4 py-2 rounded-lg mt-8 mb-2 login-btn"
                            >Update Profile</button>
                            <p className="text-gray-400 italic text-sm">
                                Last updated at{" "}
                                <span>
                                    {new Date(profile?.updated_at).toLocaleString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </p>

                        </div>
                        <div className="mt-6">
                            <label className="font-bold text-center block mb-8">
                                Profile picture
                            </label>

                            <div className="relative w-72 h-72">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover object-top rounded-full border-1 border-gray-800"
                                />
                                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-25 text-white cursor-pointer rounded-full opacity-0 hover:opacity-100 transition-opacity">
                                    <FontAwesomeIcon icon={faPen} className="mb-1" />
                                    <p>Edit</p>
                                    <input
                                        id="profile"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                        </div>


                    </form>
                </>;
                break;
            case 'role':
                content = <></>;
                break;
            case 'change-password':
                content = <>
                    <form
                        onSubmit={changePassword}
                        className="bg-white rounded-xl shadow-lg w-lg">
                        <div className="border-b-1 border-[#e0e0e0] p-6 flex items-center justify-between">
                            <h2 className="font-bold text-3xl tracking-widest text-[#002d74]">Change Password</h2>
                        </div>
                        <div className="flex flex-col gap-4 p-6">
                            <label className="text-[#002d74] -mb-3 font-bold">Old Password</label>
                            <div className="flex">
                                <input
                                    className="p-2 px-6 border-1 border-[#e0e0e0] w-full border-r-0"
                                    type={hideOldPassword ? "password" : "text"}
                                    placeholder="••••••••"
                                    value={oldPassword}
                                    onChange={(e) => passwordValidator(e, false)}
                                />
                                <FontAwesomeIcon
                                    icon={hideOldPassword ? faEye : faEyeSlash}
                                    className="p-4 flex items-center justify-center text-[#002d74] text-xs border-1 border-[#e0e0e0] cursor-pointer"
                                    onClick={() => setHideOldPassword((prev) => !prev)}
                                />
                            </div>
                            <label className="text-[#002d74] -mb-3 font-bold">Repeat Password</label>
                            <div className="flex">
                                <input
                                    className="p-2 px-6 border-1 border-[#e0e0e0] w-full border-r-0"
                                    type={hideNewPassword ? "password" : "text"}
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => passwordValidator(e, true)}
                                />
                                <FontAwesomeIcon
                                    icon={hideNewPassword ? faEye : faEyeSlash}
                                    className="p-4 flex items-center justify-center text-[#002d74] text-xs border-1 border-[#e0e0e0] cursor-pointer"
                                    onClick={() => setHideNewPassword((prev) => !prev)}
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

                            <button
                                type="submit"
                                className={`login-btn ${isSubmit ? "active" : ''} bg-[#002d74] rounded-xl text-white py-2 duration-300 h-12
                        ${!validPassword ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                disabled={!validPassword}
                            >
                                <div className="flex items-center justify-center w-full rounded-lg">
                                    <LoadingComponent isLoading={isSubmit} title='Ok' />
                                </div>
                            </button>
                        </div>
                    </form>
                </>;
                break;
        }
        return <>{content}</>;
    }

    // function reset() {
    //     setModal(false);
    // }

    function handleClose()  {
        change.success ? window.location.reload() : setModal(false);
    }

    return (
        <>
            <Navbar onChange={change} />
            {modal && change
                ? <StatusModal
                    isOpen={modal}
                    onClose={handleClose}
                    msg={change.message}
                    status={change.success}
                    ask={false}
                    action={'Update'}
                />
                : ''}
            <div className="mx-20 mt-30 grid grid-cols-[100px_1fr_3fr_100px] gap-20">
                <div></div>
                <div
                    className="bg-white w-64 overflow-y-auto transition-transform"
                >
                    <div className="py-4 overflow-y-auto border-b">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <button
                                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-[#1b1b32] hover:text-white w-full group ${bar === 'general' ? 'bg-[#1b1b32] text-white border-r-6 border-indigo-500' : ''}`}
                                    onClick={() => setBar('general')}
                                >
                                    <FontAwesomeIcon icon={faHome} />
                                    <p className="ml-2">General</p>
                                </button>
                            </li>
                            <li>
                                <button
                                    
                                    className={`flex w-full items-center p-2 text-gray-900 rounded-lg hover:bg-[#1b1b32] hover:text-white group ${bar === 'role' ? 'bg-[#1b1b32] text-white border-r-6 border-indigo-500' : ''}`}
                                    onClick={() => setBar('role')}
                                >
                                    <FontAwesomeIcon icon={faMedal} />
                                    <p className="ml-2">Role</p>
                                </button>
                            </li>
                            <li>
                                <button
                                    
                                    className={`flex w-full items-center p-2 text-gray-900 rounded-lg hover:bg-[#1b1b32] hover:text-white group ${bar === 'change-password' ? 'bg-[#1b1b32] text-white border-r-6 border-indigo-500' : ''}`}
                                    onClick={() => setBar('change-password')}
                                >
                                    <FontAwesomeIcon icon={faUserLock} />
                                    <p className="ml-2">Change Password</p>
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="py-4 overflow-y-auto border-b">
                        <p className="text-gray-400 px-2">AI</p>
                        <ul className="space-y-2 font-medium">
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-[#1b1b32] hover:text-white group"
                                >
                                    General
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-[#1b1b32] hover:text-white group"
                                >
                                    Role
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-[#1b1b32] hover:text-white group"
                                >
                                    Kata-kata hari ini
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="py-8 w-full">
                    {mainContent()}
                </div>
                <div></div>
            </div>
        </>
    );
}

export default Profile;
