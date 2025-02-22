import GoogleSign from "../shared/GoogleSign";

const Login = () => {
  return (
    <>
       <section className={`container flex flex-col justify-center items-center px-2 mx-auto pb-10 pt-10 min-h-[500px]`}>
        <div className="">
            <GoogleSign/>
        </div>
      </section>
    </>
  );
};

export default Login;