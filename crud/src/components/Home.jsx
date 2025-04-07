import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, button } from "@material-tailwind/react";
import { FaRegEdit } from "react-icons/fa";
import { CiRead } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { Spinner } from "@material-tailwind/react";
import { Link } from "react-router";
import { useAuth } from "./AuthContext";

const table_head = ["ID", "Email", "Name", "Password", "Gender", "Actions"];

export default function Home() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();
    // Fetch users from the server
    useEffect(() => {
        const fetchUsers = async () => {

            try {
                const response = await axios.get("http://localhost:2000/getAllUsers");
                setUsers(response.data.result);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching users:", error);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Handle delete user
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:2000/deleteUser/${id}`);
            setUsers(users.filter((user) => user.id !== id));

        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <>
            <div className="flex justify-end mr-30 mt-10 gap-5 "> <Link to="/addUser"><button className="bg-slate-900 p-3 rounded-xl text-white text-bold hover:bg-slate-600 transition-all transition-ease transition-duration-100 cursor-pointer"> Add User</button></Link> <div>
       
       <button onClick={logout}  className="bg-slate-900 p-3 rounded-xl text-white text-bold hover:bg-slate-600 transition-all transition-ease transition-duration-100 cursor-pointer"  >Logout</button>
   </div></div>
            <Card className="h-full w-full overflow-x-auto p-4 shadow-lg   text-Poppins">
                <table className="w-full min-w-max table-auto text-left border-collapse">

                    <thead>
                        <tr className="bg-gradient-to-r from-slate-700 to-slate-700 text-white">
                            {table_head.map((head) => (
                                <th
                                    key={head}
                                    className="border-b border-blue-gray-100 p-4 text-sm font-semibold uppercase"
                                >
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={table_head.length} className="text-center p-4">
                                    <div className="flex gap-3 justify-center">
                                        <span>Loading...</span>
                                        <Spinner className="h-6 w-6 text-bold" />
                                    </div>
                                </td>
                            </tr>
                        ) : users.length > 0 ? (
                            users.map(({ id, name, email, password, gender }) => (
                                <tr key={id} className="hover:bg-slate-100 transition-colors duration-200">
                                    <td className="p-4">{id}</td>
                                    <td className="p-4 ">{email}</td>
                                    <td className="p-4 ">{name}</td>
                                    <td className="p-4 ">{password}</td>
                                    <td className="p-4 ">{gender}</td>
                                    <td className="pt-1 flex pb-1 w-auto items-center">

                                        <Link to={`readData/${id}`}><Button className="text-black text-2xl font-bold cursor-pointer  mt-4"><CiRead /></Button></Link>
                                        <Link to={`updateUser/${id}`}> <Button color="green" className="text-blue-500 text-xl font-bold cursor-pointer bg-transparent"> <FaRegEdit /></Button></Link>
                                        <Button onClick={() => handleDelete(id)} className="text-red-600 text-2xl font-bold cursor-pointer "> <MdDeleteOutline /></Button>

                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={table_head.length} className="text-center p-4">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody >
                </table >
                
            </Card >
        </>
    );

}