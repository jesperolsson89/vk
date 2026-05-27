import { ValueProvider } from "../context/ValueContext";
import ValueDisplay from "./ValueDisplay";
import ValueGrader from "./ValueGrader";

const Game = () => {
  return (
    <div>
      <ValueProvider>
        <ValueDisplay />
        <ValueGrader />
      </ValueProvider>
    </div>
  );
};

export default Game;
