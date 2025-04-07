import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import {
    Card,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";

export function Login() {
    const navigate = useNavigate();
    const { login } = useAuth(); // Access the login function from AuthContext
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [loginMessage, setLoginMessage] = useState("");

    async function MatchData(data) {
        try {
            const response = await axios.post("http://localhost:2000/login", data);
            setLoginMessage("Login Successful");
            login(); // Update authentication state
            navigate("/"); // Redirect to the homepage
        } catch (error) {
            if (error.response && error.response.data) {
                setLoginMessage(error.response.data.message);
            } else {
                setLoginMessage("An error occurred while logging in");
            }
        }
    }

    return (
        <div className="w-screen flex justify-center mt-6 font-roboto">
            <Card color="transparent" shadow={true} className="bg-gray-200 p-8 bg-opacity-80 shadow-2lg shadow-2xl rounded-3xl">
                <Typography variant="h4" color="blue-gray">
                    Login
                </Typography>

                <form onSubmit={handleSubmit(MatchData)} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                    <div className="mb-1 flex flex-col gap-3">
                        <Typography variant="h6" color="blue-gray">
                            Your Email <span className="text-red-600">*</span>
                        </Typography>
                        <Input 
                            size="lg"
                            placeholder="name@mail.com"
                            {...register("email", {
                                required: "Email is required",
                                maxLength: 30,
                                minLength: 3,
                            })}
                            onFocus={() => setLoginMessage("")}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        <Typography variant="h6" color="blue-gray">
                            Password <span className="text-red-600">*</span>
                        </Typography>
                        <Input
                            type="password"
                            size="lg"
                            placeholder="********"
                            {...register("password", { required: "Password is required" })}
                            onFocus={() => setLoginMessage("")}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" className="h-11 pl-6 w-50 pr-3 text-sm mt-6 bg-slate-800 text-slate-300 rounded-3xl cursor-pointer">
                            Login
                        </Button>
                    </div>
                    {loginMessage && (
                        <Typography
                            color={loginMessage === "Login Successful" ? "green" : "red"}
                            className="mt-4 text-center font-semibold"
                        >
                            {loginMessage}
                        </Typography>
                    )}
                </form>
            </Card>
        </div>
    );
}