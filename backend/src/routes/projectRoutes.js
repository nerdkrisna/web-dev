import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats
} from '../controllers/projectController.js';
import { protect, optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Specific routes first to avoid route param collision
router.get('/stats/summary', getProjectStats);

// Main CRUD routes
router
  .route('/')
  .get(getProjects)
  .post(protect, createProject);

router
  .route('/:id')
  .get(getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

export default router;
