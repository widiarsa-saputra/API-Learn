import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";


function PostState() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const token = `Bearer ${localStorage.getItem('token')}`;
    const navigate = useNavigate();

    useEffect(() => {
        async function getPostId() {
            try {
                // const response = await axios.get(
                //     `https://api.gotra.my.id/api/v1/post/${id}`,
                //     {
                //         headers: {
                //             'Authorization': token,
                //             "Accept": "application/json"
                //         }
                //     }
                // )
                const response = await axios.get(
                    `https://api.gotra.my.id/api/v1/post/${id}`,
                    {
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }
                );
                setPost(response.data);
            } catch (err) {
                console.error("Get Post Id Error: ", err);
            }
        }
        getPostId();
    }, [token, id]);
    if (!post || !post.data) {
        return <div className="loading">Loading posts...</div>;
    } else {
        console.log("imge", post?.data.image_url)
    }

    return (
        <div className="post-container">
            <div className="post-card">
                <img src={`${post?.data.image_url}`} className="post-img" />
                <h3 className="post-title" >{post?.data.title}</h3>
                <p className="post-content">{post?.data.content}</p>
            </div>
            <div className="ctn">
                <button className="navigate-btn" onClick={() => navigate('/posts')}>Back</button>
            </div>
        </div>
    );
}

export default PostState;       