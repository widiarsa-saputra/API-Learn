import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploader from "../ImageUploader";
import StatusModal from "../components/StatusModal";
import NavBar from "../components/NavBar";
import { getPosts } from "../services/posts";

function Post() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [posts, setPosts] = useState();

    useEffect(() => {
        async function getData() {
            try {
                // console.log({ token });
                const response = await getPosts();
                setPosts(response.data);
                // console.log({ response });
            } catch (err) {
                console.error('Get Posts error: ', err)
            }
        }
        if (token) {
            getData();
        };

        // setTimeout(() => {
        //     window.location.reload();
        // }, 500);
    }, [token])
    return (
        <>
            <NavBar />
            <section className="bg-gray-100 min-h-screen flex p-20 pt-30 flex flex-col text-[#1b1b32]">
                <h2 className="font-bold text-5xl tracking-widest">Latest Post</h2>
                <div className="flex mt-5 mb-8">
                    <p className="text-sm mt-4 w-3/4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, sequi fugit. Sit molestias repellat, iusto autem laborum harum quibusdam vitae?</p>
                </div>

                <div className="flex flex-wrap justify-between gap-2 gap-y-10 after:content-[''] after:flex-auto">
                    {posts
                        ? posts?.map((post) =>
                            <div key={post.id} className="flex  flex-col p-2 h-100 w-100">
                                <div className="flex items-center justify-center h-80 bg-[#1b1b32] rounded-lg overflow-hidden ">
                                    <img
                                        src={`${post.image_url}`}
                                        className="object-contain max-h-full cursor-pointer"
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
                                <h3
                                    className="font-bold underline underline-offset-1 uppercase text-md mb-3 cursor-pointer"
                                    onClick={() => navigate(`/posts/${post.id}`)}>{post.title}</h3>
                                <p className="post-content">{post.content}</p>
                            </div>
                        )
                        : <div className="w-full h-full flex justify-start items-center">
                            <button
                                className="px-4 py-2 bg-[#1b1b32] text-white cursor-pointer rounded-lg"
                                onClick={() => window.location.reload()}
                            >Refresh</button>
                        </div>}
                </div>
            </section>
        </>
    );
}

export default Post;