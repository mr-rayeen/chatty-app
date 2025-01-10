import axios from 'axios';

export const axiosInstance = axios.create({
	baseURL:
		import.meta.env.MODE === "development"
			? "http://localhost:5001/api"
			: "https://chatty-app-backend-sandy.vercel.app/api",
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});