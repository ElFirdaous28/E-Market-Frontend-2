import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/axios";
import { ChevronLeft, ChevronRight, Image, ShoppingCart, SquarePen, Star, ThumbsUp, Trash2, X } from "lucide-react";
import { useReviews } from "../hooks/useReviews";
import { createReviewSchema, updateReviewSchema } from "../validations/reviewSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 5;
  const { productReviews, createReview, updateReview } = useReviews(id, page, limit);

  const { addToCart } = useCart();

  // Add product to cart
  const handleAddToCart = (e, productId) => {
    e.preventDefault();
    addToCart.mutate({ productId, quantity: 1 });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewId, setReviewId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [serverError, setServerError] = useState("");
  const { user } = useAuth();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(editMode ? updateReviewSchema : createReviewSchema),
    defaultValues: {
      rating,
      comment,
      productId: id
    }
  });


  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(`/products/${id}`);
        const data = res.data.data;

        setProduct(data);
        setCurrentImage(data.product.primaryImage);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);


  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const { product: p } = product;
  const allImages = [p.primaryImage, ...(p.secondaryImages || [])];

  const nextImage = () => {
    const currentIndex = allImages.indexOf(currentImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setCurrentImage(allImages[nextIndex]);
  };

  const prevImage = () => {
    const currentIndex = allImages.indexOf(currentImage);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setCurrentImage(allImages[prevIndex]);
  };

  const submitModal = async (data) => {
    if (!editMode) {
      try {
        await createReview.mutateAsync(data);
        setIsModalOpen(false);
        setServerError("");
      } catch (err) {
        if (err.response?.status === 403) {
          setServerError(err.response.data.error);
        } else {
          setServerError("Something went wrong");
        }
      }
    } else {
      updateReview({
        id: reviewId,
        data: { rating: data.rating, comment: data.comment },
        productId: id
      });
      setIsModalOpen(false);
    }
  };

  const openEditModal = (review) => {
    setEditMode(true);
    setReviewId(review._id);
    setValue("rating", review.rating);
    setValue("comment", review.comment);
    setRating(review.rating); // for stars
    setComment(review.comment);
    setIsModalOpen(true);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= productReviews?.totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${page === i
            ? "bg-primary text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">

      {/* Main Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">

        {/* Left Column: Images */}
        <div className="flex flex-col gap-6">
          {/* Main Image */}
          <div className="bg-surface rounded-2xl border border-border flex items-center justify-center aspect-square relative overflow-hidden group shadow-sm">
            {currentImage ? (
              <img
                src={`http://localhost:3000${currentImage}`}
                alt={p.title}
                className="object-contain w-full h-full p-6 transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <Image className="w-20 h-20 text-textMuted opacity-20" />
            )}

            {/* Navigation Arrows (Visible on Hover) */}
            {allImages.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 shadow-lg hover:bg-white text-textMain transition-all opacity-0 group-hover:opacity-100 -translate-x-2.5 group-hover:translate-x-0">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 shadow-lg hover:bg-white text-textMain transition-all opacity-0 group-hover:opacity-100 translate-x-2.5 group-hover:translate-x-0">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex justify-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(img)}
                  className={`w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${currentImage === img
                    ? "border-primary ring-2 ring-primary/20 opacity-100"
                    : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300"
                    }`}
                >
                  <img
                    src={`http://localhost:3000${img}`}
                    alt={`thumb-${index}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-textMain mb-4 capitalize leading-tight">
            {p.title}
          </h1>

          {/* Price */}
          <div className="mb-8">
            <span className="text-4xl font-bold text-primary">${p.price}</span>
          </div>

          {/* Description */}
          <p className="text-textMuted text-lg leading-relaxed mb-10">
            {p.description || "No description available for this product."}
          </p>

          {/* Button */}
          <button
            onClick={(e) => handleAddToCart(e, id)}
            className="w-full bg-primary text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-green-600 active:scale-95 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            Add To Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-border pt-16">
        <div className="flex flex-col max-w-4xl mx-auto">
          <div className="flex justify-between font-bold text-textMain mb-8">
            <h2 className="text-3xl">Customer Feedback</h2>
            <button className="py-2 px-4 border border-primary rounded-lg hover:bg-primary"
              onClick={() => setIsModalOpen(true)}>Add Review</button>
          </div>
          {/* Filter Header */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-surface p-4 rounded-lg border border-border/50">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-textMain">{productReviews?.averageRating.toFixed(2) || 0}</span>
              <div className="flex flex-col">
                <div className="flex text-yellow-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(productReviews?.averageRating || 0) ? "fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-textMuted">Based on {productReviews?.total} reviews</span>
              </div>
            </div>

            <select className="px-4 py-2 rounded-lg border border-border bg-background text-textMain text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer">
              <option>Most Recent</option>
              <option>Highest Rating</option>
              <option>Lowest Rating</option>
            </select>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {productReviews?.reviews?.map((review) => (
              <div key={review._id} className="bg-surface rounded-2xl border border-border p-8 hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 text-primary rounded-full flex items-center justify-center font-bold text-sm border border-primary/20">
                      {review.user.fullname
                        .split(" ")
                        .map(n => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-textMain">{review.user.fullname}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.round(review.rating || 0) ? "fill-yellow-400" : "text-gray-300"}`} />)}
                        </div>
                        <span className="text-textMuted text-xs">• 2 days ago</span>
                      </div>
                    </div>
                  </div>

                  {/* Edit/Delete */}
                  {review.user._id === user._id && (
                    <div className="flex gap-2">
                      <button className="p-2 text-textMuted hover:text-primary hover:bg-primary/10 rounded-lg transition"
                        onClick={() => openEditModal(review)}>
                        <SquarePen className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-textMuted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-textMuted leading-relaxed mb-6">
                  {review.comment}
                </p>

                <button className="flex items-center gap-2 text-sm font-medium text-textMuted hover:text-primary transition group">
                  <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Helpful (0)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {renderPagination()}
      </div>

      {/* Add/Edit Review Modal */}
      {isModalOpen && (
        <div id="reviewModal" className=" fixed inset-0 bg-black/75 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
            <div
              className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h3 id="modalTitle" className="text-xl font-bold text-textMain">Write a Review
              </h3>
              <button onClick={() => setIsModalOpen(false)}
                className="text-textMuted hover:text-textMain">
                <X />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-textMain mb-2">Rating</label>
                <div className="flex gap-1" id="star-rating-input">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={i < rating ? "fill-yellow-400" : "text-gray-300"}
                      onClick={() => {
                        setRating(i + 1);
                        setValue("rating", i + 1, { shouldValidate: true });
                      }}
                    />
                  ))}
                </div>
                {errors.rating && <p className="text-red-500">{errors.rating.message}</p>}
              </div>

              <div>
                <label htmlFor="review-text"
                  className="block text-sm font-medium text-textMain mb-2">Your
                  Review</label>
                <textarea
                  id="review-text"
                  rows="4"
                  placeholder="Tell us what you liked or disliked..."
                  {...register("comment")}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.comment && <p className="text-red-500">{errors.comment.message}</p>}
              </div>
              {serverError && (
                <p className="text-red-500 text-sm mt-2 ml-2">{serverError}</p>
              )}
            </div>

            <div
              className="px-6 py-4 border-t border-border flex justify-end space-x-3 bg-surface">
              <button onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-textMain border border-border hover:bg-background transition">
                Cancel
              </button>
              <button onClick={handleSubmit(submitModal)}
                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-opacity-90 transition font-semibold">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};