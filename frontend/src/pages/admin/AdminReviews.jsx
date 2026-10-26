import { useState, useEffect } from 'react';
import { reviewService } from '../../services/reviewService';
import { mockMovies } from '../../data/mockMovies';
import { toast } from 'react-toastify';
import { IconTrash } from '../../components/common/Icons';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const res = await reviewService.getAllReviewsAdmin();
    setReviews(res.reviews || []);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id) => {
    await reviewService.deleteReview(id);
    toast.info('Review removed from cinema catalogue.');
    fetchReviews();
  };

  const getMovieTitle = (mId) => {
    const m = mockMovies.find((mov) => mov.id === mId);
    return m ? m.title : 'Dune: Part Two';
  };

  return (
    <div className="admin-reviews-page">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-extrabold text-white mb-1">Audience Review Moderation</h2>
          <p className="text-white-50 small mb-0">Inspect customer feedback, filter inappropriate remarks, and maintain review standards.</p>
        </div>

        <span className="badge bg-danger rounded-pill px-3 py-2">
          {reviews.length} Published Reviews
        </span>
      </div>

      <div className="p-4 rounded-4 shadow" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
        <div className="table-responsive">
          <table className="table table-cinema mb-0">
            <thead>
              <tr>
                <th>Reviewer</th>
                <th>Target Movie</th>
                <th>Rating</th>
                <th>Review Synopsis</th>
                <th>Date</th>
                <th>Purchase Status</th>
                <th className="text-end">Moderation</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((rev) => (
                <tr key={rev.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={rev.avatar}
                        alt={rev.author}
                        className="rounded-circle object-fit-cover shadow-sm"
                        width="32"
                        height="32"
                      />
                      <span className="fw-bold text-white small">{rev.author}</span>
                    </div>
                  </td>
                  <td className="text-white fw-medium">{getMovieTitle(rev.movieId)}</td>
                  <td>
                    <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-25 px-2 py-1">
                      {rev.rating} ★
                    </span>
                  </td>
                  <td style={{ maxWidth: '320px' }}>
                    <p className="text-white-50 small mb-0 text-truncate">
                      "{rev.content}"
                    </p>
                  </td>
                  <td className="text-white-50 small">{rev.date}</td>
                  <td>
                    <span className="badge bg-success bg-opacity-25 text-success">
                      Verified
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(rev.id)}
                      className="btn btn-sm btn-outline-danger p-1"
                      title="Delete Review"
                    >
                      <IconTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
