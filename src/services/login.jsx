import axios from "axios";

export async function login(data) {
    try {
        const response = await axios.post(
            "https://api.gotra.my.id/api/v1/login",
            {
                email: data.email,
                password: data.password,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                responseType: "json",
            }
        );
        // setModal(true);
        // setData(response.data);
        // onLoginSuccess((response.data));
        return response.data;
    } catch (error) {
        // setModal(true);
        // setData(error.response.data)
        // console.error("Login gagal:", error.response.data.success);
        return Promise.reject(error);

    }
}