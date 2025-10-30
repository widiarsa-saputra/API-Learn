import axios from "axios";

const token = `Bearer ${localStorage.getItem('token')}`;

export async function getCategory(params = {}) {
    try {
        const response = await axios.get(
            'https://api.gotra.my.id/api/v1/category',
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
        return response;
    } catch (err) {
        return Promise.reject(err);
    }
}