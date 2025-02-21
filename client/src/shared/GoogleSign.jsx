// import { useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaGoogle } from "react-icons/fa6";
// import useAxiosPublic from "../hooks/useAxiosPublic";


const GoogleSign = () => {
  const {signWithGoogle} = useAuth()
  const navigate  = useNavigate()
  // const axiosPublic = useAxiosPublic()
  const handleSignGoogle = ()=>{
    signWithGoogle()
    .then(async() => {
      // const userInfo = {
      //   name: result.user?.displayName,
      //   email: result.user?.email,
      //   role: 'user'
      // }
      // await axiosPublic.post(`/users/${result.user?.email}`, userInfo)
      
      // .then((err) => {
      //   console.log(err);
      // })
      navigate('/')
    })
  }
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