import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/axios";
import { ChevronLeft, ChevronRight, Image, Star } from "lucide-react";

export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(`/products/${id}`);
        const data = res.data.data;

        setProduct(data);
        // set default image = primary
        setCurrentImage(data.product.primaryImage);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  if (loading) return <div>Loading... form ProductDetails</div>;
  if (!product) return <div>Product not found</div>;

  const { product: p } = product;
  const allImages = [p.primaryImage, ...(p.secondaryImages || [])];

  const nextImage = () => {
    const currentIndex = allImages.indexOf(currentImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setCurrentImage(allImages[nextIndex]);
  };

  const prevImage = () => {
    const currentIndex = allImages.indexOf(currentImage);
    const prevIndex =
      (currentIndex - 1 + allImages.length) % allImages.length;
    setCurrentImage(allImages[prevIndex]);
  };

  return (
    <div className="w-3/4 grid grid-cols-1 md:grid-cols-2 gap-28 items-start mt-28 mb-20 mx-auto">
      {/* Left section — Images */}
      <div className="flex flex-col gap-4">
        {/* Main image */}
        <div className="bg-surface rounded-lg flex items-center justify-center shadow-lg overflow-hidden relative">
          {currentImage ? (
            <img
              src={`http://localhost:3000${currentImage}`}
              alt={p.title}
              className="object-contain max-h-[450px] w-full"
            />
          ) : (
            <Image className="w-1/2 h-1/2 text-textMuted" />
          )}

          {/* Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-primary hover:opacity-75 transition-opacity"
              >
                <ChevronLeft className="w-12 h-12" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-primary hover:opacity-75 transition-opacity"
              >
                <ChevronRight className="w-12 h-12" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex justify-center space-x-3 mt-6">
            {allImages.map((img, index) => (
              <div
                key={index}
                onClick={() => setCurrentImage(img)}
                className={`bg-surface p-2 rounded-md cursor-pointer border transition-colors ${
                  currentImage === img
                    ? "border-primary"
                    : "border-surface hover:border-primary"
                }`}
              >
                <img
                  src={`http://localhost:3000${img}`}
                  alt={`thumb-${index}`}
                  className="w-20 h-20 object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right section — Details */}
      <div className="flex flex-col justify-center">
        <h1 className="text-4xl font-bold text-textMain mb-4 capitalize">
          {p.title}
        </h1>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400 gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(product.averageRating || 0)
                    ? "fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-textMuted">
            ({product.averageRating || 0}) {product.totalReviews || 0} reviews
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline space-x-2 mb-6">
          <span className="text-3xl font-bold text-primary">${p.price}</span>
        </div>

        {/* Description */}
        <p className="text-textMuted leading-relaxed mb-8">
          {p.description || "No description available."}
        </p>

        {/* Button */}
        <button className="w-full bg-primary text-textMain py-3 px-6 rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors shadow-lg">
          Add To Cart
        </button>
      </div>
    </div>
  );
};
