import { useState } from "react";
import { useValue } from "../context/ValueContext";

const sizes = [
  "w-11 h-11",
  "w-9 h-9",
  "w-8 h-8",
  "w-7 h-7",
  "w-6 h-6",
  "w-5 h-5",
  "w-6 h-6",
  "w-7 h-7",
  "w-8 h-8",
  "w-9 h-9",
  "w-11 h-11",
];

const ValueGrader = () => {
  const { rate, next, previous, currentValue } = useValue();
  const [selected, setSelected] = useState<number | null>(null);

  function handleNext() {
    if (selected === null) return;
    rate(currentValue.name, selected);
    setSelected(null);
    next();
  }

  function handlePrevious() {
    setSelected(null);
    previous();
  }

  return (
    <div className="w-screen px-2 justify-center flex">
      <div className="mx-2 min-w-10/12">
        <div className="flex justify-between my-2 font-bold">
          <p>Inte alls viktigt</p>
          <p>Väldigt viktigt</p>
        </div>

        <div className="flex gap-3 items-center justify-between">
          {sizes.map((size, i) => (
            <input
              key={i}
              type="radio"
              name="group"
              value={i}
              checked={selected === i}
              onChange={() => setSelected(i)}
              className={`appearance-none ${size} rounded-full border-2 bg-neutral-100 checked:bg-primary-700 cursor-pointer`}
            />
          ))}
        </div>

        <div className="flex justify-between my-5">
          <button
            onClick={handlePrevious}
            className="flex items-center border border-primary-900 gap-2 font-semibold bg-white rounded-lg shadow-xs cursor-pointer px-4 py-2 hover:bg-primary-50 transition-colors"
          >
            <span>←</span>
            Tillbaka
          </button>
          <button
            onClick={handleNext}
            disabled={selected === null}
            className="flex items-center border border-primary-900 gap-2 font-semibold bg-white rounded-lg shadow-xs cursor-pointer px-4 py-2 hover:bg-primary-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Nästa
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValueGrader;
