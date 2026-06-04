import { useNavigate } from "react-router-dom";

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      Back
    </button>
  );
};

export default BackButton;
