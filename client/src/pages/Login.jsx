import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import GoogleSign from "../shared/GoogleSign";

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm();


  const [errorMessage,setErrorMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const {signInUser,setUser} = useAuth()
  const onSubmit = (data) => {
    const {email, password } = data;
    console.log(email, password);
    signInUser(email, password)
      .then((result) => {
        const user = result.user;
        if (user) {
          toast.success('Login successful')
          setUser(user);
          reset();
          navigate(location.state || '/')
          window.scrollTo(0, 0);
        }
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  };

  return (
    <>
       <section className={`container bg-slate-50 px-2 mx-auto pb-10 pt-10 min-h-[600px]`}>
        <h2 className="text-3xl text-center font-semibold mb-3 md:mb-5">
        <span>Log In to </span>
          <span 
           style={{
            textShadow: "0px 0px 2px rgba(0, 0, 0, 0.1)",
          }}
          className="text-secondary">
            Your Account
          </span>
        </h2>
        <div className="">
          <form
          onSubmit={handleSubmit(onSubmit)}
          className={`w-fit p-5 flex flex-col rounded-xl bg-white justify-center items-center border border-violet-500 shadow-md mx-auto min-h-[350px]`}
        >
          <div className="grid gap-5 mx-5 grid-cols-1">
            <div>
              <label className=" mb-2 font-semibold" htmlFor="email">
                Email Address:
              </label>
              <input
                className="p-2 w-full bg-slate-100 border border-violet-500 outline-none"
                type="email"
                placeholder="Your Email"
                name="email"
                required
                {...register("email")}
              />
            </div>
            <div>
              <label className=" mb-2 font-semibold" htmlFor="password">
                Password:
              </label>
              <div className="relative">
                <input
                  className="p-2 w-full bg-slate-100 border border-violet-500 outline-none"
                  type="password"
                  placeholder="Password"
                  name="password"
                  {...register("password")}
                  required
                />
              </div>
            </div>
          </div>
          <div>
            <button className={`bg-secondary border border-violet-500 duration-150 w-fit block mx-auto font-semibold px-10 py-1.5 mt-8 bg-[#5C49D8] text-white rounded-full`}>
              Log In
            </button>
            {errorMessage && (
              <p className="text-red-500 mt-2">
                Something is wrong! <br /> please use correct email or password
              </p>
            )}
            <p className="mt-5 text-center text-violet-500">
              If you have not an account please{" "}
              <Link to="/register" className="text-secondary">
                Register
              </Link>
            </p>
              <GoogleSign/>
          </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;