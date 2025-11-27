export const Logo = ({ className }) => {
  return (
    <div className={`flex justify-between items-center max-w-48 ${className}`}>
      <img className="w-10" src="/logo.svg" alt="logo" />
      <h1 className="text-3xl w-44 font-bold">E-Market</h1>
    </div>
  );
};
