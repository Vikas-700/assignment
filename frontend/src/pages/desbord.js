import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStories, createStory, updateStory, deleteStory } from '../api/storyapi';
import StoryTable from '../components/storytable';
import StoryForm from '../components/storyform';

const Dashboard = () => {
  const [stories, setStories] = useState([]);
  const [editingStory, setEditingStory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    const response = await fetchStories();
    setStories(response.data);
  };

  const handleCreate = async (formData) => {
    if (editingStory) {
      await updateStory(editingStory._id, formData);
      setEditingStory(null);
    } else {
      await createStory(formData);
    }
    loadStories();
  };

  const handleEdit = (story) => {
    setEditingStory(story);
  };

  const handleDelete = async (id) => {
    await deleteStory(id);
    loadStories();
  };

  const handleView = (story) => {
    navigate(`/stories/${story._id}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Dashboard</h1>
      <StoryForm initialData={editingStory || {}} onSubmit={handleCreate} />
      <StoryTable
        stories={stories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    </div>
  );
};

export default Dashboard;
