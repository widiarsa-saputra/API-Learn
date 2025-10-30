import axios from "axios";

const token = `Bearer ${localStorage.getItem('token')}`;

export async function getPosts(params = {}) {
    try {
        const response = await axios.get(
            'https://api.gotra.my.id/api/v1/post',
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                params
            },
        );
        // setPosts(response.data);
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function addPost(formData, id) {
    try {
        const response = await axios.post(
            `https://api.gotra.my.id/api/v1/post/${id ? id : ''}`,
            formData,
            {
                headers: {
                    "Authorization": token,
                    "Content-type": `${!id ? 'application/json' : 'multipart/form-data'}`,
                    "Accept": "application/json"
                }
            }
        )
        return response;
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function deletePost(index) {
    try {
        const response = await axios.delete(
            `https://api.gotra.my.id/api/v1/post/${index}`,
            {
                headers: {
                    'Authorization': token,
                    'Accept': 'application/json'
                }
            }
        );
        return response;
    } catch (err) {
        return Promise.reject(err);
    }
}