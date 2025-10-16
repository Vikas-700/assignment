import React, { useEffect, useState } from "react";
import axios from "axios";

const StoryList = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      const res = await axios.get("https://assignment-backend-y2od.onrender.com/api/stories");
      setStories(res.data);
    };
    fetchStories();
  }, []);

  return (
    <div>
      <h2>All Stories</h2>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {stories.map((story) => (
          <div key={story._id} style={{ border: "1px solid #ccc", padding: 10 }}>
            <h3>{story.title}</h3>
            <p>Category: {story.category}</p>
            <div style={{ display: "flex", gap: 10 }}>
              {story.slides.map((slide, i) =>
                slide.type === "video" ? (
                  <video key={i} src={slide.url} width="200" controls />
                ) : (
                  <img key={i} src={slide.url} width="200" alt="story slide" />
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryList;
