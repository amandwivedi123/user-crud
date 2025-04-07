import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router";

export default function ViewUsers() {
    const { id } = useParams();
    const [user, setUser] = useState([]);

    // Fetch user data by ID
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:2000/getUserById/${id}`);
                setUser(response.data.result);
                console.log(response.data.result);
            } catch (err) {
                console.error("Error fetching user:", err);

            }
        };
        fetchUser();
    }, [id]);

    if (!user || user.length === 0) {
        return <div className="items-center">Loading...</div>;
    }

    return (
        <div className="p-4">
            {user.map((u) => (
                <div key={u.id} className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-4">
                    <div className="px-6 py-4">
                        <h1 className="text-xl font-bold mb-2">User Details</h1>
                        <p className="text-gray-700 text-base">
                            <strong>ID:</strong> {u.id}
                        </p>
                        <p className="text-gray-700 text-base">
                            <strong>Name:</strong> {u.name}
                        </p>
                        <p className="text-gray-700 text-base">
                            <strong>Email:</strong> {u.email}
                        </p>
                        <p className="text-gray-700 text-base">
                            <strong>Gender:</strong> {u.gender}
                        </p>
                        <p className="text-gray-700 text-base">
                            <strong>Password:</strong> {u.password}
                        </p>
                        <Link to="/"><Button className="bg-gray-700 cursor-pointer p-2 w-30 mt-5">Return</Button></Link>
                    </div>
                </div>
            ))
            }
        </div >
    );
}