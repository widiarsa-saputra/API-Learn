import axios from "axios";

export async function logout() {
    const token = `Bearer ${localStorage.getItem("token")}`;

    
    try {
        const response = await axios.post(
            "https://api.gotra.my.id/api/v1/logout",
            {},
            {
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            }
        );
        localStorage.removeItem("token");
        return response.data;
    } catch (err) {
        console.error("Logout gagal: ", err);
    }
}