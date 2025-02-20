// import { useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
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
        className="flex text-primary border w-fit  mx-auto px-5 py-2 shadow cursor-pointer border-primary justify-center items-center gap-2 my-5"
      >
        {/* <FaGoogle /> */}
        <p>Sign With Google</p>
      </div>
    </>
  );
};

export default GoogleSign;