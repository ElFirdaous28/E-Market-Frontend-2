import { ShoppingCart } from "lucide-react";
import CategoriesSlider from "../components/CategoriesSlider";
import Products from "../components/Products";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../services/axios";
import { useAuth } from "../contexts/AuthContext";
import { AdminDashboard } from "../pages/AdminDashboard";

export const Home = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get("/products");
        setProducts(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;

  // if (user?.role === "admin") {
  //   return <AdminDashboard />;
  // }

  return (
    <>
      <section className="w-full sm:w-11/12 lg:w-3/4 bg-surface rounded-lg overflow-hidden flex flex-col md:flex-row p-6 sm:p-8 md:p-12 lg:p-16 text-center md:text-left items-center md:items-stretch mx-auto">
        <div className="w-full md:w-3/5 flex flex-col justify-center items-center md:items-start">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-textMain leading-tight">
            Shop the Best Products Online
          </h1>
          <p className="mt-4 text-base sm:text-lg text-textMuted max-w-md">
            Discover amazing deals on top-quality products. Fast shipping,
            secure payments, and excellent customer service.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <Link
              to="/products"
              className="bg-primary text-textMain px-6 py-3 rounded-full font-semibold hover:bg-primary/55 transition-colors shadow-lg"
            >
              Shop Now
            </Link>
            <Link
              to="/register"
              className="text-textMuted border border-primary rounded-full px-6 py-3 hover:bg-primary hover:text-textMain transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <div className="w-full md:w-2/5 bg-primary flex items-center justify-center p-8 md:p-12 min-h-[200px] md:min-h-0 rounded-lg mt-8 md:mt-0">
          <ShoppingCart className="w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 text-textMain opacity-90" />
        </div>
      </section>

      <CategoriesSlider />
      <Products products={products} />

      <div className="w-3/4 text-primary -mt-10 text-right">
        <Link
          to="/products"
          className="text-primary font-semibold hover:underline"
        >
          View All &rarr;
        </Link>
      </div>
    </>
  );
};
