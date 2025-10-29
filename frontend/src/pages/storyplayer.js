import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import "./StoryPlayer.css";

const SLIDE_DURATION = 5000; // 5s per image
const API_BASE = "https://assignment-backend-y2od.onrender.com/api/stories";
const USER_ID = "vikas123"; // replace later with real user

// Utility: time ago
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
  const [isMuted, setIsMuted] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [views, setViews] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [isCommenting, setIsCommenting] = useState(false);
  const [viewedSlides, setViewedSlides] = useState(new Set());

  const intervalRef = useRef(null);
  const videoRef = useRef(null);

  /** Fetch stories */
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get(API_BASE);
        const data = res.data || [];
        setStories(data);
      } catch (err) {
        console.error("Error fetching stories:", err);
      }
    };
    fetchStories();
  }, []);

  /** Next Slide */
  const nextSlide = useCallback(() => {
    clearInterval(intervalRef.current);
    const story = stories[currentStoryIndex];
    if (!story) return;

    if (currentSlideIndex + 1 < story.slides.length) {
      setCurrentSlideIndex((i) => i + 1);
    } else if (currentStoryIndex + 1 < stories.length) {
      setCurrentStoryIndex((i) => i + 1);
      setCurrentSlideIndex(0);
    } else {
      setCurrentStoryIndex(0);
      setCurrentSlideIndex(0);
    }
  }, [currentStoryIndex, currentSlideIndex, stories]);

  /** Previous Slide */
  const prevSlide = () => {
    clearInterval(intervalRef.current);
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((i) => i - 1);
    } else if (currentStoryIndex > 0) {
      const prevStory = stories[currentStoryIndex - 1];
      setCurrentStoryIndex((i) => i - 1);
      setCurrentSlideIndex(prevStory.slides.length - 1);
    }
  };

  /** Start timer for images */
  const startImageTimer = useCallback(() => {
    setProgress(0);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 100 / (SLIDE_DURATION / 100);
      });
    }, 100);
  }, [nextSlide]);

  /** Update slide info */
  useEffect(() => {
    if (!stories.length) return;
    const story = stories[currentStoryIndex];
    const currentSlide = story?.slides?.[currentSlideIndex];
    if (!currentSlide) return;

    const fetchSlideData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/${story._id}`);
        const slide = res.data.slides[currentSlideIndex];
        setLikesCount(slide.likes?.length || 0);
        setLiked(slide.likes?.includes(USER_ID));
        setComments(slide.comments || []);
        setViews(slide.views || 0);
      } catch (err) {
        console.error("Error fetching slide data:", err);
      }
    };
    fetchSlideData();

    // 🟢 Increment view only once per user per slide
    const uniqueKey = `${story._id}-${currentSlideIndex}`;
    if (!viewedSlides.has(uniqueKey)) {
      setViewedSlides((prev) => new Set([...prev, uniqueKey]));
      axios
        .post(`${API_BASE}/${story._id}/slides/${currentSlideIndex}/view`, {
          userId: USER_ID,
        })
        .catch(() => {});
    }

    // 🟢 Pause if typing comment
    if (isCommenting) return;

    if (currentSlide.type === "video") {
      clearInterval(intervalRef.current);
      setProgress(0);
      if (videoRef.current) {
        videoRef.current.muted = isMuted;
        videoRef.current.play().catch(() => {});
      }
    } else {
      startImageTimer();
    }

    return () => clearInterval(intervalRef.current);
  }, [
    currentStoryIndex,
    currentSlideIndex,
    stories,
    isMuted,
    startImageTimer,
    isCommenting,
    viewedSlides,
  ]);

  const handleVideoEnd = () => nextSlide();

  /** Like */
  const handleLike = async () => {
    const story = stories[currentStoryIndex];
    if (!story) return;
    try {
      const res = await axios.post(
        `${API_BASE}/${story._id}/slides/${currentSlideIndex}/like`,
        { userId: USER_ID }
      );
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  /** Comment */
  const handleComment = async (e) => {
    e.preventDefault();
    const story = stories[currentStoryIndex];
    if (!story || !commentText.trim()) return;

    try {
      const res = await axios.post(
        `${API_BASE}/${story._id}/slides/${currentSlideIndex}/comment`,
        {
          user: USER_ID,
          text: commentText,
        }
      );
      setComments(res.data.comments);
      setCommentText("");
      setIsCommenting(false);
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  /** Pause/resume while commenting */
  const handleFocus = () => {
    setIsCommenting(true);
    clearInterval(intervalRef.current);
    if (videoRef.current) videoRef.current.pause();
  };

  const handleBlur = () => {
    setIsCommenting(false);
    const story = stories[currentStoryIndex];
    const slide = story.slides[currentSlideIndex];
    if (slide.type === "video") {
      videoRef.current?.play().catch(() => {});
    } else {
      startImageTimer();
    }
  };

  if (!stories.length) return <p>Loading stories...</p>;

  const story = stories[currentStoryIndex];
  const currentSlide = story.slides[currentSlideIndex];

  return (
    <div className="story-player">
      {/* Topbar */}
      <div className="story-topbar">
        <span className="story-title">{story.title}</span>
        <span className="story-time">{timeAgo(story.createdAt)}</span>
      </div>

      {/* Progress bars */}
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

      {/* Slide content */}
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
          <img
            src={currentSlide.url}
            alt="story slide"
            className="story-media"
          />
        )}
        <div className="story-tap-left" onClick={prevSlide}></div>
        <div className="story-tap-right" onClick={nextSlide}></div>
      </div>

      {/* Footer */}
      <div className="story-footer">
        <div className="story-actions">
          <button
            onClick={handleLike}
            className={`like-btn ${liked ? "liked" : ""}`}
          >
            ❤️ {likesCount}
          </button>
          <span className="views">👁️ {views} views</span>
        </div>

        <form onSubmit={handleComment} className="comment-box">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Write a comment..."
          />
          <button type="submit">💬</button>
        </form>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet</p>
          ) : (
            comments.map((c, i) => (
              <div key={i} className="comment-item">
                <strong>{c.user}: </strong> {c.text}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryPlayer;
