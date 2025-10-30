import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploader from "../ImageUploader";
import StatusModal from "../components/StatusModal";
import ImageModal from "../components/ImageModal"
import NavBar from "../components/NavBar";
import { addPost, deletePost, getPosts } from "../services/posts";
import LoadingComponent from "../components/LoadingComponent";
import { getCategory } from "../services/category";

function PostsAdmin() {
    const navigate = useNavigate();
    const token = `Bearer ${localStorage.getItem('token')}`;

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }
    }, [navigate])

    const [posts, setPosts] = useState(null);
    const [isAdd, setIsAdd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [idPost, setIdPost] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [isImgChange, setIsImgChange] = useState(null);
    const [showImage, setShowImage] = useState(false);
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(10);
    const [category, setCategory] = useState({});
    const [catId, setCatId] = useState('');
    const [data, setData] = useState(null);
    const [modal, setModal] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [catPosts, setCatPosts] = useState('');
    const [indexData, setIndexData] = useState(0);

    useEffect(() => {
        async function getData() {
            try {
                const params = {
                    paginate: selected,
                    page,
                    include: 'category',
                    ...(catPosts ? { 'filter[category_id]': catPosts } : {})
                }
                const response = await getPosts(params);

                setPosts(response);
                setIndexData(response.pagination.from);
            } catch (err) {
                console.error('Get Posts Error: ', err)
            }
        }
        getData();
    }, [page, selected, data, catPosts])

    async function addData() {
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("image", selectedImage);
            formData.append("category_id", catId);

            const response = await addPost(formData);

            setIsAdd(false);
            reset();
            setData(response);
            setModal(true);
        } catch (err) {
            setModal(true);
            setImgUrl('');
            console.error("Handle Submit Error: ", err);
        }
    }

    async function deleteData(id) {
        setIsDelete(true);
        try {
            reset();
            const response = await deletePost(id);

            setData(response);
            setModal(true);
            setIsDelete(false);
        } catch (err) {
            console.error("Delete error: ", err);
            setIsDelete(false);
        }
    }

    useEffect(() => {
        async function getCategoryData() {
            try {
                const response = await getCategory();

                setCategory(response.data);
                setCatId(response.data.data[0].id);
            } catch (err) {
                console.error('Get category error: ', err)
            }
        }
        getCategoryData();
    }, [token, data])

    async function editPost() {
        try {
            const formData = new FormData();
            formData.append("_method", "PUT");
            formData.append("title", title);
            formData.append("content", content);
            formData.append("category_id", catId);
            if (isImgChange) {
                formData.append("image", selectedImage);
            }

            const response = await addPost(formData, idPost);

            reset();
            setIsEdit(false);
            setData(response);
            setModal(true);
        } catch (err) {
            reset()
            setModal(true);
            console.error("Error EditPost ", err);
        }
    }

    function handleImageChange(data) {
        setSelectedImage(data.file);
        setIsImgChange(data.change);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        // console.log({ selectedImage });
        if (!selectedImage && isAdd) {
            alert("Add image First!");
            return;
        }
        setIsSubmit(true);
        if (isAdd) {
            addData();
        } else if (isEdit) {
            editPost();
        }
    }

    function currentEdit(id) {
        const currentPost = posts.data.find((post) => post.id === id);
        setIsAdd(false)
        setIsEdit(true);
        setTitle(currentPost.title);
        setContent(currentPost.content);
        setImgUrl(currentPost.image_url);
        setIdPost(currentPost.id);
        setCatId(currentPost.category_id);
    }

    function reset() {
        setIsSubmit(false);
        setImgUrl(null);
        setTitle('');
        setContent('');
        setModal(false);
        setSelected(10);

        setSelectedImage(null);
        setIsImgChange(false);
    }


    function addToggle() {
        reset();
        setIsAdd(prev => !prev);
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
            <NavBar />
            {isDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <LoadingComponent className='w-20 h-20' isLoading={isDelete} />
                </div>
            )}
            {modal
                ? <StatusModal
                    isOpen={modal}
                    onClose={reset}
                    msg={data?.data.message}
                    status={data?.data.success}
                    // msg={data}
                    // status={data}
                    ask={false}
                    action={'Delete'}
                />
                : ''}
            {showImage
                ? <ImageModal
                    url={imgUrl}
                    onClose={() => showImageModal('', '', false)}
                    title={title}
                />
                : ''}
            <section className="bg-gray-100 min-h-screen flex p-20 pt-30 flex flex-col text-[#1b1b32]">
                <h2 className="font-bold text-5xl tracking-widest">Posts Admin</h2>
                <div className="flex mt-5">
                    <p className="text-sm mt-4 w-3/4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, sequi fugit. Sit molestias repellat, iusto autem laborum harum quibusdam vitae?</p>
                    <div className="flex justify-end gap-4 w-1/4">
                        <button
                            className="cursor-pointer text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-4 py-2 md:px-5 md:py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={addToggle}>Add Post</button>
                    </div>
                </div>
                <div className="flex justify-center mt-5">
                    {isAdd || isEdit
                        ? <form className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center " onSubmit={handleSubmit}>
                            <div className="flex flex-col h-100 justify-center">
                                <ImageUploader onImageChange={handleImageChange} currentImg={imgUrl} />
                                <input className="p-2 mt-8 rounded-xl border" placeholder="Title..." value={title} onChange={(e) => setTitle(e.target.value)} />
                                <select value={catId} className="p-2 rounded-xl border" onChange={(e) => setCatId(e.target.value)}>
                                    {category.data?.map((cat) =>
                                        <option value={cat.id} key={cat.id}>{cat.name}</option>
                                    )}
                                </select>
                            </div>
                            <div className="md:w-1/2 px-8 flex flex-col gap-4 h-full w-full">
                                <textarea className="p-2 rounded-xl border h-full w-full text-center" placeholder="Content goes here... " value={content} onChange={(e) => setContent(e.target.value)} />
                                <button
                                    type="submit"
                                    className="cursor-pointer login-btn bg-[#002d74] rounded-xl text-white py-2 text-white duration-300"
                                >
                                    <div className="flex items-center justify-center w-full rounded-lg">
                                        <LoadingComponent isLoading={isSubmit} title={isAdd ? 'Add' : 'Edit'} />
                                    </div>
                                </button>
                                <input type="hidden" name="_method" value='PUT' />
                            </div>
                        </form>
                        : null}
                </div>
                <div className="relative overflow-x-auto">
                    <div className="border grid grid-cols-[0.5fr_1fr_2fr_4fr_1fr__1fr] text-center bg-[#1b1b32] text-white rounded-t-lg">
                        <p className="border px-2 py-4">No</p>
                        <p className="border px-2 py-4">Image</p>
                        <p className="border px-2 py-4">Title</p>
                        <p className="border px-2 py-4">Content</p>
                        <div className="border px-2 py-4 flex justify-center">
                            <p className="mr-2">Category</p>
                            <select className="w-4" value={catPosts} onChange={(e) => setCatPosts(e.target.value)}>
                                <option value='' className="text-[#1b1b32]"></option>
                                {category.data?.map((cat) =>
                                    <option
                                        value={cat.id}
                                        key={cat.id}
                                        className="text-[#1b1b32]"
                                    >{cat.name}</option>
                                )}
                            </select>
                        </div>
                        <p className="border px-2 py-4">Action</p>
                    </div>
                    {posts?.data.map((post, index) =>
                        <div key={post.id} className="grid grid-cols-[0.5fr_1fr_2fr_4fr_1fr_1fr] text-center">
                            <p className="py-4">{indexData + index}</p>
                            <div className="py-4 flex justify-center">
                                <img
                                    src={`${post.image_url}`}
                                    className="w-12 h-12 object-cover rounded cursor-pointer"
                                    onClick={() => showImageModal(post.image_url, post.title, true)}
                                />
                            </div>
                            <p className="py-4">{post.title}</p>
                            <p className="py-4">{post.content}</p>
                            <p className="py-4">{post.category?.name ? post.category?.name : "Null"}</p>
                            <div className="py-4 flex gap-1 justify-center">
                                <button
                                    className="bg-green-500 px-4 py-2 rounded-xl text-white cursor-pointer active:bg-green-600"
                                    onClick={() => currentEdit(post.id)}
                                >edit</button>
                                <button
                                    className="bg-red-500 px-4 py-2 rounded-xl text-white cursor-pointer active:bg-red-600"
                                    onClick={() => deleteData(post.id)}
                                >delete</button>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                            onClick={() => setPage((prev) => prev - 1)}
                            disabled={posts?.pagination.current_page === 1 ? true : false}
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
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                            onClick={() => setPage((prev) => prev + 1)}
                            disabled={posts?.pagination.current_page === Math.ceil(posts?.pagination.total / posts?.pagination.per_page) ? true : false}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default PostsAdmin;