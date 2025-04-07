
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";

export default function Update() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const [user, setUsers] = useState({
        name: "",
        email: "",
        gender: "",
        password: ""
    });

    // Fetch user data if in update mode
    useEffect(() => {
        if (id) {
            const fetchUser = async () => {
                try {
                    const response = await axios.get(`http://localhost:2000/getUserById/${id}`);
                    const responseData = response.data.result[0];
                    setUsers(responseData);
                    setValue("name", responseData.name);
                    setValue("email", responseData.email);
                    setValue("gender", responseData.gender);
                    setValue("password", responseData.password);
                    // console.log(responseData)
                } catch (err) {
                    console.error("Error fetching user:", err);
                }
            };
            fetchUser();
        }
    }, [id, setValue]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsers((prevUser) => ({ ...prevUser, [name]: value }));
    };
    const handleSub = async (data) => {
        // console.log(data)
        try {
            if (id) {
                await axios.put(`http://localhost:2000/updateUser/${id}`,data);
            } else {
                await axios.post("http://localhost:2000/addUser", data)
            }
            navigate("/");
        } catch (err) {
            console.error("Error saving user:", err);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{id ? "Update User" : "Add User"}</h1>

            <form onSubmit={handleSubmit(handleSub)}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                        type="text"
                        {...register("name", {
                            required: "Name is required",
                            maxLength: { value: 30, message: "Name should be less than 30 characters" },
                            minLength: { value: 3, message: "Name should be more than 3 characters" }
                        })}
                        value={user.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                        })}
                        className="w-full p-2 border border-gray-300 rounded"

                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            pattern: { value: "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$", message: "Invalid email format" },
                        })}
                        value={user.password}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Gender</label>
                    <select
                        {...register("gender", { required: "Gender is required" })}
                        value={user.gender}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
                </div>

                <button
                    type="submit"
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 cursor-pointer"
                >
                    {id ? "Update User" : "Add User"}
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-600 ml-4 cursor-pointer"
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}
