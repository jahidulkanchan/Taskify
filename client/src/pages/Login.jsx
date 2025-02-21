import GoogleSign from "../shared/GoogleSign";

const Login = () => {
  return (
    <>
       <section className={`container flex flex-col justify-center items-center px-2 mx-auto pb-10 pt-10 min-h-[500px]`}>
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
            <GoogleSign/>
        </div>
      </section>
    </>
  );
};

export default Login;