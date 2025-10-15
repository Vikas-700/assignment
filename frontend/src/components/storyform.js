import React, { useState, useEffect } from 'react';

const StoryForm = ({ initialData = {}, onSubmit }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [category, setCategory] = useState(initialData.category || '');
  const [filePreviews, setFilePreviews] = useState([]);
  const [files, setFiles] = useState([]);
  const [removeSlides, setRemoveSlides] = useState([]); // IDs of existing slides to remove

  useEffect(() => {
    setTitle(initialData.title || '');
    setCategory(initialData.category || '');
    if (initialData.slides) {
      setFilePreviews(initialData.slides.map(slide => ({ url: slide.url, _id: slide._id, type: slide.type })));
    } else {
      setFilePreviews([]);
    }
    setFiles([]);
    setRemoveSlides([]);
  }, [initialData]);

  // Handle new file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const updatedFiles = [...files, ...selectedFiles];
    setFiles(updatedFiles);

    const newPreviews = updatedFiles.map(file => ({ url: URL.createObjectURL(file), type: file.type }));
    setFilePreviews(prev => [...prev.filter(p => p._id), ...newPreviews]); // keep existing slides with _id
    e.target.value = null;
  };

  // Remove newly added file (before upload)
  const removeFileAtIndex = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    const updatedPreviews = updatedFiles.map(file => ({ url: URL.createObjectURL(file), type: file.type }));
    setFilePreviews(prev => [...prev.filter(p => p._id), ...updatedPreviews]);
  };

  // Remove existing slide
  const removeExistingSlide = (_id) => {
    setRemoveSlides(prev => [...prev, _id]);
    setFilePreviews(prev => prev.filter(p => p._id !== _id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);

    // Add new files
    files.forEach(file => formData.append('slides', file));

    // Add IDs of slides to remove
    formData.append('removeSlides', JSON.stringify(removeSlides));

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <input
          className="form-control"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
      </div>
      <div className="mb-2">
        <input
          className="form-control"
          value={category}
          onChange={e => setCategory(e.target.value)}
          placeholder="Category"
        />
      </div>
      <div className="mb-2">
        <input
          className="form-control"
          type="file"
          name="slides"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
      </div>

      {/* Show previews */}
      <div className="mb-2 d-flex gap-2 flex-wrap">
        {filePreviews.map((slide, i) => (
          <div key={i} style={{ position: 'relative', width: 100, height: 160, overflow: 'hidden', borderRadius: 8, background: '#111' }}>
            <button
              type="button"
              onClick={() => slide._id ? removeExistingSlide(slide._id) : removeFileAtIndex(i - filePreviews.filter(p => p._id).length)}
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                background: 'rgba(255,255,255,0.8)',
                border: 'none',
                borderRadius: '50%',
                width: 20,
                height: 20,
                cursor: 'pointer',
                fontWeight: 'bold',
                lineHeight: '18px',
                textAlign: 'center',
                padding: 0,
                zIndex: 1,
              }}
              aria-label="Remove slide"
            >
              ×
            </button>
            {slide.type.startsWith('video') ? (
              <video src={slide.url} width="100%" height="100%" controls />
            ) : (
              <img src={slide.url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>
        ))}
      </div>

      <button className="btn btn-success" type="submit">Save Story</button>
    </form>
  );
};

export default StoryForm;
