import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../App/Store';
import { UserInterface } from '../Interface/UserInterface';
import { signOut } from '../App/UserSlice';
import { useNavigate } from 'react-router-dom';
import { userLogout } from '../Api/User';
import toast from 'react-hot-toast';

function Navbar() {
    const user = useSelector((state: RootState) => state.user?.currentUser) as UserInterface | null;
    const dispatch = useDispatch();
    const navigate = useNavigate();  // If you want to redirect after logout

    const logoutUser = async () => {
        const result=await userLogout()
        dispatch(signOut()); 
        toast.success("You are logout Successfully") 
        if(result){
            navigate('/login');  // Redirect user to the login page
        }
    };

    return (
        <nav className="bg-gray-900 text-white px-4 py-3 flex justify-between items-center shadow-md">
            {/* Site Name */}
            <div className="text-xl font-bold">MyWebsite</div>

            {/* User Greeting and Logout */}
            <div className="flex items-center space-x-4">
                {/* Greeting */}
                <span className="text-sm">
                    Hello, <span className="font-semibold">{user?.username}</span>!
                </span>

                {/* Logout Button */}
                <button
                    onClick={logoutUser}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
