import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth/useAuth";
import useAxiosSecure from "./useAxiosSecure/useAxiosSecure";

const useUserData = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: userData = null } = useQuery({
        queryKey: ['userData', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/user/${user.email}`);
            return res.data;
        }
    });

    return userData;
};

export default useUserData;