import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploader from "./ImageUploader";
import { logoutUser } from './Logout';
import StatusModal from "./components/StatusModal";
import NavBar from "./components/NavBar";

function Post() {
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
    const [selectedImage, setSelectedImage] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [change, setChange] = useState(null);
    const [idPost, setIdPost] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [isImgChange, setIsImgChange] = useState(null);
    const [modal, setModal] = useState(false);

    async function addPost() {
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("image", selectedImage);
            const response = await axios.post(
                'https://api.gotra.my.id/api/v1/post',
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

    function handleImageChange(data) {
        setSelectedImage(data.file);
        setIsImgChange(data.change);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!selectedImage && isAdd) {
            alert("Pilih gambar dulu!");
            return;
        }
        if (isAdd) {
            addPost();
        } else if (isEdit) {
            editPost();
        }
    }

    async function deletePost(id) {
        try {
            const response = await axios.delete(
                `https://api.gotra.my.id/api/v1/post/${id}`,
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
                    'https://api.gotra.my.id/api/v1/post',
                    {
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }
                );
                setPosts(response.data);
            } catch (err) {
                console.error('Get Posts gagal: ', err)
            }
        }
        getPosts()
    }, [change, token, posts])

    async function editPost() {
        try {
            const formData = new FormData();
            formData.append("_method", "PUT");
            formData.append("title", title);
            formData.append("content", content);
            if (isImgChange) {
                formData.append("image", selectedImage);
            }
            const response = await axios.post(
                `https://api.gotra.my.id/api/v1/post/${idPost}`,
                formData,
                {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    }
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
        setIsAdd(false)
        setIsEdit(currentPost.id);
        setTitle(currentPost.title);
        setContent(currentPost.content);
        setImgUrl(currentPost.image_url);
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
            setData(response)
            setModal(true)
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
            <NavBar />
            <section className="bg-gray-100 min-h-screen flex p-20 pt-30 flex flex-col text-[#1b1b32]">
                <h2 className="font-bold text-5xl tracking-widest">Latest Post</h2>
                <div className="flex mt-5">
                    <p className="text-sm mt-4 w-3/4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, sequi fugit. Sit molestias repellat, iusto autem laborum harum quibusdam vitae?</p>
                    <div className="flex justify-end gap-4 w-1/4">
                        <button
                            className="cursor-pointer text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-4 py-2 md:px-5 md:py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={addToggle}>Add Post</button>
                        <button className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-sm px-3 py-2 md:px-5 md:py-2.5"
                            onClick={() => setModal(true)}>Log out</button>
                    </div>
                </div>
                <div className="flex justify-center mt-5">
                    {isAdd || isEdit
                        ? <form className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center " onSubmit={handleSubmit}>
                            <div className="flex flex-col h-100 justify-center">
                                <ImageUploader onImageChange={handleImageChange} currentImg={imgUrl} />
                                <input className="p-2 mt-8 rounded-xl border" placeholder="Title..." value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="md:w-1/2 px-8 flex flex-col gap-4 h-full w-full">
                                <textarea className="p-2 rounded-xl border h-full w-full text-center" placeholder="Content goes here... " value={content} onChange={(e) => setContent(e.target.value)} />
                                <button type="submit" className="cursor-pointer login-btn bg-[#002d74] rounded-xl text-white py-2 text-white duration-300">{isAdd ? 'Add' : 'Edit'}</button>
                                <input type="hidden" name="_method" value='PUT' />
                            </div>
                        </form>
                        : null}
                </div>

                <div className="flex flex-wrap justify-between gap-2 border gap-y-10">
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
                            <p className="post-content">{post.content}</p>
                            <div className="ctn">
                                <button className="edit-btn" onClick={() => currentEdit(post.id)}>edit</button>
                                <button className="delete-btn" onClick={() => deletePost(post.id)}>delete</button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default Post;