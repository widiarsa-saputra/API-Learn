import axios from "axios";

const token = `Bearer ${localStorage.getItem('token')}`;
const headers = {
    'Authorization': token,
    'Accept': 'application/json'
}

export async function getProfile() {
    try {
        const res = await axios.get(
            'https://api.gotra.my.id/api/v1/me',
            {headers}
        )
        return res.data;
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function updateProfile(formData) {
    try {
        const res = await axios.post(
            'https://api.gotra.my.id/api/v1/me',
            formData,
            {headers}
        );
        return res;
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function updatePhotoProfile(file) {
    try {
        const res = await axios.post(
            'https://api.gotra.my.id/api/v1/change-photo',
            file,
            {headers}
        );
        return res;
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function changeProfilePassword(formData) {
    try {
        const res = await axios.post(
            'https://api.gotra.my.id/api/v1/change-password',
            formData,
            {headers}
        );
        return res;
    } catch (err) {
        return Promise.reject(err);
    }
}