import { useState } from 'react';
import { Trash2, Star, MessageSquare, Check, X, Edit2 } from 'lucide-react';
import { useAdminStatistics } from '../../hooks/useAdminstatistics';

// Mock data for demonstration
// const mockReviews = [
//   {
//     _id: '1',
//     user: { name: 'John Doe', _id: 'user1' },
//     product: { name: 'Wireless Headphones', _id: 'prod1' },
//     rating: 5,
//     comment: 'Excellent product! The sound quality is amazing and very comfortable to wear for long periods.',
//     status: 'approved',
//     createdAt: new Date('2024-11-20T10:30:00')
//   },
//   {
//     _id: '2',
//     user: { name: 'Jane Smith', _id: 'user2' },
//     product: { name: 'Smart Watch', _id: 'prod2' },
//     rating: 4,
//     comment: 'Great watch with many features. Battery life could be better but overall very satisfied.',
//     status: 'pending',
//     createdAt: new Date('2024-11-22T14:20:00')
//   },
//   {
//     _id: '3',
//     user: { name: 'Mike Johnson', _id: 'user3' },
//     product: { name: 'Laptop Stand', _id: 'prod3' },
//     rating: 3,
//     comment: 'Decent stand but a bit wobbly. Does the job but expected better quality for the price.',
//     status: 'approved',
//     createdAt: new Date('2024-11-23T09:15:00')
//   },
//   {
//     _id: '4',
//     user: { name: 'Sarah Wilson', _id: 'user4' },
//     product: { name: 'Mechanical Keyboard', _id: 'prod4' },
//     rating: 5,
//     comment: 'Best keyboard I have ever owned! The typing experience is phenomenal and the build quality is top-notch.',
//     status: 'approved',
//     createdAt: new Date('2024-11-24T16:45:00')
//   },
//   {
//     _id: '5',
//     user: { name: 'Tom Brown', _id: 'user5' },
//     product: { name: 'USB-C Hub', _id: 'prod5' },
//     rating: 2,
//     comment: 'Disappointed with this product. Ports stopped working after a week. Not recommended.',
//     status: 'rejected',
//     createdAt: new Date('2024-11-21T11:00:00')
//   }
// ];

export default function AdminReviews() {
  //   const [reviews, setReviews] = useState([]);
  //   const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const { reviews, isLoading } = useAdminStatistics();

  // console.log("🔪🔪",review)

  const statuses = ['pending', 'approved', 'rejected'];

  //   useEffect(() => {
  //     fetchReviews();
  //   }, []);

  //  useEffect(() => {
  //   const fetchAllReviews = async () => {
  //     try {
  //       const res = await axios.get("/reviews/");
  //       setReviews(res.data.data);
  //     } catch (error) {
  //       console.error("Failed to fetch reviews:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchAllReviews();
  // }, []);

  //   const fetchReviews = async () => {
  //     try {
  //       setLoading(true);
  //       // Simulate API call - Replace with actual API endpoint
  //       // const res = await fetch('/api/reviews');
  //       // const data = await res.json();
  //       // setReviews(data.data || []);

  //       // Using mock data for demonstration
  //       setTimeout(() => {
  //         setReviews(mockReviews);
  //         setLoading(false);
  //       }, 500);
  //     } catch (error) {
  //       console.error('Failed to fetch reviews:', error);
  //       setLoading(false);
  //     }
  //   };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setEditStatus(review.status);
  };

  const handleSave = (reviewId) => {
    // Replace with actual API call
    // await fetch(`/api/reviews/${reviewId}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ status: editStatus })
    // });

    setReviews(
      reviews.map((review) =>
        review._id === reviewId ? { ...review, status: editStatus } : review
      )
    );
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditStatus('');
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      // Replace with actual API call
      // await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });

      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('Failed to delete review');
    }
  };

  if (isLoading) return <h1 className="text-white p-6">Loading...</h1>;

  return (
    <main className="flex-1 p-4 md:p-6 overflow-auto w-full bg-color-background min-h-screen">
      {/* Header */}
      <div className="mb-4 md:mb-6 max-w-full">
        <h1 className="text-xl md:text-2xl font-bold text-color-surface mb-1">
          Reviews Management
        </h1>
        <p className="text-sm md:text-base text-gray-400">Manage customer reviews and ratings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 w-full">
        <div className="bg-color-background border border-gray-700 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-color-surface" />
            </div>
          </div>
          <h3 className="text-gray-400 text-xs md:text-sm mb-1">Total Reviews</h3>
          <p className="text-xl md:text-2xl font-bold text-color-surface">{reviews.length}</p>
        </div>
        <div className="bg-color-background border border-gray-700 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-color-surface" />
            </div>
          </div>
          <h3 className="text-gray-400 text-xs md:text-sm mb-1">Pending</h3>
          <p className="text-xl md:text-2xl font-bold text-color-surface">
            {reviews.filter((r) => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-color-background border border-gray-700 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-color-surface" />
            </div>
          </div>
          <h3 className="text-gray-400 text-xs md:text-sm mb-1">Approved</h3>
          <p className="text-xl md:text-2xl font-bold text-color-surface">
            {reviews.filter((r) => r.status === 'approved').length}
          </p>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-color-background border border-gray-700 rounded-lg w-full">
        <div className="p-4 md:p-6 border-b border-gray-700">
          <h2 className="text-base md:text-lg font-semibold text-color-surface">All Reviews</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-xs md:text-sm font-medium text-gray-400 px-4 md:px-6 py-3">
                  User
                </th>
                <th className="text-left text-xs md:text-sm font-medium text-gray-400 px-4 md:px-6 py-3">
                  Product
                </th>
                <th className="text-left text-xs md:text-sm font-medium text-gray-400 px-4 md:px-6 py-3">
                  Rating
                </th>
                <th className="text-left text-xs md:text-sm font-medium text-gray-400 px-4 md:px-6 py-3">
                  Comment
                </th>
                <th className="text-left text-xs md:text-sm font-medium text-gray-400 px-4 md:px-6 py-3">
                  Status
                </th>
                <th className="text-left text-xs md:text-sm font-medium text-gray-400 px-4 md:px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr
                  key={review._id}
                  className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                >
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-color-surface font-medium">
                    {review.user?.fullname || 'Unknown'}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-400">
                    {review.product?.title || 'Unknown'}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-xs text-gray-400">{review.rating}/5</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-400 max-w-xs">
                    <div className="truncate" title={review.comment}>
                      {review.comment}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    {editingId === review._id ? (
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm text-color-surface focus:outline-none focus:border-emerald-500"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          review.status === 'approved'
                            ? 'bg-green-500 bg-opacity-20 text-color-surface'
                            : review.status === 'pending'
                              ? 'bg-yellow-500 bg-opacity-20 text-color-surface'
                              : 'bg-red-500 bg-opacity-20 text-color-surface'
                        }`}
                      >
                        {review.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {editingId === review._id ? (
                        <>
                          <button
                            onClick={() => handleSave(review._id)}
                            className="p-2 bg-emerald-500 hover:bg-emerald-600 rounded transition-colors"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(review)}
                            className="p-2 bg-blue-500 hover:bg-blue-600 rounded transition-colors"
                            title="Edit Status"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="p-2 bg-red-500 hover:bg-red-600 rounded transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
