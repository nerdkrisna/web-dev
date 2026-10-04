import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Web Development',
        'Mobile App',
        'UI/UX Design',
        'DevOps',
        'Marketing',
        'Data Science',
        'Other'
      ],
      default: 'Web Development'
    },
    status: {
      type: String,
      enum: ['Planning', 'In Progress', 'Completed', 'On Hold'],
      default: 'Planning'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    budget: {
      type: Number,
      default: 0,
      min: [0, 'Budget must be a positive number']
    },
    deadline: {
      type: Date,
      required: [true, 'Project deadline is required']
    },
    assignedTo: {
      type: String,
      default: 'Unassigned',
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Project', projectSchema);
