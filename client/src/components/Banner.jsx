
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className="container min-h-[550px] flex justify-center items-center mx-auto px-2 md:px-5 py-10 md:py-16 text-center bg-gradient-to-b from-purple-500 to-indigo-600 text-white rounded-lg shadow-lg">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome to Our Platform</h1>
        <p className="text-lg md:text-xl mb-6">
          Organize your tasks efficiently and boost your productivity. Get started now!
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-md hover:bg-gray-200 transition"
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Banner;
