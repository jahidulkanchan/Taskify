// import { useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaGoogle } from "react-icons/fa6";
import useAxiosPublic from "../hooks/useAxiosPublic";

const GoogleSign = () => {
  const {signWithGoogle} = useAuth()
  const navigate  = useNavigate()
  const axiosPublic = useAxiosPublic()

  // Fetch users on mount
  const handleSignGoogle = async () => {
    try {
      const result = await signWithGoogle();
      const userInfo = {
        name: result.user?.displayName,
        email: result.user?.email,
      };
  
      // Fetch existing users and check if the user already exists
      const { data: existingUsers } = await axiosPublic.get("/users");
  
      const isUserExists = existingUsers.some(user => user.email === userInfo.email);
  
      if (!isUserExists) {
        await axiosPublic.post("/users", userInfo);
        console.log("New user added to the database.");
      } else {
        console.log("User already exists in the database.");
      }
  
      navigate("/");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };
  
  return (
    <>
      <div
        onClick={handleSignGoogle}
        className="flex text-primary rounded-sm border w-fit border-violet-500 mx-auto px-5 py-2 shadow cursor-pointer border-primary justify-center items-center gap-2 my-5"
      >
        <FaGoogle />
        <p className="text-[#4332b5]">Sign With Google</p>
      </div>
    </>
  );
};

export default GoogleSign;