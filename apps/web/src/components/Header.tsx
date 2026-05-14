import BankButton from "./BankButton";

const Header = () => {
  return (
    <>
      <div className="flex fixed top-0 left-0 right-0 z-50 bg-primary-600 shadow-sm px-6 py-4 justify-between">
        <div className="flex-col">
          <p className="py-1 text-3xl text-primary-50">Värderingskollen</p>
          <p className="text-primary-50">Välkommen till värderingskollen!</p>
        </div>
        <BankButton />
      </div>
    </>
  );
};

export default Header;
