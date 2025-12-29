import { useState } from 'react';
import { Trash2, Star, MessageSquare, Check, X, Edit2 } from 'lucide-react';
import { useAdminStatistics } from '../../hooks/useAdminstatistics';

export default function AdminReviews() {
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const { reviews, isLoading, deleteReview, editReviewStatus } = useAdminStatistics();

  const statuses = ['pending', 'approved', 'rejected'];

  const handleEdit = (review) => {
    setEditingId(review._id);
    setEditStatus(review.status);
  };

  const handleSave = (reviewId) => {
    editReviewStatus({ id: reviewId, status: editStatus });
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditStatus('');
  };

  const handleDelete = async (reviewId) => {
    deleteReview(reviewId);
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
