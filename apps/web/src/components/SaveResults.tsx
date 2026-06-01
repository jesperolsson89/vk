import { Save } from "lucide-react";
import { useValue } from "../context/ValueContext";

interface Props {
  chosen: string[];
}

const SaveResults = ({ chosen }: Props) => {
  const { saveResults } = useValue();

  async function handleSave() {
    await saveResults(chosen);
    alert("Resultat sparat!");
  }

  return (
    <button
      onClick={handleSave}
      className="flex border border-primary-900 bg-primary-100 p-5 items-center gap-2 font-semibold rounded-lg shadow-xs cursor-pointer hover:bg-primary-200 transition-colors"
    >
      <Save className="w-5 h-5 text-primary-900" />
      <p className="text-primary-900">Spara resultat</p>
    </button>
  );
};

export default SaveResults;