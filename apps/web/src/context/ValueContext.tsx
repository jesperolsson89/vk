import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { values } from "../data/valuestest.json";

interface ValueContextType {
  currentIndex: number;
  currentValue: { name: string; description: string };
  ratings: Record<string, number>;
  rate: (valueId: string, rating: number) => void;
  next: () => void;
  previous: () => void;
  isComplete: boolean;
  totalValues: number;
}

const ValueContext = createContext<ValueContextType | null>(null);

export const ValueProvider = ({ children }: { children: ReactNode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<string, number>>({});

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

  useEffect(() => {
    if (isComplete) {
      const topRated = Object.entries(ratings)
        .filter(([_, rating]) => rating > 8)
        .map(([valueId, rating]) => ({ value: valueId, rating }));

      console.log("Top rated values:", topRated);
    }
  }, [isComplete]);

  return (
    <ValueContext.Provider
      value={{
        currentIndex,
        currentValue: values[currentIndex],
        ratings,
        rate,
        next,
        previous,
        isComplete,
        totalValues: values.length,
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
