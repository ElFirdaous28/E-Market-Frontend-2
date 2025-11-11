import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="text-center">

            <div className="flex justify-center mb-6">
                <svg className="w-20 h-20 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>

            <h1 className="text-8xl md:text-9xl font-black text-white leading-none">
                404
            </h1>

            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-200">
                Page Not Found
            </h2>


            <div className="mt-10">
                <Link to="/" className="bg-primary text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-primary/40 transition-colors shadow-lg">
                    Go Back Home
                </Link>
            </div>

        </div>
    );
}

export default NotFound