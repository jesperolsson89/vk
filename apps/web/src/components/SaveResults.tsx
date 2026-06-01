import { Save } from "lucide-react";

const SaveResults = () => {
  return (
    <button className="flex border border-primary-900 bg-primary-100 p-5 items-center gap-2 font-semibold rounded-lg shadow-md cursor-pointer">
      <Save className="w-5 h-5 text-primary-900" />
      <p className="text-primary-900">Spara resultat</p>
    </button>
  );
};

export default SaveResults;