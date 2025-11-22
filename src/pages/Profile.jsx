import { Eye, EyeOff, User, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useAxios } from "../hooks/useAxios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { user } = useAuth();
    const axios = useAxios();
    const navigate = useNavigate();

    const [fullname, setFullname] = useState(user?.fullname || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [avatar, setAvatar] = useState(null); // file
    const [preview, setPreview] = useState(
        user?.avatar !== "null" && user?.avatar
            ? `${import.meta.env.VITE_API_URL}${user.avatar}`
            : null
    );

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleClearAvatar = () => {
        setAvatar(null);
        setPreview(null);
        document.getElementById("profile_image").value = "";
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", fullname);
        formData.append("email", email);
        if (password) formData.append("password", password);
        formData.append("avatar", avatar);

        try {
            await axios.patch(`users/${user._id}`, formData, {
                headers: { "Content-type": "multipart/form-data" },
            });
            toast.success("Profile Updated");
        } catch (error) {
            toast.error("Somthing Went Wrong");
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your account?")) return;

        try {
            await axios.delete(`users/${user._id}`);
            navigate("/");
            toast.success("Account deleted successfully");
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    };
    return (
        <div className="flex flex-col justify-center gap-10 min-h-[90vh]">
            <section>
                <h2 className="text-2xl font-semibold text-textMain mb-4">Personal information</h2>

                <div className="bg-surface rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Form */}
                        <form className="md:col-span-2 space-y-6" onSubmit={handleUpdate}>
                            <div>
                                <label htmlFor="full_name" className="block mb-2 text-sm font-medium text-textMuted">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="full_name"
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                    className="bg-background border border-border text-textMain text-sm rounded-lg focus:ring-brand-green focus:border-brand-green block w-full p-2.5"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-textMuted">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-background border border-border text-textMain text-sm rounded-lg focus:ring-brand-green focus:border-brand-green block w-full p-2.5"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-textMuted">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="bg-background border border-border text-textMain text-sm rounded-lg focus:ring-brand-green focus:border-brand-green block w-full p-2.5 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="text-textMain border border-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-green-800 font-medium rounded-lg text-sm mt-10 px-8 py-2.5 text-center"
                                >
                                    Save
                                </button>
                            </div>
                        </form>

                        {/* Avatar */}
                        <div className="flex flex-col items-center justify-center space-y-2 relative">
                            <div className="w-40 h-40 bg-background border border-border rounded-full flex items-center justify-center overflow-hidden">
                                {preview ? (
                                    <>
                                        <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={handleClearAvatar}
                                            className="absolute top-20 right-1 text-red-500 rounded-full flex items-center justify-center hover:text-red-600"
                                        >
                                            <X />
                                        </button>
                                    </>
                                ) : (
                                    <User className="w-20 h-20 text-gray-500" />
                                )}
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                id="profile_image"
                                onChange={handleAvatarChange}
                            />
                            <label
                                htmlFor="profile_image"
                                className="cursor-pointer text-brand-green hover:underline text-xs"
                            >
                                Upload Image
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-textMain mb-4">Delete Account</h2>
                <div className="bg-surface rounded-lg shadow-lg p-8">
                    <p className="text-textMuted mb-6">
                        You will lose access to your account once your deletion has been submitted.
                    </p>
                    <button
                        onClick={handleDelete}
                        type="button"
                        className="text-textMain bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        Delete Account
                    </button>
                </div>
            </section>
        </div>
    );
}
