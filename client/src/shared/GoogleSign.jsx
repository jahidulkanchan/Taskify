import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaGoogle } from "react-icons/fa6";
import useAxiosPublic from "../hooks/useAxiosPublic";

const GoogleSign = () => {
  const { signWithGoogle } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const handleSignGoogle = async () => {
    try {
      const result = await signWithGoogle();
      navigate("/");
      const userInfo = {
        name: result.user?.displayName,
        email: result.user?.email,
      };

      const { data: existingUsers } = await axiosPublic.get("/users");
      const isUserExists = existingUsers?.some(user => user?.email === userInfo?.email);
      if (!isUserExists) {
        await axiosPublic.post("/users", userInfo);
      } else {
        console.log("User already exists in the database.");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4">
      {/* Heading with bg-clip-text */}
      <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
        Join Now & Elevate Your Productivity
      </h2>

      {/* Google Sign-In Button */}
      <div
        onClick={handleSignGoogle}
        className="relative group flex items-center justify-center gap-3 w-full max-w-xs mx-auto px-6 py-3 rounded-xl text-white font-medium shadow-lg cursor-pointer transition-all duration-300
      bg-white bg-opacity-10 backdrop-blur-lg border hover:border-purple-500 hover:shadow-purple-500/50"
      >
        <FaGoogle className="text-lg  text-purple-600 transition group-hover:scale-110" />
        <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent group-hover:text-purple-400">
          Sign in with Google
        </span>
      </div>
    </div>
  );
};

export default GoogleSign;
