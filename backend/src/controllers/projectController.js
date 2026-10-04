import Project from '../models/Project.js';

// @desc    Get all projects (with filtering, search & sorting)
// @route   GET /api/projects
// @access  Public (or Protected)
export const getProjects = async (req, res, next) => {
  try {
    const { search, status, priority, category, sort } = req.query;

    const query = {};

    // Text search on title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by priority
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Sorting
    let sortBy = { createdAt: -1 };
    if (sort === 'oldest') sortBy = { createdAt: 1 };
    if (sort === 'budget-asc') sortBy = { budget: 1 };
    if (sort === 'budget-desc') sortBy = { budget: -1 };
    if (sort === 'deadline-asc') sortBy = { deadline: 1 };

    const projects = await Project.find(query)
      .populate('createdBy', 'name email role')
      .sort(sortBy);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      'createdBy',
      'name email role'
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private / Authenticated
export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      status,
      priority,
      budget,
      deadline,
      assignedTo
    } = req.body;

    const projectData = {
      title,
      description,
      category,
      status,
      priority,
      budget,
      deadline,
      assignedTo
    };

    if (req.user) {
      projectData.createdBy = req.user._id;
    }

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private / Authenticated
export const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project not found with id of ${req.params.id}`
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private / Authenticated
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project not found with id of ${req.params.id}`
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project summary metrics / stats
// @route   GET /api/projects/stats/summary
// @access  Public
export const getProjectStats = async (req, res, next) => {
  try {
    const totalProjects = await Project.countDocuments();
    
    // Status counts
    const statusCounts = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Priority counts
    const priorityCounts = await Project.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Total budget
    const budgetSum = await Project.aggregate([
      { $group: { _id: null, totalBudget: { $sum: '$budget' } } }
    ]);

    const formattedStatus = {
      Planning: 0,
      'In Progress': 0,
      Completed: 0,
      'On Hold': 0
    };
    statusCounts.forEach((s) => {
      if (s._id) formattedStatus[s._id] = s.count;
    });

    const formattedPriority = {
      Low: 0,
      Medium: 0,
      High: 0,
      Urgent: 0
    };
    priorityCounts.forEach((p) => {
      if (p._id) formattedPriority[p._id] = p.count;
    });

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        totalBudget: budgetSum.length > 0 ? budgetSum[0].totalBudget : 0,
        byStatus: formattedStatus,
        byPriority: formattedPriority
      }
    });
  } catch (error) {
    next(error);
  }
};
