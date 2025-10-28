import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchStories,
  createStory,
  updateStory,
  deleteStory
} from '../api/storyapi';
import StoryTable from '../components/storytable';
import StoryForm from '../components/storyform';

const Dashboard = () => {
  const [stories, setStories] = useState([]);
  const [editingStory, setEditingStory] = useState(null);
  const navigate = useNavigate();

  // Load all stories
  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const response = await fetchStories();
      setStories(response.data);
    } catch (err) {
      console.error('Error fetching stories:', err);
    }
  };

  const handleCreate = async (formData) => {
    try {
      if (editingStory) {
        await updateStory(editingStory._id, formData);
        setEditingStory(null);
      } else {
        await createStory(formData);
      }
      loadStories();
    } catch (err) {
      console.error('Error saving story:', err);
    }
  };

  const handleEdit = (story) => {
    setEditingStory(story);
  };

  const handleDelete = async (id) => {
    try {
      await deleteStory(id);
      loadStories();
    } catch (err) {
      console.error('Error deleting story:', err);
    }
  };

  const handleView = (story) => {
    // ✅ Redirect to story player page
    navigate(`/stories/${story._id}`);
  };

  // ✅ Calculate summary analytics properly
  const totalStories = stories.length;
  const totalLikes = stories.reduce(
    (acc, story) =>
      acc +
      story.slides?.reduce((sAcc, slide) => sAcc + (slide.likes?.length || 0), 0),
    0
  );
  const totalComments = stories.reduce(
    (acc, story) =>
      acc +
      story.slides?.reduce(
        (sAcc, slide) => sAcc + (slide.comments?.length || 0),
        0
      ),
    0
  );
  const totalViews = stories.reduce(
    (acc, story) =>
      acc + story.slides?.reduce((sAcc, slide) => sAcc + (slide.views || 0), 0),
    0
  );

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">📊 Admin Dashboard</h1>

      {/* Form for adding/editing stories */}
      <StoryForm initialData={editingStory || {}} onSubmit={handleCreate} />

      {/* Table of stories */}
      <StoryTable
        stories={stories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* 📈 Analytics Summary */}
      <div className="mt-5 p-4 border rounded bg-light shadow-sm">
        <h3 className="text-secondary mb-3">📈 Summary</h3>
        <div className="row">
          <div className="col-md-3 col-6">
            <div className="card text-center shadow-sm p-3">
              <h5>Total Stories</h5>
              <p className="fs-4 fw-bold text-primary">{totalStories}</p>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card text-center shadow-sm p-3">
              <h5>Total Likes</h5>
              <p className="fs-4 fw-bold text-success">{totalLikes}</p>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card text-center shadow-sm p-3">
              <h5>Total Comments</h5>
              <p className="fs-4 fw-bold text-warning">{totalComments}</p>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card text-center shadow-sm p-3">
              <h5>Total Views</h5>
              <p className="fs-4 fw-bold text-danger">{totalViews}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
