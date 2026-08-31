const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Job = require('../models/Job');
const Skill = require('../models/Skill');
const LearningPath = require('../models/LearningPath');
const Project = require('../models/Project');
const CareerMapNode = require('../models/CareerMapNode');
const UserProgress = require('../models/UserProgress');

dotenv.config();

const seedAll = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Job.deleteMany({});
    await Skill.deleteMany({});
    await LearningPath.deleteMany({});
    await Project.deleteMany({});
    await CareerMapNode.deleteMany({});
    await UserProgress.deleteMany({});

    console.log('Seeding Users...');
    const demoUser = await User.create({
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: 'password123',
      role: 'user'
    });

    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@pathrecommender.com',
      password: 'adminpassword123',
      role: 'admin'
    });

    console.log('Seeding Demo Profile...');
    await Profile.create({
      user: demoUser._id,
      education: {
        degree: 'B.Tech',
        branch: 'Computer Science',
        graduationYear: 2025,
        college: 'State University of Technology'
      },
      experienceLevel: 'Entry Level',
      currentStatus: 'Student',
      skills: [
        { skillName: 'React', category: 'Frontend', level: 'Advanced', experienceYears: 2 },
        { skillName: 'JavaScript', category: 'Language', level: 'Advanced', experienceYears: 2 },
        { skillName: 'Node.js', category: 'Backend', level: 'Intermediate', experienceYears: 1 },
        { skillName: 'MongoDB', category: 'Database', level: 'Intermediate', experienceYears: 1 },
        { skillName: 'HTML/CSS', category: 'Frontend', level: 'Advanced', experienceYears: 2 },
        { skillName: 'Express', category: 'Backend', level: 'Intermediate', experienceYears: 1 },
        { skillName: 'Docker', category: 'DevOps', level: 'Beginner', experienceYears: 0 },
        { skillName: 'Testing', category: 'Fundamentals', level: 'Beginner', experienceYears: 0 }
      ],
      softSkills: ['Problem Solving', 'Teamwork', 'Communication'],
      interests: ['Full Stack Development', 'Cloud Computing', 'AI Integrations'],
      preferredDomain: 'Full Stack Development',
      targetJobRole: 'Full Stack Developer',
      preferredWorkType: 'Remote',
      weeklyLearningHours: 12,
      projects: [
        {
          title: 'E-Commerce Microservices Store',
          description: 'Full stack shopping app with React frontend, Node backend, and MongoDB.',
          techStack: ['React', 'Node.js', 'MongoDB', 'Express']
        }
      ],
      certifications: [
        { name: 'Full Stack Web Development Certificate', issuer: 'Meta / Coursera', year: 2024 }
      ],
      onboardingCompleted: true
    });

    console.log('Seeding Skills Catalog...');
    await Skill.insertMany([
      { name: 'JavaScript', category: 'Language', description: 'Core programming language of the web.' },
      { name: 'React', category: 'Frontend', description: 'Declarative UI library.' },
      { name: 'Node.js', category: 'Backend', description: 'JavaScript runtime environment.' },
      { name: 'MongoDB', category: 'Database', description: 'NoSQL document database.' },
      { name: 'Docker', category: 'DevOps', description: 'Containerization technology.' },
      { name: 'AWS', category: 'DevOps', description: 'Amazon Web Services cloud infrastructure.' },
      { name: 'System Design', category: 'System Design', description: 'Architecting scalable distributed systems.' },
      { name: 'Testing', category: 'Fundamentals', description: 'Unit and integration testing with Jest and RTL.' }
    ]);

    console.log('Seeding Job Roles Catalog...');
    await Job.insertMany([
      {
        title: 'Full Stack Developer Intern',
        domain: 'Full Stack Development',
        experienceLevel: 'Entry Level',
        salaryRange: '$55,000 - $75,000',
        description: 'Build responsive web apps, REST APIs, and database models using the MERN stack.',
        requiredSkills: [
          { skillName: 'React', minLevel: 7, weight: 1.2 },
          { skillName: 'JavaScript', minLevel: 7, weight: 1.2 },
          { skillName: 'Node.js', minLevel: 6, weight: 1.0 },
          { skillName: 'MongoDB', minLevel: 6, weight: 1.0 },
          { skillName: 'Docker', minLevel: 4, weight: 0.8 }
        ],
        requiredEducation: ['B.Tech in CS/IT or equivalent'],
        recommendedProjects: ['E-Commerce Platform', 'AI Expense Tracker']
      },
      {
        title: 'Junior MERN Developer',
        domain: 'Full Stack Development',
        experienceLevel: 'Entry Level',
        salaryRange: '$70,000 - $90,000',
        description: 'Develop and maintain MERN stack web applications with automated testing and deployment.',
        requiredSkills: [
          { skillName: 'React', minLevel: 8, weight: 1.2 },
          { skillName: 'JavaScript', minLevel: 8, weight: 1.2 },
          { skillName: 'Node.js', minLevel: 7, weight: 1.1 },
          { skillName: 'MongoDB', minLevel: 7, weight: 1.0 },
          { skillName: 'Docker', minLevel: 5, weight: 0.9 },
          { skillName: 'Testing', minLevel: 5, weight: 0.8 }
        ],
        requiredEducation: ['Degree in CS/IT or Bootcamp Graduate'],
        recommendedProjects: ['AI Task & Workflow Automation']
      },
      {
        title: 'Frontend Developer',
        domain: 'Frontend Development',
        experienceLevel: 'Entry Level',
        salaryRange: '$65,000 - $85,000',
        description: 'Focus on crafting high-performance, visually polished user interfaces in React.',
        requiredSkills: [
          { skillName: 'React', minLevel: 8, weight: 1.5 },
          { skillName: 'JavaScript', minLevel: 8, weight: 1.3 },
          { skillName: 'HTML/CSS', minLevel: 8, weight: 1.0 },
          { skillName: 'Testing', minLevel: 6, weight: 0.9 }
        ],
        requiredEducation: ['B.Tech or relevant experience'],
        recommendedProjects: ['Interactive Analytics Dashboard']
      },
      {
        title: 'Node.js Backend Developer',
        domain: 'Backend Development',
        experienceLevel: 'Entry Level',
        salaryRange: '$72,000 - $92,000',
        description: 'Design robust REST APIs, handle asynchronous jobs, database queries, and microservices.',
        requiredSkills: [
          { skillName: 'Node.js', minLevel: 8, weight: 1.5 },
          { skillName: 'JavaScript', minLevel: 8, weight: 1.2 },
          { skillName: 'MongoDB', minLevel: 7, weight: 1.2 },
          { skillName: 'Docker', minLevel: 6, weight: 1.0 },
          { skillName: 'System Design', minLevel: 6, weight: 1.0 }
        ],
        requiredEducation: ['B.Tech CS/IT'],
        recommendedProjects: ['High-Throughput API Gateway']
      },
      {
        title: 'DevOps & Cloud Engineer',
        domain: 'DevOps & Cloud',
        experienceLevel: 'Intermediate',
        salaryRange: '$85,000 - $115,000',
        description: 'Automate CI/CD pipelines, containerize applications, and manage AWS infrastructure.',
        requiredSkills: [
          { skillName: 'Docker', minLevel: 8, weight: 1.5 },
          { skillName: 'AWS', minLevel: 8, weight: 1.5 },
          { skillName: 'System Design', minLevel: 7, weight: 1.2 },
          { skillName: 'Node.js', minLevel: 6, weight: 0.8 }
        ],
        requiredEducation: ['B.Tech CS/IT'],
        recommendedProjects: ['Multi-Region AWS Kubernetes Deployer']
      }
    ]);

    console.log('Seeding Learning Paths & Dependency Nodes...');
    await LearningPath.create({
      learningGoal: 'Full Stack Development',
      description: 'Master complete MERN stack development from core fundamentals to cloud deployment.',
      nodes: [
        {
          id: 'js-fund',
          topic: 'JavaScript Fundamentals',
          category: 'Core Language',
          difficulty: 'Beginner',
          prerequisites: [],
          whyRecommended: 'Foundation for modern frontend and backend Web Development.',
          estimatedHours: 8,
          resources: [
            { title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', type: 'Documentation' },
            { title: 'JavaScript.info Complete Tutorial', url: 'https://javascript.info', type: 'Interactive' }
          ],
          practiceTask: 'Write functions for array manipulation, closures, and async Promises.',
          quiz: [
            {
              id: 'js-q1',
              question: 'Which of the following is true about arrow functions in JavaScript?',
              options: [
                'They do not have their own this binding',
                'They cannot return values implicitly',
                'They are hoisted before declaration',
                'They replace all standard function definitions'
              ],
              correctIndex: 0,
              explanation: 'Arrow functions lexically bind the this value from their surrounding code context.'
            }
          ]
        },
        {
          id: 'react-hooks',
          topic: 'React & Custom Hooks',
          category: 'Frontend Framework',
          difficulty: 'Intermediate',
          prerequisites: ['js-fund'],
          whyRecommended: 'Essential for building modern reactive user interfaces.',
          estimatedHours: 12,
          resources: [
            { title: 'Official React Documentation', url: 'https://react.dev', type: 'Documentation' },
            { title: 'React Hooks Deep Dive', url: '#', type: 'Video' }
          ],
          practiceTask: 'Create custom useFetch and useLocalStorage hooks with proper dependency arrays.',
          quiz: [
            {
              id: 'react-q1',
              question: 'What happens if you omit the dependency array in useEffect?',
              options: [
                'The effect runs only on component mount',
                'The effect runs on every single render',
                'The effect never executes',
                'It causes a syntax error'
              ],
              correctIndex: 1,
              explanation: 'Omitting the second argument array causes useEffect to execute after every render cycle.'
            }
          ]
        },
        {
          id: 'node-express',
          topic: 'Node.js & Express REST APIs',
          category: 'Backend',
          difficulty: 'Intermediate',
          prerequisites: ['js-fund'],
          whyRecommended: 'Core requirement for backend business logic and API gateways.',
          estimatedHours: 10,
          resources: [
            { title: 'Express.js Documentation', url: 'https://expressjs.com', type: 'Documentation' }
          ],
          practiceTask: 'Build a CRUD Express API server with router modularization and error handling middleware.',
          quiz: [
            {
              id: 'node-q1',
              question: 'In Express, what parameters must error handling middleware specify?',
              options: ['(req, res)', '(err, req, res, next)', '(req, res, next)', '(err, res)'],
              correctIndex: 1,
              explanation: 'Express recognizes error handling middleware specifically by its 4-parameter signature: (err, req, res, next).'
            }
          ]
        },
        {
          id: 'docker-containers',
          topic: 'Docker Containerization',
          category: 'DevOps',
          difficulty: 'Intermediate',
          prerequisites: ['node-express'],
          whyRecommended: 'Addresses 1 of your major skill gaps for full stack roles.',
          estimatedHours: 8,
          resources: [
            { title: 'Docker Official Getting Started Guide', url: 'https://docs.docker.com/get-started/', type: 'Documentation' }
          ],
          practiceTask: 'Write Dockerfile and docker-compose.yml for a Node.js API and MongoDB instance.',
          quiz: [
            {
              id: 'docker-q1',
              question: 'Which Docker command compiles a Dockerfile into an image?',
              options: ['docker run', 'docker build', 'docker compose up', 'docker start'],
              correctIndex: 1,
              explanation: 'docker build executes instructions in a Dockerfile to build a runnable container image.'
            }
          ]
        },
        {
          id: 'cloud-aws',
          topic: 'AWS Cloud Infrastructure',
          category: 'Cloud',
          difficulty: 'Advanced',
          prerequisites: ['docker-containers'],
          whyRecommended: 'Increases career match score by +7% across senior full stack jobs.',
          estimatedHours: 14,
          resources: [
            { title: 'AWS Elastic Beanstalk & EC2 Deployment', url: 'https://aws.amazon.com', type: 'Documentation' }
          ],
          practiceTask: 'Deploy your dockerized container onto AWS Elastic Beanstalk / ECS.',
          quiz: [
            {
              id: 'aws-q1',
              question: 'Which AWS service provides resizable compute capacity in the cloud?',
              options: ['Amazon S3', 'Amazon EC2', 'Amazon DynamoDB', 'AWS Lambda'],
              correctIndex: 1,
              explanation: 'EC2 (Elastic Compute Cloud) provides scalable virtual servers in AWS.'
            }
          ]
        }
      ]
    });

    console.log('Seeding Recommended Projects Catalog...');
    await Project.insertMany([
      {
        title: 'AI Expense Tracker & Financial Insights',
        description: 'Smart personal finance dashboard using MERN stack, Chart.js visualizations, and automated transaction categorization.',
        difficulty: 'Intermediate',
        targetRole: 'Full Stack Developer',
        skillsDeveloped: ['React', 'Node.js', 'MongoDB', 'JWT', 'Charts'],
        why: 'Directly addresses 3 of your current skill gaps with practical full-stack application.',
        deliverables: [
          'Secure JWT Authentication & Password Hashing',
          'Interactive Recharts spending visualizations',
          'MongoDB aggregation pipelines for monthly summaries'
        ]
      },
      {
        title: 'Multi-Container Microservices E-Commerce Platform',
        description: 'Scalable MERN shopping engine containerized with Docker Compose, API gateway, and Redis caching.',
        difficulty: 'Advanced',
        targetRole: 'Full Stack Developer',
        skillsDeveloped: ['Docker', 'Node.js', 'Redis', 'MongoDB', 'System Design'],
        why: 'Demonstrates enterprise production readiness for Docker and System Design requirements.',
        deliverables: [
          'Docker Compose multi-service setup',
          'Redis rate-limiting and session caching',
          'Stripe/PayPal integration simulation'
        ]
      }
    ]);

    console.log('Seeding Career Opportunity Map Graph Nodes...');
    await CareerMapNode.insertMany([
      {
        nodeId: 'js-root',
        label: 'JavaScript Ecosystem',
        category: 'Root',
        parentIds: [],
        requiredSkills: ['JavaScript', 'HTML/CSS'],
        unlockedRoles: ['Frontend Developer', 'Backend Developer'],
        description: 'The core foundational layer unlocking modern web application engineering.',
        averageSalary: '$65,000'
      },
      {
        nodeId: 'frontend-spec',
        label: 'Frontend Engineering',
        category: 'Subdomain',
        parentIds: ['js-root'],
        requiredSkills: ['React', 'TypeScript', 'Tailwind CSS'],
        unlockedRoles: ['Frontend Developer', 'UI Engineer'],
        description: 'Specialized client-side responsive interface creation.',
        averageSalary: '$78,000'
      },
      {
        nodeId: 'backend-spec',
        label: 'Backend Engineering',
        category: 'Subdomain',
        parentIds: ['js-root'],
        requiredSkills: ['Node.js', 'MongoDB', 'Express', 'REST API'],
        unlockedRoles: ['Node.js Backend Developer', 'API Engineer'],
        description: 'Server architecture, API routes, security, and database modeling.',
        averageSalary: '$82,000'
      },
      {
        nodeId: 'fullstack-role',
        label: 'Full Stack Developer',
        category: 'Role',
        parentIds: ['frontend-spec', 'backend-spec'],
        requiredSkills: ['React', 'Node.js', 'MongoDB', 'Docker'],
        unlockedRoles: ['Full Stack Developer', 'Lead Engineer'],
        description: 'End-to-end full stack development from UI components to database scalability.',
        averageSalary: '$92,000'
      },
      {
        nodeId: 'system-design',
        label: 'System Design & Cloud',
        category: 'Specialization',
        parentIds: ['fullstack-role'],
        requiredSkills: ['System Design', 'AWS', 'Docker', 'Testing'],
        unlockedRoles: ['Senior Software Engineer', 'Solutions Architect'],
        description: 'High availability, microservices architecture, and cloud operations.',
        averageSalary: '$120,000'
      }
    ]);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding error:', error);
    process.exit(1);
  }
};

seedAll();
