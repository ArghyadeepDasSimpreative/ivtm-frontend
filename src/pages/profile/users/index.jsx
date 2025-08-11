import { useState, useEffect } from "react"
import { privateRequest } from "../../../api/config";
import Table from "../../../components/Table";
import { capitalizeFirstLetter } from "../../../lib/text";
import { IoMdAdd } from "react-icons/io";


const UserManagement = ({ openUserAddModal }) => {
    const [usersLoading, setUsersLoading] = useState(true);
    const [usersList, setUsersList] = useState([]);
    const [error, setError] = useState(null);

    const fetchAllUsers = async() => {
         try {
               setError(null);
               const response = await privateRequest.get("/organisation-user/all-users");
               console.log(response.data);
               setUsersList(response.data.users || []);
         }
         catch(err) {
               console.error("Error fetching users:", err);
               setError("Failed to fetch users. Please try again.");
               setUsersList([]);
         }
         finally {
               setUsersLoading(false);
         }
    }

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const getRoleBadge = (role) => {
        const roleStyles = {
            admin: "bg-red-100 text-red-800 border-red-200",
            editor: "bg-blue-100 text-blue-800 border-blue-200", 
            viewer: "bg-green-100 text-green-800 border-green-200"
        };
        
        const defaultStyle = "bg-gray-100 text-gray-800 border-gray-200";
        const badgeStyle = roleStyles[role?.toLowerCase()] || defaultStyle;
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle}`}>
                {capitalizeFirstLetter(role) || 'Unknown'}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const tableConfig = [
        {
            key: 'profileImageUrl',
            label: 'Image',
            render: (value, user) => (
                <div className="flex items-center">
                    {value ? (
                        <img 
                            src={value} 
                            alt={user.username}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 text-xs font-medium">
                                {user.username?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'username',
            label: 'Username'
        },
        {
            key: 'businessEmail',
            label: 'Email'
        },
        {
            key: 'phoneNumber',
            label: 'Phone'
        },
        {
            key: 'role',
            label: 'Role',
            render: (value) => getRoleBadge(value)
        },
        {
            key: 'organisationName',
            label: 'Organization'
        },
        {
            key: 'createdAt',
            label: 'Created',
            render: (value) => formatDate(value)
        }
    ];

    if (usersLoading) {
        return (
            <div className="w-full h-[40vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 text-sm mt-2">Loading users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-[40vh] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-sm mb-2">{error}</p>
                    <button 
                        onClick={fetchAllUsers}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Add User Button */}
            <div className="flex justify-between items-center mb-1">
                <h1 className="text-lg font-semibold text-gray-800"></h1>
                <button 
                    onClick={openUserAddModal}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 cursor-pointer"
                >
                    <IoMdAdd />
                    Add New User
                </button>
            </div>

            {/* Users Table */}
            <Table 
                label="All Users"
                data={usersList}
                config={tableConfig}
            />
        </div>
    );
}

export default UserManagement;