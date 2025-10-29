import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploader from "./ImageUploader";
import { logoutUser } from './Logout';
import StatusModal from "./components/StatusModal";
import ImageModal from "./components/ImageModal"
import NavBar from "./components/NavBar";

function Categories() {
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const token = `Bearer ${localStorage.getItem('token')}`;

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }
    }, [navigate, data])

    const [posts, setPosts] = useState(null);
    const [isAdd, setIsAdd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [change, setChange] = useState(null);
    const [idPost, setIdPost] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [modal, setModal] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(10)


    async function addPost() {
        try {
            const formData = new FormData();
            formData.append("name", title);
            formData.append("description", content);
            const response = await axios.post(
                'https://api.gotra.my.id/api/v1/category',
                formData,
                {
                    headers: {
                        "Authorization": token,
                        "Accept": "application/json"
                    }
                }
            )
            setTitle('');
            setContent('');
            setIsAdd(false);
            setChange(response.data);
        } catch (err) {
            console.error("Handle Submit Error: ", err);
            console.error("Response dari server:", err.response?.data);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (isAdd) {
            addPost();
        } else if (isEdit) {
            editPost();
        }
    }

    async function deletePost(id) {
        try {
            const response = await axios.delete(
                `https://api.gotra.my.id/api/v1/category/${id}`,
                {
                    headers: {
                        'Authorization': token,
                        'Accept': 'application/json'
                    }
                }
            );
            alert(response.data.message);
            setChange(response.data);
        } catch (err) {
            console.error("Delete error: ", err);
        }
    }

    useEffect(() => {
        async function getPosts() {
            try {
                const response = await axios.get(
                    'https://api.gotra.my.id/api/v1/category',
                    {
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        params: {
                            'paginate': selected,
                            'page': page
                        }
                    }
                );
                setPosts(response.data);
            } catch (err) {
                console.error('Get Posts gagal: ', err)
            }
        }
        getPosts();
    }, [change, token, page, selected])

    async function editPost() {
        try {
            const formData = new FormData();
            formData.append("_method", "PUT");
            formData.append("name", title);
            formData.append("description", content);
            const response = await axios.post(
                `https://api.gotra.my.id/api/v1/category/${idPost}`,
                formData,
                {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    },
                }
            );
            setTitle('');
            setContent('');
            setIsEdit(false);
            setChange(response.data);
        } catch (err) {
            console.error("Error EditPost ", err);
        }
    }

    function currentEdit(id) {
        const currentPost = posts.data.find((post) => post.id === id);
        console.log(currentPost);
        setIsAdd(false)
        setIsEdit(currentPost.id);
        setTitle(currentPost.name);
        setContent(currentPost.description);
        setIdPost(currentPost.id);
    }

    function addToggle() {
        setImgUrl(null);
        setIsAdd(prev => !prev);
        setTitle('');
        setContent('');
        setIsEdit(false);
    }

    async function handleLogout(out) {
        setModal(false);
        if (out) {
            const response = await logoutUser();
            setData(response);
            setModal(true);
        }

    }

    function showImageModal(url, title, open) {
        setImgUrl(url);
        setTitle(title);
        setShowImage(open);
    }

    function handlePagePagination(e) {
        setSelected(Number(e.target.value));
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
            {showImage
                ? <ImageModal
                    url={imgUrl}
                    onClose={() => showImageModal('', '', false)}
                    title={title}
                />
                : ''}
            <NavBar />
            <section className="bg-gray-100 min-h-screen flex p-20 pt-30 flex flex-col text-[#1b1b32]">
                <h2 className="font-bold text-5xl tracking-widest">Labels</h2>
                <div className="flex mt-5">
                    <p className="text-sm mt-4 w-3/4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, sequi fugit. Sit molestias repellat, iusto autem laborum harum quibusdam vitae?</p>
                    <div className="flex justify-end gap-4 w-1/4">
                        <button
                            className="cursor-pointer text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-4 py-2 md:px-5 md:py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={addToggle}>Add Label</button>
                        <button className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 text-sm px-3 py-2 md:px-5 md:py-2.5"
                            onClick={() => setModal(true)}>Log out</button>
                        <button className="cursor-pointer text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 text-sm px-3 py-2 md:px-5 md:py-2.5"
                            onClick={() => navigate('/posts')}>Posts</button>
                    </div>
                </div>
                <div className="flex justify-center mt-5">
                    {isAdd || isEdit
                        ? <form className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center mb-3" onSubmit={handleSubmit}>
                            <div className="md:w-full px-8 flex flex-col gap-4 h-full w-full mt-8">
                                <div className="flex gap-1 items-center">
                                    <input className="p-2 rounded-sm border" placeholder="Name..." value={title} onChange={(e) => setTitle(e.target.value)} />
                                    <input className="p-2 rounded-sm border" placeholder="Description..." value={content} onChange={(e) => setContent(e.target.value)} />

                                </div>

                                <button type="submit" className="cursor-pointer login-btn bg-[#002d74] rounded-xl text-white py-2 text-white duration-300">{isAdd ? 'Add' : 'Edit'}</button>
                                <input type="hidden" name="_method" value='PUT' />
                            </div>
                        </form>
                        : null}
                </div>

                {/* <div className="flex flex-wrap justify-between gap-2 border gap-y-10">
                    {posts?.data.map((post) =>
                        <div key={post.id} className="border p-2 h-100 w-100">
                            <div className="flex items-center justify-center h-80 bg-[#1b1b32] rounded-lg overflow-hidden ">
                                <img
                                    src={`${post.image_url}`}
                                    className="object-contain max-h-full"
                                    onClick={() => navigate(`/posts/${post.id}`)}
                                />
                            </div>
                            <p className="text-gray-500 text-right">
                                {new Date(post.updated_at).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                            <h3 className="post-title" onClick={() => navigate(`/posts/${post.id}`)}>{post.title}</h3>
                            <p className="post-content">{post.contimage_urlent}</p>
                            <div className="ctn">
                                <button className="edit-btn" onClick={() => currentEdit(post.id)}>edit</button>
                                <button className="delete-btn" onClick={() => deletePost(post.id)}>delete</button>
                            </div>
                        </div>
                    )}
                </div> */}
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3 w-[10px]">
                                    No
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3 w-[300px]">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {console.log(posts)} */}
                            {posts?.data.map((post, index) =>
                                <tr className={`bg-white border-b dark:border-gray-700 border-gray-200 text-[#1b1b32]`} key={post.id}>
                                    <td className="px-6 py-4">
                                        {index + 1}.
                                    </td>
                                    <td className="px-6 py-4">
                                        {post.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-8 h-8 cursor-pointer rounded-full`}
                                                style={{ backgroundColor: post.color }}
                                                title="Klik untuk ubah warna"
                                            ></div>
                                            <span>{post.description}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button className="bg-green-500 px-4 py-2 rounded-xl text-white cursor-pointer" onClick={() => currentEdit(post.id)}>edit</button>
                                            <button className="bg-red-500 px-4 py-2 rounded-xl text-white cursor-pointer" onClick={() => deletePost(post.id)}>delete</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4">
                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg disabled:opacity-50 cursor-pointer"
                            onClick={() => setPage((prev) => prev - 1)}
                        // disabled={() => {}}
                        >
                            ← Prev
                        </button>

                        <div className="flex gap-2 justify-center items-center">
                            <span className="text-gray-700">
                                Page  {posts?.pagination.current_page} of {Math.ceil(posts?.pagination.total / posts?.pagination.per_page)}
                            </span>
                            <select
                                id="role"
                                value={selected}
                                onChange={handlePagePagination}
                                className="border border-gray-300 rounded-lg px-1 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="10">10</option>
                                <option value="5">5</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                            </select>
                        </div>

                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg disabled:opacity-50 cursor-pointer"
                            onClick={() => setPage((prev) => prev + 1)}
                        // disabled={() => {}}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Categories;