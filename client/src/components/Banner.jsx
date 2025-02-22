import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className="container min-h-[550px] flex justify-center items-center mx-auto px-4 md:px-6 py-12 md:py-20 text-center bg-gradient-to-r from-blue-500 to-indigo-700 text-white rounded-xl shadow-2xl">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Organize, Track & Achieve
        </h1>
        <p className="text-lg md:text-2xl mb-8 font-medium text-gray-200">
          Simplify your workflow, stay on top of your tasks, and reach your goals faster.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-yellow-500 hover:to-orange-600"
        >
          Get Started 🚀
        </button>
      </div>
    </section>
  );
};

export default Banner;
