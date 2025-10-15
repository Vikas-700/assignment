import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StoryDetail = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/stories/${id}`);
        setStory(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStory();
  }, [id]);

  if (!story) return <p>Loading...</p>;

  return (
    <div>
      <h2>{story.title}</h2>
      <p>Category: {story.category}</p>
      <div>
        {story.slides.map((slide, i) =>
          slide.type === "video" ? (
            <video key={i} src={slide.url} width="400" controls />
          ) : (
            <img key={i} src={slide.url} width="400" alt="slide" />
          )
        )}
      </div>
    </div>
  );
};

export default StoryDetail;
