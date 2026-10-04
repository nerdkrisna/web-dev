import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './models/Project.js';
import User from './models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Find or create admin/manager user
    let user = await User.findOne({ email: 'admin@projecthub.io' });
    if (!user) {
      user = await User.create({
        name: 'Alex Johnson',
        email: 'admin@projecthub.io',
        password: 'Password123!',
        role: 'Admin'
      });
      console.log('Created seed user:', user.email);
    }

    const count = await Project.countDocuments();
    if (count < 3) {
      const sampleProjects = [
        {
          title: 'Enterprise ERP Modernization',
          description: 'Refactoring legacy monolith backend to event-driven microservices architecture using Node.js and Kafka.',
          category: 'Web Development',
          status: 'In Progress',
          priority: 'High',
          budget: 65000,
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          assignedTo: 'Backend Core Team',
          createdBy: user._id
        },
        {
          title: 'iOS & Android Mobile App V2',
          description: 'Cross-platform mobile application for real-time customer tracking and push notification delivery.',
          category: 'Mobile App',
          status: 'Planning',
          priority: 'Urgent',
          budget: 42000,
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          assignedTo: 'Mobile Squad',
          createdBy: user._id
        },
        {
          title: 'Design System & Component Library',
          description: 'Unified Figma tokens and accessible React UI component library matching WCAG 2.1 AA standards.',
          category: 'UI/UX Design',
          status: 'Completed',
          priority: 'Medium',
          budget: 24000,
          deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          assignedTo: 'Design Studio',
          createdBy: user._id
        },
        {
          title: 'Automated CI/CD Pipeline & K8s Cluster',
          description: 'Zero-downtime deployment pipelines with Docker, Kubernetes, Helm charts, and Prometheus monitoring.',
          category: 'DevOps',
          status: 'In Progress',
          priority: 'High',
          budget: 38000,
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          assignedTo: 'DevOps Team',
          createdBy: user._id
        }
      ];

      await Project.insertMany(sampleProjects);
      console.log(`Seeded ${sampleProjects.length} sample projects.`);
    } else {
      console.log(`Database already has ${count} projects.`);
    }

    await mongoose.connection.close();
    console.log('Seeding finished and connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
