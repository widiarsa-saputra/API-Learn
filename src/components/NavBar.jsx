import { useState, useEffect } from "react";
import { logout } from "../services/logout";
import StatusModal from "./StatusModal";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getProfile } from "../services/profile";


function NavBar({ onChange }) {
    const [modal, setModal] = useState(false);
    const [data, setData] = useState({});

    const navigate = useNavigate();
    const path = useLocation().pathname;
    const [pprofile, setPprofile] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }
    }, [navigate, data])

    useEffect(() => {
        async function getData() {
            try {
                const response = await getProfile();
                setPprofile(response.data);
                // console.log({response});
            } catch (err) {
                console.error("Get User Error ", err);
            }
        }
        getData();
    }, [onChange]);

    async function handleLogout(out) {
        setModal(false);
        if (out) {
            const response = await logout();
            console.log(response)
            setData(response);
        }

    }

    return (
        <>
            {modal
                ? <StatusModal
                    isOpen={modal}
                    onClose={handleLogout}
                    msg={data?.message}
                    status={data?.success}
                    ask={true}
                    action={'Logout'}
                />
                : ''}
            <nav className="bg-[#1b1b32] fixed w-full z-20 top-0 start-0 border-gray-200">
                <div className="flex flex-wrap items-center justify-between mx-auto px-20 py-4">
                    <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
                    </a>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-2">
                        <button type="button" className="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center hover:bg-blue-800" onClick={() => navigate('/profile')}>
                            <img
                                src={pprofile.photo_url}
                                className="w-10 h-10 rounded-full"
                            />
                        </button>
                        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2" onClick={() => setModal(true)}>Log Out</button>
                    </div>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <a
                                    href="/posts"
                                    className={`block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 ${path === '/posts' ? 'text-blue-700' : 'text-white'}`}
                                >Posts</a>
                            </li>
                            <li>
                                <a
                                    href="/admin"
                                    className={`block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 ${path === '/admin' ? 'text-blue-700' : 'text-white'}`}
                                >Posts Admin</a>
                            </li>
                            <li>
                                <a
                                    href="/category"
                                    className={`block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 ${path === '/category' ? 'text-blue-700' : 'text-white'}`}
                                >Category</a>
                            </li>
                            <li>
                                <a
                                    href="/labels"
                                    className={`block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 ${path === '/labels' ? 'text-blue-700' : 'text-white'}`}
                                >Labels</a>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
        </>

    );
}

export default NavBar