import { ValueProvider, useValue } from "../context/ValueContext";
import ValueDisplay from "./ValueDisplay";
import ValueGrader from "./ValueGrader";
import ValueReview from "./ValueReview";

const GameContent = () => {
  const { phase } = useValue();

  return (
    <div className="w-full flex flex-col items-center justify-start pt-8">
      {phase === "grading" && (
        <>
          <ValueDisplay />
          <ValueGrader />
        </>
      )}
      {phase === "reviewing" && <ValueReview />}
    </div>
  );
};

const Game = () => {
  return (
    <ValueProvider>
      <GameContent />
    </ValueProvider>
  );
};

export default Game;