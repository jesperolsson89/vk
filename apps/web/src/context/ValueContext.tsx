import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { values } from "../data/valuestest.json";

type Phase = "grading" | "reviewing";

interface ValueContextType {
  currentIndex: number;
  currentValue: { name: string; description: string };
  ratings: Record<string, number>;
  rate: (valueId: string, rating: number) => void;
  next: () => void;
  previous: () => void;
  isComplete: boolean;
  totalValues: number;
  phase: Phase;
  topValues: { name: string; description: string }[];
  saveResults: (topValues: string[]) => Promise<void>;
}

const ValueContext = createContext<ValueContextType | null>(null);

export const ValueProvider = ({ children }: { children: ReactNode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<Phase>("grading");
  const [topValues, setTopValues] = useState<
    { name: string; description: string }[]
  >([]);

  function rate(valueId: string, rating: number) {
    console.log(`${valueId}: ${rating}`);
    setRatings((prev) => ({ ...prev, [valueId]: rating }));
  }

  function next() {
    if (currentIndex < values.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function previous() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  const isComplete =
    currentIndex === values.length - 1 &&
    ratings[values[currentIndex].name] !== undefined;

  // When grading is complete, find top values and move to reviewing phase
  useEffect(() => {
    if (isComplete) {
      const top = values.filter((v) => (ratings[v.name] ?? 0) > 8);
      console.log("Top rated values:", top);
      setTopValues(top);
      setPhase("reviewing");
      setCurrentIndex(0); // reset index for the reviewing phase
    }
  }, [isComplete]);

  const currentValue =
    phase === "grading" ? values[currentIndex] : topValues[currentIndex];

  async function saveResults(topValues: string[]) {
    const API_URL = import.meta.env.VITE_API_URL;
    await fetch(`${API_URL}/api/results`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ratings, topValues }),
    });
  }

  return (
    <ValueContext.Provider
      value={{
        currentIndex,
        currentValue,
        ratings,
        rate,
        next,
        previous,
        isComplete,
        totalValues: phase === "grading" ? values.length : topValues.length,
        phase,
        topValues,
        saveResults,
      }}
    >
      {children}
    </ValueContext.Provider>
  );
};

export const useValue = () => {
  const context = useContext(ValueContext);
  if (!context) throw new Error("useValue must be used inside ValueProvider");
  return context;
};
