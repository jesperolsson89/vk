import { useValue } from "../context/ValueContext";

const ValueDisplay = () => {
  const { currentValue } = useValue();
  const description = currentValue.description.charAt(0).toUpperCase() + currentValue.description.slice(1);

  return (
    <div className="flex-col justify-center text-center bg-primary-600 border-primary-900 border rounded-2xl m-2 mb-10 p-2 shadow-2xs">
      <p className="text-3xl p-3 font-bold text-primary-50">{currentValue.name}</p>
      <div className="bg-primary-50 rounded-2xl shadow-2xs">
        <p className="p-10 rounded-r-2xl text-2xl">{description}</p>
      </div>
    </div>
  );
};

export default ValueDisplay;