export const Logo = ({ className }) => {
    return (
        <div className={`flex justify-between items-center w-44 ${className}`}>
            <img className="w-10" src="/logo.svg" alt="logo" />
            <h1 className="text-3xl font-bold">E-Market</h1>
        </div>
    );
};
