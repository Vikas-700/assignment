import React from 'react';

const StoryTable = ({ stories, onEdit, onDelete, onView }) => (
  <table className="table table-bordered table-striped">
    <thead>
      <tr>
        <th>Title</th>
        <th>Category</th>
        <th>Created At</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {stories.map(story => (
        <tr key={story._id}>
          <td>{story.title}</td>
          <td>{story.category}</td>
          <td>{new Date(story.createdAt).toLocaleDateString()}</td>
          <td>
            <button className="btn btn-info btn-sm me-2" onClick={() => onView(story)}>View</button>
            <button className="btn btn-primary btn-sm me-2" onClick={() => onEdit(story)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(story._id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default StoryTable;
