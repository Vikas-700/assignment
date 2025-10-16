import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import "./StoryPlayer.css";

const slideDuration = 5000; // 5s for images

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const StoryPlayer = () => {
  const [stories, setStories] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true); // Audio toggle
  const intervalRef = useRef(null);
  const videoRef = useRef(null);


  // Fetch stories
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get("https://assignment-backend-y2od.onrender.com/api/stories");
        setStories(res.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };
    fetchStories();
  }, []);

  // Memoize nextSlide function
  const nextSlide = useCallback(() => {
    clearInterval(intervalRef.current);
    const story = stories[currentStoryIndex];
    if (currentSlideIndex + 1 < story.slides.length) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else if (currentStoryIndex + 1 < stories.length) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setCurrentSlideIndex(0);
    } else {
      setCurrentStoryIndex(0);
      setCurrentSlideIndex(0);
    }
  }, [currentStoryIndex, currentSlideIndex, stories]);

  // Memoize startImageTimer function
  const startImageTimer = useCallback(() => {
    setProgress(0);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 100 / (slideDuration / 100);
      });
    }, 100);
  }, [nextSlide]);

  // Handle slide changes
  useEffect(() => {
    if (!stories.length) return;
    const currentSlide = stories[currentStoryIndex].slides[currentSlideIndex];
    if (currentSlide.type === "video") {
      if (videoRef.current) {
        videoRef.current.muted = isMuted; // set mute state
        videoRef.current.play();
      }
      clearInterval(intervalRef.current);
      setProgress(0);
    } else {
      startImageTimer();
    }
    return () => clearInterval(intervalRef.current);
  }, [currentStoryIndex, currentSlideIndex, stories, isMuted, startImageTimer]);

  const prevSlide = () => {
    clearInterval(intervalRef.current);
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    } else if (currentStoryIndex > 0) {
      const prevStory = stories[currentStoryIndex - 1];
      setCurrentStoryIndex(currentStoryIndex - 1);
      setCurrentSlideIndex(prevStory.slides.length - 1);
    }
  };

  const handleVideoEnd = () => nextSlide();

  if (!stories.length) return <p>Loading stories...</p>;

  const story = stories[currentStoryIndex];
  const currentSlide = story.slides[currentSlideIndex];

  return (
    <div className="story-player">
      {/* Dashboard Button */}


      {/* Top Bar */}
      <div className="story-topbar">
        <span className="story-title">{story.title}</span>
        <span className="story-time">{timeAgo(story.createdAt)}</span>
      </div>

      {/* Progress Bars */}
      <div className="story-progress-container">
        {story.slides.map((_, i) => (
          <div key={i} className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width:
                  i < currentSlideIndex
                    ? "100%"
                    : i === currentSlideIndex
                    ? `${progress}%`
                    : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Story Content */}
      <div className="story-content">
        {currentSlide.type === "video" ? (
          <>
            <video
              ref={videoRef}
              src={currentSlide.url}
              autoPlay
              playsInline
              onEnded={handleVideoEnd}
              className="story-media"
            />
            <button
              className="volume-btn"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
          </>
        ) : (
          <img src={currentSlide.url} alt="story slide" className="story-media" />
        )}

        {/* Tap Areas */}
        <div className="story-tap-left" onClick={prevSlide}></div>
        <div className="story-tap-right" onClick={nextSlide}></div>
      </div>
    </div>
  );
};

export default StoryPlayer;
