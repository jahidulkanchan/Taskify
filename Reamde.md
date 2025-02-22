# Task Management Application

## Live Demo
[Taskify](https://taskifypage.netlify.app)

## Features
- Google Sign-in (Firebase Authentication)
- Add, edit, delete, and reorder tasks
- Drag-and-drop for task management
- Real-time updates with MongoDB
- Responsive UI (Vite.js + React, Tailwind CSS)
- Express.js backend with MongoDB

## Installation
```sh
git clone https://github.com/jahidulkanchan/Taskify
cd task-management-app
```
### Backend Setup
```sh
cd backend
npm install
npm start
```
### Frontend Setup
```sh
cd frontend
npm install
npm run dev
```

## API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | /tasks  | Add task |
| GET    | /tasks  | Get tasks |
| PUT    | /tasks/:id | Update task |
| DELETE | /tasks/:id | Delete task |

## Deployment
- **Frontend:** [Netlify](https://taskifypage.netlify.app)
- **Backend:** Vercel / Render _(replace with actual link)_
- **Database:** MongoDB Atlas

## Author
**Md Jahidul Islam**   
[GitHub](https://github.com/jahidulkanchan)  

## License
[MIT License](LICENSE)
