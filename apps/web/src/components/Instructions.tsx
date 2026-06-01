import { useNavigate } from "react-router-dom";

const Instructions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-6 mt-20 max-w-lg text-center px-4">
      <h1 className="text-3xl font-bold text-primary-900">Hur fungerar det?</h1>
      
      <div className="bg-white rounded-2xl shadow-md border border-border p-8 flex flex-col gap-4 text-left">
        <p className="text-text">Instruktioner kommer här...</p>
      </div>

      <button
        onClick={() => navigate("/game")}
        className="flex items-center gap-2 font-semibold bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl transition-colors cursor-pointer"
      >
        Börja testet →
      </button>
    </div>
  );
};

export default Instructions;