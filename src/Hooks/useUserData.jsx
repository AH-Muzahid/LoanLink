import { useEffect, useState } from "react";
import useAuth from "./useAuth/useAuth";
import useAxiosSecure from "./useAxiosSecure/useAxiosSecure";

const useUserData = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (user?.email && !loading) {
            axiosSecure.get(`/user/${user.email}`)
                .then(res => {
                    setUserData(res.data);
                })
        }
    }, [user, loading, axiosSecure]);

    return userData;
};

export default useUserData;