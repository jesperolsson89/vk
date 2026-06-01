import { useValue } from "../context/ValueContext";

const ValueDisplay = () => {
  const { currentValue, currentIndex, totalValues } = useValue();
  const description =
    currentValue.description.charAt(0).toUpperCase() +
    currentValue.description.slice(1);
  const progress = ((currentIndex + 1) / totalValues) * 100;

  return (
    <div className="flex-col justify-center text-center bg-primary-600 border-primary-900 border rounded-2xl mb-10 p-2 shadow-2xs min-w-10/12">
      {/* Progress bar */}
      <div className="w-full bg-primary-800 rounded-full h-1.5 mb-2 mx-auto my-1">
        <div
          className="bg-primary-200 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-primary-50 flex justify-end mx-2">
        {currentIndex + 1} av {totalValues}
      </p>
      <p className="text-3xl font-bold text-primary-50 mb-2">
        {currentValue.name}
      </p>
      <div className="bg-primary-50 rounded-2xl shadow-2xs">
        <p className="p-10 rounded-r-2xl text-2xl">{description}</p>
      </div>
    </div>
  );
};

export default ValueDisplay;
