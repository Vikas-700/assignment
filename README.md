# Web Stories Full-Stack Project

A full-stack web application for creating, managing, and viewing web stories, similar to Instagram or Google Web Stories. This project includes an Admin CMS for managing stories and a Frontend Player for displaying them.

## Features

### Admin CMS
- View all existing stories with title, category, and created date.
- Add new stories with multiple slides (images or videos).
- Edit existing stories (update title/category, add/remove slides).
- Delete stories.
- Upload media to Cloudinary with auto-cropping for images.

### Frontend Player
- Browse stories by categories.
- Auto-play slides like Instagram stories.
- Tap/click to go forward or backward.
- Video slides play automatically.
- Progress bars for slides.
- Mobile-friendly design.

## Tech Stack

**Frontend:**
- React
- React Router
- Axios
- CSS

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
  <img width="1366" height="768" alt="Image" src="https://github.com/user-attachments/assets/02b6be75-a96b-43c4-92ad-955166632149" />
- Multer (file uploads)
- Cloudinary (media storage)
  <img width="1366" height="768" alt="Image" src="https://github.com/user-attachments/assets/99940b0f-a767-4c12-a4bf-8482a9074720" />

## Installation

### Backend

1. Clone the repository:  
` git clone <repo-url>`  
` cd backend`
2. Install dependencies:  
  ` npm install`

Create a `.env` file:  
PORT=5000  
MONGO_URI=<your-mongodb-uri>  
CLOUD_NAME=<cloudinary-cloud-name>  
API_KEY=<cloudinary-api-key>  
API_SECRET=<cloudinary-api-secret>  

4. Start the server:
   `npm run dev`
Backend runs at `http://localhost:5000`.

### Frontend

Backend runs at `http://localhost:5000`.

### Frontend

1. Navigate to the frontend directory:
`cd frontend`


2. Install dependencies:
`npm install`

3. Start the frontend:
`npm start`


Frontend runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint           | Description            |
|--------|--------------------|------------------------|
| GET    | /api/stories       | Get all stories        |
| GET    | /api/stories/:id   | Get a single story by ID |
| POST   | /api/stories       | Create a new story     |
| PUT    | /api/stories/:id   | Update a story         |
| DELETE | /api/stories/:id   | Delete a story         |

## Folder Structure

backend/
├── controllers/
│   └── storyController.js
├── models/
│   └── storyModel.js
├── routes/
│   └── storyRoutes.js
├── uploads/
├── cloudinary.js
├── server.js
├── package.json
└── .env

frontend/
├── src/
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── StoryPlayer.js
│   │   └── StoryDetail.js
│   ├── components/
│   │   ├── StoryForm.js
│   │   └── StoryTable.js
│   ├── api/
│   │   └── storyApi.js
│   └── App.js
├── package.json
└── public/


