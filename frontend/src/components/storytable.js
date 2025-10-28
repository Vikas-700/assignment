import React from "react";
import "./StoryTable.css";

const StoryTable = ({ stories, onEdit, onDelete, onView }) => {
  // Helper to calculate total likes, comments, views
  const getTotals = (slides = []) => {
    let likesCount = 0;
    let commentsCount = 0;
    let viewsCount = 0;

    slides.forEach((s) => {
      if (Array.isArray(s.likes)) likesCount += s.likes.length;
      if (Array.isArray(s.comments)) commentsCount += s.comments.length;
      viewsCount += s.views || 0;
    });

    return { likesCount, commentsCount, viewsCount };
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped align-middle text-center">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Created</th>
            <th>Likes</th>
            <th>Comments</th>
            <th>Views</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stories.map((story) => {
            const totals = getTotals(story.slides);

            return (
              <tr key={story._id}>
                <td>{story.title}</td>
                <td>{story.category}</td>
                <td>{new Date(story.createdAt).toLocaleDateString()}</td>
                <td>{totals.likesCount}</td>
                <td>{totals.commentsCount}</td>
                <td>{totals.viewsCount}</td>
                <td>
                  <div className="d-flex justify-content-center flex-wrap gap-1">
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => onView(story)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onEdit(story)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(story._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StoryTable;
