import { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";
import { FaTrashAlt, FaUsers } from "react-icons/fa";

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [users, setUsers] = useState([]);

    // load all users
    const fetchUsers = () => {
        axiosSecure.get('/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // change user role to admin
    const handleMakeAdmin = (user) => {
        axiosSecure.patch(`/users/admin/${user._id}`)
            .then(res => {
                if(res.data.modifiedCount > 0){
                    toast.success(`${user.name} is an Admin Now!`);
                    fetchUsers(); 
                }
            })
    };

    // Change user role to manager 
    const handleMakeManager = (user) => {
        axiosSecure.patch(`/users/manager/${user._id}`)
            .then(res => {
                if(res.data.modifiedCount > 0){
                    toast.success(`${user.name} is a Manager Now!`);
                    fetchUsers();
                }
            })
    };

    // Delete user
    const handleDeleteUser = (user) => {
        if(window.confirm('Are you sure?')) {
             axiosSecure.delete(`/users/${user._id}`)
                .then(res => {
                    if(res.data.deletedCount > 0){
                        toast.success('User deleted');
                        fetchUsers();
                    }
                })
        }
    };

    return (
        <div>
            <div className="flex justify-evenly my-4">
                <h2 className="text-3xl">All Users</h2>
                <h2 className="text-3xl">Total Users: {users.length}</h2>
            </div>
            
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user, index) => <tr key={user._id}>
                                <th>{index + 1}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    { user.role === 'admin' ? 'Admin' : 
                                        <button
                                            onClick={() => handleMakeAdmin(user)}
                                            className="btn btn-lg bg-orange-500 text-white">
                                            <FaUsers className="text-white text-2xl"></FaUsers>
                                        </button>
                                        || user.role === 'manager' ? 'Manager' :
                                        <button
                                            onClick={() => handleMakeManager(user)}
                                            className="btn btn-lg bg-orange-500 text-white">
                                            <FaUsers className="text-white text-2xl"></FaUsers>
                                        </button>
                                    }
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteUser(user)}
                                        className="btn btn-ghost btn-lg">
                                        <FaTrashAlt className="text-red-600"></FaTrashAlt>
                                    </button>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;