/**
 * Recommendation & Learning Path Engine for PathRecommender
 * Strictly personalized to the authenticated user's target learning goal.
 * Eliminates default full-stack biases and provides target-specific learning sequences.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (err) {
    console.warn("RecommendationEngine: Failed to initialize GoogleGenerativeAI:", err.message);
  }
}

/**
 * Normalization helper
 */
const normalizeSkill = (s) => (s || '').toLowerCase().trim().replace(/[.\s\-_]/g, '');

/**
 * Skill level text -> numeric score (1-10)
 */
const levelToNumber = (level) => {
  if (typeof level === 'number') return level;
  const map = {
    'Beginner': 3,
    'Intermediate': 6,
    'Advanced': 9,
    'Expert': 10,
    'Not Assessed': 1
  };
  return map[level] || 3;
};

/**
 * Target Goal -> Required Skills Mapping
 * Strictly target-specific (never injects HTML/React/Node into Python or DevOps).
 */
const GOAL_SKILL_MAP = {
  'Python': [
    'Python Syntax',
    'Variables & Data Types',
    'Control Flow & Loops',
    'Functions',
    'Collections (Lists, Dicts, Sets, Tuples)',
    'Object-Oriented Programming in Python',
    'Modules & Packages',
    'Exception Handling',
    'File Handling',
    'Virtual Environments',
    'Testing with PyTest',
    'APIs & Requests with Python',
    'Database Integration with Python'
  ],
  'Backend Development': [
    'Backend Programming (Node.js / Python)',
    'REST API Design',
    'Express.js / FastAPI',
    'PostgreSQL & SQL',
    'MongoDB',
    'Authentication & JWT Security',
    'Caching with Redis',
    'Docker Containerization',
    'Microservices Architecture'
  ],
  'Frontend Development': [
    'HTML5 Semantic Markup',
    'CSS3 & Responsive Design',
    'JavaScript ES6+',
    'React Fundamentals',
    'React Hooks & State',
    'TypeScript',
    'Tailwind CSS',
    'Frontend Testing',
    'Web Performance'
  ],
  'Full Stack Development': [
    'HTML5 & CSS3',
    'JavaScript ES6+',
    'React & Hooks',
    'Node.js & Express REST APIs',
    'MongoDB & Database Modeling',
    'Authentication & JWT Security',
    'Testing with Jest',
    'Docker Containerization',
    'Cloud Deployment',
    'System Design Fundamentals'
  ],
  'Machine Learning': [
    'Python for ML',
    'Linear Algebra & Statistics',
    'NumPy & Pandas',
    'Data Cleaning & EDA',
    'Scikit-learn & Classical ML',
    'Model Evaluation & Tuning',
    'Deep Learning with TensorFlow/PyTorch',
    'NLP & Computer Vision Basics'
  ],
  'Data Science': [
    'Python for Data Science',
    'Statistics & Probability',
    'Pandas & NumPy Data Wrangling',
    'Exploratory Data Analysis (EDA)',
    'SQL for Data Analytics',
    'Data Visualization (Matplotlib/Seaborn)',
    'Feature Engineering',
    'Machine Learning for Analytics'
  ],
  'DevOps': [
    'Linux Administration & Bash',
    'Git & Version Control Workflows',
    'Docker Containerization',
    'CI/CD with GitHub Actions',
    'Kubernetes Container Orchestration',
    'Terraform Infrastructure as Code',
    'Cloud Architecture (AWS/GCP/Azure)',
    'Prometheus & Grafana Monitoring',
    'SRE & Security Best Practices'
  ],
  'System Design': [
    'Distributed Systems Fundamentals',
    'Load Balancing & Reverse Proxies',
    'Caching Strategies (Redis)',
    'Database Sharding & Replication',
    'Message Queues (Kafka / RabbitMQ)',
    'Microservices & gRPC/REST',
    'Distributed Consensus & CAP Theorem',
    'Rate Limiting & API Gateways',
    'High Availability & Disaster Recovery'
  ],
  'React': [
    'Modern JavaScript ES6+',
    'React JSX & Components',
    'State, Props & Event Handling',
    'React Hooks (useEffect, useMemo)',
    'Context API & State Management',
    'React Router & Navigation',
    'Form Handling & Validation',
    'React Performance Optimization',
    'TypeScript with React'
  ],
  'Data Structures': [
    'Programming Fundamentals & Big-O',
    'Arrays & Strings',
    'Linked Lists',
    'Stacks & Queues',
    'Hash Tables & Sets',
    'Binary Trees & BSTs',
    'Graphs & Traversals (BFS/DFS)',
    'Sorting & Searching Algorithms',
    'Dynamic Programming & Recursion'
  ]
};

/**
 * Curated Target-Specific Node Catalogs
 */
const GOAL_CATALOGS = {
  // ─── 1. PYTHON (Strictly Python-centric) ───
  'Python': [
    {
      id: 'py-syntax-vars',
      topic: 'Python Syntax, Variables & Basic Types',
      category: 'Language Basics',
      difficulty: 'Beginner',
      prerequisites: [],
      relatedSkills: ['python', 'py', 'variables', 'pythonsyntax'],
      estimatedHours: 6,
      whyRecommended: 'Foundational syntax, dynamic typing, operators, and basic numeric/string operations in Python.'
    },
    {
      id: 'py-control-flow',
      topic: 'Control Flow, Loops & Comprehensions',
      category: 'Language Basics',
      difficulty: 'Beginner',
      prerequisites: ['py-syntax-vars'],
      relatedSkills: ['python', 'controlflow', 'loops', 'listcomprehensions'],
      estimatedHours: 6,
      whyRecommended: 'Master if-else conditions, while/for loops, break/continue, and idiomatic Python list/dict comprehensions.'
    },
    {
      id: 'py-data-structures',
      topic: 'Built-in Collections (Lists, Dicts, Sets, Tuples)',
      category: 'Data Structures',
      difficulty: 'Beginner',
      prerequisites: ['py-control-flow'],
      relatedSkills: ['python', 'collections', 'lists', 'dictionaries', 'tuples', 'sets'],
      estimatedHours: 8,
      whyRecommended: 'Deep dive into Python\'s core data structures, memory layout, mutability, and standard collection methods.'
    },
    {
      id: 'py-functions-scopes',
      topic: 'Functions, Scopes, *args, **kwargs & Lambdas',
      category: 'Functional Core',
      difficulty: 'Beginner',
      prerequisites: ['py-data-structures'],
      relatedSkills: ['python', 'functions', 'lambda', 'scoping'],
      estimatedHours: 7,
      whyRecommended: 'Clean function design, argument unpacking, closures, and LEGB scoping rules.'
    },
    {
      id: 'py-oop',
      topic: 'Object-Oriented Programming (OOP) in Python',
      category: 'OOP & Architecture',
      difficulty: 'Intermediate',
      prerequisites: ['py-functions-scopes'],
      relatedSkills: ['python', 'oop', 'classes', 'inheritance', 'dundermethods'],
      estimatedHours: 10,
      whyRecommended: 'Classes, inheritance, encapsulation, polymorphism, and Python magic/dunder methods (__init__, __repr__, __str__).'
    },
    {
      id: 'py-modules-pkgs',
      topic: 'Modules, Packages & Virtual Environments',
      category: 'Tooling & Ecosystem',
      difficulty: 'Intermediate',
      prerequisites: ['py-oop'],
      relatedSkills: ['python', 'pip', 'venv', 'modules', 'packages'],
      estimatedHours: 5,
      whyRecommended: 'Organizing multi-file Python projects, packaging with pyproject.toml, and managing isolated environments with venv/pipenv.'
    },
    {
      id: 'py-exceptions-files',
      topic: 'Exception Handling & File I/O Context Managers',
      category: 'Core Engineering',
      difficulty: 'Intermediate',
      prerequisites: ['py-modules-pkgs'],
      relatedSkills: ['python', 'exceptions', 'fileio', 'contextmanagers', 'json'],
      estimatedHours: 6,
      whyRecommended: 'Robust error handling with try/except/finally, custom exceptions, and context managers (with open) for file operations.'
    },
    {
      id: 'py-testing',
      topic: 'Python Testing with PyTest & Mocking',
      category: 'Quality Assurance',
      difficulty: 'Intermediate',
      prerequisites: ['py-exceptions-files'],
      relatedSkills: ['python', 'pytest', 'unittest', 'testing', 'mock'],
      estimatedHours: 7,
      whyRecommended: 'Write automated unit tests, fixtures, parameterization, and mocking using pytest.'
    },
    {
      id: 'py-apis-requests',
      topic: 'HTTP Requests, REST APIs & Web Interaction',
      category: 'Networking & APIs',
      difficulty: 'Intermediate',
      prerequisites: ['py-exceptions-files'],
      relatedSkills: ['python', 'requests', 'httpx', 'restapi', 'json'],
      estimatedHours: 8,
      whyRecommended: 'Consuming REST APIs, managing headers, authentication, status codes, and asynchronous requests with httpx/requests.'
    },
    {
      id: 'py-database-integration',
      topic: 'Database Integration (SQLite & SQLAlchemy ORM)',
      category: 'Databases',
      difficulty: 'Intermediate',
      prerequisites: ['py-apis-requests'],
      relatedSkills: ['python', 'sqlite', 'sqlalchemy', 'sql', 'orm'],
      estimatedHours: 10,
      whyRecommended: 'Connecting Python to relational databases, running raw queries, and modeling data schemas with SQLAlchemy ORM.'
    },
    {
      id: 'py-advanced-features',
      topic: 'Advanced Python (Generators, Decorators, Typing & Async)',
      category: 'Advanced Python',
      difficulty: 'Advanced',
      prerequisites: ['py-database-integration'],
      relatedSkills: ['python', 'generators', 'decorators', 'asyncio', 'typehints'],
      estimatedHours: 12,
      whyRecommended: 'Master decorators, memory-efficient generators, type hints with mypy, and asynchronous concurrency with asyncio.'
    },
    {
      id: 'py-capstone-project',
      topic: 'Production-Ready Python Capstone Project',
      category: 'Project',
      difficulty: 'Advanced',
      prerequisites: ['py-advanced-features'],
      relatedSkills: ['python', 'project', 'capstone', 'pytest'],
      estimatedHours: 20,
      whyRecommended: 'Build and deploy a complete production-grade Python application with full test coverage and clean architecture.'
    }
  ],

  // ─── 2. BACKEND DEVELOPMENT (Backend & APIs) ───
  'Backend Development': [
    {
      id: 'backend-lang-fund',
      topic: 'Backend Language Fundamentals (Node.js / Python)',
      category: 'Core Runtime',
      difficulty: 'Beginner',
      prerequisites: [],
      relatedSkills: ['node', 'nodejs', 'python', 'javascript'],
      estimatedHours: 8,
      whyRecommended: 'Core runtime environment, asynchronous event loop, and standard library for server applications.'
    },
    {
      id: 'express-fastapi',
      topic: 'RESTful API Architecture & Endpoint Design',
      category: 'Web Frameworks',
      difficulty: 'Intermediate',
      prerequisites: ['backend-lang-fund'],
      relatedSkills: ['express', 'expressjs', 'fastapi', 'restapi', 'routing'],
      estimatedHours: 10,
      whyRecommended: 'Design production HTTP APIs, middleware pipelines, error handlers, and request validation.'
    },
    {
      id: 'relational-db',
      topic: 'Relational Databases & SQL (PostgreSQL)',
      category: 'Databases',
      difficulty: 'Intermediate',
      prerequisites: ['express-fastapi'],
      relatedSkills: ['postgresql', 'postgres', 'sql', 'database', 'prisma', 'sequelize'],
      estimatedHours: 10,
      whyRecommended: 'Relational schema design, indexes, ACID transactions, complex joins, and ORMs.'
    },
    {
      id: 'nosql-db',
      topic: 'NoSQL Document Stores (MongoDB & Redis Caching)',
      category: 'Databases & Caching',
      difficulty: 'Intermediate',
      prerequisites: ['relational-db'],
      relatedSkills: ['mongodb', 'redis', 'caching', 'nosql', 'mongoose'],
      estimatedHours: 8,
      whyRecommended: 'Document storage patterns with MongoDB and high-speed in-memory caching and session management with Redis.'
    },
    {
      id: 'auth-security',
      topic: 'Authentication, JWT & API Security',
      category: 'Security',
      difficulty: 'Intermediate',
      prerequisites: ['express-fastapi', 'nosql-db'],
      relatedSkills: ['auth', 'jwt', 'oauth', 'bcrypt', 'security'],
      estimatedHours: 8,
      whyRecommended: 'Implement secure password hashing, JWT access/refresh token workflows, RBAC, CORS, and rate limiting.'
    },
    {
      id: 'backend-testing',
      topic: 'Backend Automated Testing (Unit & Integration)',
      category: 'Quality Assurance',
      difficulty: 'Intermediate',
      prerequisites: ['auth-security'],
      relatedSkills: ['testing', 'jest', 'pytest', 'supertest', 'integrationtesting'],
      estimatedHours: 8,
      whyRecommended: 'Test API endpoints, mock database connections, and ensure zero regression with automated test suites.'
    },
    {
      id: 'docker-backend',
      topic: 'Docker & Containerized Microservices',
      category: 'DevOps & Deployment',
      difficulty: 'Intermediate',
      prerequisites: ['backend-testing'],
      relatedSkills: ['docker', 'containers', 'dockercompose'],
      estimatedHours: 8,
      whyRecommended: 'Containerize backend services, multi-stage builds, and orchestrate local development with docker-compose.'
    },
    {
      id: 'microservices-mq',
      topic: 'Microservices & Asynchronous Message Queues (Kafka/RabbitMQ)',
      category: 'Architecture',
      difficulty: 'Advanced',
      prerequisites: ['docker-backend'],
      relatedSkills: ['microservices', 'kafka', 'rabbitmq', 'messagequeues', 'eventdriven'],
      estimatedHours: 12,
      whyRecommended: 'Decouple high-traffic backend services using event-driven message brokers and pub/sub patterns.'
    },
    {
      id: 'backend-capstone',
      topic: 'Production Backend Capstone Service',
      category: 'Project',
      difficulty: 'Advanced',
      prerequisites: ['microservices-mq'],
      relatedSkills: ['backend', 'project', 'capstone', 'api'],
      estimatedHours: 20,
      whyRecommended: 'Architect, test, containerize, and deploy a high-performance backend system.'
    }
  ],

  // ─── 3. FRONTEND DEVELOPMENT ───
  'Frontend Development': [
    {
      id: 'html5-css3-mastery',
      topic: 'Semantic HTML5 & Responsive CSS3 Layouts',
      category: 'Foundations',
      difficulty: 'Beginner',
      prerequisites: [],
      relatedSkills: ['html', 'html5', 'css', 'css3', 'flexbox', 'grid'],
      estimatedHours: 8,
      whyRecommended: 'Semantic markup, modern CSS Grid & Flexbox, responsive typography, and mobile-first design.'
    },
    {
      id: 'modern-js-es6',
      topic: 'Modern JavaScript (ES6+), DOM & Async JS',
      category: 'Core Scripting',
      difficulty: 'Beginner',
      prerequisites: ['html5-css3-mastery'],
      relatedSkills: ['javascript', 'js', 'es6', 'asyncawait', 'fetch'],
      estimatedHours: 10,
      whyRecommended: 'Arrow functions, destructuring, promises, async/await, closures, and browser APIs.'
    },
    {
      id: 'react-fundamentals',
      topic: 'React Component Architecture & Props/State',
      category: 'UI Framework',
      difficulty: 'Intermediate',
      prerequisites: ['modern-js-es6'],
      relatedSkills: ['react', 'reactjs', 'jsx', 'components'],
      estimatedHours: 10,
      whyRecommended: 'Component-driven UI development, JSX syntax, unidirectional data flow, and props management.'
    },
    {
      id: 'react-hooks-advanced',
      topic: 'React Hooks, Custom Hooks & Lifecycle',
      category: 'UI Framework',
      difficulty: 'Intermediate',
      prerequisites: ['react-fundamentals'],
      relatedSkills: ['hooks', 'useeffect', 'usememo', 'usecallback', 'customhooks'],
      estimatedHours: 8,
      whyRecommended: 'Manage complex UI state, side effects, memoization, and reusable custom hooks.'
    },
    {
      id: 'ts-frontend',
      topic: 'TypeScript for Frontend Applications',
      category: 'Type Safety',
      difficulty: 'Intermediate',
      prerequisites: ['react-hooks-advanced'],
      relatedSkills: ['typescript', 'ts', 'generics', 'typechecking'],
      estimatedHours: 8,
      whyRecommended: 'Type-safe React props, generics, interface definitions, and eliminating runtime UI errors.'
    },
    {
      id: 'state-mgmt-tailwind',
      topic: 'State Management (Redux/Zustand) & Tailwind CSS',
      category: 'Architecture & Styling',
      difficulty: 'Intermediate',
      prerequisites: ['ts-frontend'],
      relatedSkills: ['redux', 'zustand', 'tailwind', 'tailwindcss'],
      estimatedHours: 8,
      whyRecommended: 'Global state stores and utility-first design systems for rapid UI styling.'
    },
    {
      id: 'frontend-testing',
      topic: 'Frontend Testing with Jest & React Testing Library',
      category: 'Quality Assurance',
      difficulty: 'Intermediate',
      prerequisites: ['state-mgmt-tailwind'],
      relatedSkills: ['jest', 'reacttestinglibrary', 'rtl', 'testing'],
      estimatedHours: 6,
      whyRecommended: 'Unit and integration testing of UI components matching real user behavior.'
    },
    {
      id: 'web-performance',
      topic: 'Web Performance Optimization & Core Web Vitals',
      category: 'Optimization',
      difficulty: 'Advanced',
      prerequisites: ['frontend-testing'],
      relatedSkills: ['webperformance', 'lighthouse', 'codesplitting', 'lazyloading'],
      estimatedHours: 6,
      whyRecommended: 'Code splitting, lazy loading, image optimization, bundle reduction, and Core Web Vitals compliance.'
    },
    {
      id: 'frontend-capstone',
      topic: 'Interactive Frontend Capstone Application',
      category: 'Project',
      difficulty: 'Advanced',
      prerequisites: ['web-performance'],
      relatedSkills: ['react', 'typescript', 'project', 'capstone'],
      estimatedHours: 18,
      whyRecommended: 'Build a production-grade responsive web app featuring type safety, testing, and modern animations.'
    }
  ],

  // ─── 4. MACHINE LEARNING ───
  'Machine Learning': [
    {
      id: 'ml-python-fund',
      topic: 'Python Programming for Machine Learning',
      category: 'Programming',
      difficulty: 'Beginner',
      prerequisites: [],
      relatedSkills: ['python', 'py', 'numpy', 'pandas'],
      estimatedHours: 10,
      whyRecommended: 'Python fundamentals, OOP, list comprehensions, and data structures tailored for data and ML workflows.'
    },
    {
      id: 'ml-math-stats',
      topic: 'Linear Algebra, Calculus & Statistics for ML',
      category: 'Mathematics',
      difficulty: 'Beginner',
      prerequisites: ['ml-python-fund'],
      relatedSkills: ['statistics', 'linearalgebra', 'calculus', 'probability'],
      estimatedHours: 12,
      whyRecommended: 'Vector/matrix operations, dot products, derivatives, gradients, and probability distributions underlying ML.'
    },
    {
      id: 'ml-numpy-pandas',
      topic: 'Data Wrangling with NumPy & Pandas',
      category: 'Data Engineering',
      difficulty: 'Intermediate',
      prerequisites: ['ml-math-stats'],
      relatedSkills: ['numpy', 'pandas', 'datawrangling', 'dataanalysis'],
      estimatedHours: 8,
      whyRecommended: 'Multi-dimensional arrays, dataframes, data filtering, merging, missing value imputation, and aggregations.'
    },
    {
      id: 'ml-eda-viz',
      topic: 'Exploratory Data Analysis (EDA) & Visualization',
      category: 'Data Science',
      difficulty: 'Intermediate',
      prerequisites: ['ml-numpy-pandas'],
      relatedSkills: ['matplotlib', 'seaborn', 'eda', 'datavisualization'],
      estimatedHours: 6,
      whyRecommended: 'Visualizing distributions, correlations, outliers, and feature relationships with Matplotlib and Seaborn.'
    },
    {
      id: 'ml-scikit-learn',
      topic: 'Supervised Learning with Scikit-learn (Regression & Classification)',
      category: 'Classical ML',
      difficulty: 'Intermediate',
      prerequisites: ['ml-eda-viz'],
      relatedSkills: ['scikitlearn', 'sklearn', 'regression', 'classification', 'machinelearning'],
      estimatedHours: 12,
      whyRecommended: 'Implement linear regression, logistic regression, decision trees, random forests, and SVMs.'
    },
    {
      id: 'ml-unsupervised-eval',
      topic: 'Unsupervised Learning, Clustering & Model Evaluation',
      category: 'Classical ML',
      difficulty: 'Intermediate',
      prerequisites: ['ml-scikit-learn'],
      relatedSkills: ['clustering', 'kmeans', 'pca', 'crossvalidation', 'roccurve'],
      estimatedHours: 8,
      whyRecommended: 'K-Means clustering, PCA dimensionality reduction, cross-validation, precision/recall, and ROC-AUC metrics.'
    },
    {
      id: 'ml-deep-learning',
      topic: 'Deep Learning & Neural Networks with PyTorch / TensorFlow',
      category: 'Deep Learning',
      difficulty: 'Advanced',
      prerequisites: ['ml-unsupervised-eval'],
      relatedSkills: ['pytorch', 'tensorflow', 'deeplearning', 'neuralnetworks'],
      estimatedHours: 16,
      whyRecommended: 'Multi-layer perceptrons, backpropagation, activation functions, loss functions, and PyTorch tensors.'
    },
    {
      id: 'ml-nlp-cv-intro',
      topic: 'Introduction to NLP & Computer Vision',
      category: 'Applied AI',
      difficulty: 'Advanced',
      prerequisites: ['ml-deep-learning'],
      relatedSkills: ['nlp', 'computervision', 'transformers', 'huggingface'],
      estimatedHours: 12,
      whyRecommended: 'Text embeddings, convolutional neural networks (CNNs), and pretrained Transformer models.'
    },
    {
      id: 'ml-capstone',
      topic: 'End-to-End Machine Learning Capstone Project',
      category: 'Project',
      difficulty: 'Advanced',
      prerequisites: ['ml-nlp-cv-intro'],
      relatedSkills: ['machinelearning', 'project', 'capstone', 'modeldeployment'],
      estimatedHours: 20,
      whyRecommended: 'Build, train, evaluate, and deploy a complete ML model pipeline with an interactive inference API.'
    }
  ],

  // ─── 5. DATA SCIENCE ───
  'Data Science': [
    {
      id: 'ds-python-fund',
      topic: 'Python Programming for Data Science',
      category: 'Programming',
      difficulty: 'Beginner',
      prerequisites: [],
      relatedSkills: ['python', 'py', 'dataanalysis'],
      estimatedHours: 8,
      whyRecommended: 'Python core concepts, functional constructs, and data structures tailored for analytical workflows.'
    },
    {
      id: 'ds-stats-prob',
      topic: 'Descriptive & Inferential Statistics for Analytics',
      category: 'Statistics',
      difficulty: 'Beginner',
      prerequisites: ['ds-python-fund'],
      relatedSkills: ['statistics', 'probability', 'hypothesistesting', 'pvalues'],
      estimatedHours: 10,
      whyRecommended: 'Central tendency, variance, confidence intervals, hypothesis testing, A/B testing, and p-values.'
    },
    {
      id: 'ds-pandas-numpy',
      topic: 'Advanced Data Wrangling with Pandas & NumPy',
      category: 'Data Manipulation',
      difficulty: 'Intermediate',
      prerequisites: ['ds-stats-prob'],
      relatedSkills: ['pandas', 'numpy', 'datawrangling', 'datacleaning'],
      estimatedHours: 10,
      whyRecommended: 'Handling missing values, data reshaping (pivot/melt), time series analysis, and multi-indexing.'
    },
    {
      id: 'ds-sql-analytics',
      topic: 'SQL for Data Analytics & Relational Querying',
      category: 'Databases & Querying',
      difficulty: 'Intermediate',
      prerequisites: ['ds-pandas-numpy'],
      relatedSkills: ['sql', 'postgresql', 'windowfunctions', 'cte', 'database'],
      estimatedHours: 8,
      whyRecommended: 'Complex aggregate queries, Window functions (RANK, ROW_NUMBER), Common Table Expressions (CTEs), and subqueries.'
    },
    {
      id: 'ds-visualization',
      topic: 'Data Storytelling & Visualization (Matplotlib, Seaborn, Plotly)',
      category: 'Visualization',
      difficulty: 'Intermediate',
      prerequisites: ['ds-sql-analytics'],
      relatedSkills: ['datavisualization', 'matplotlib', 'seaborn', 'plotly'],
      estimatedHours: 6,
      whyRecommended: 'Creating intuitive interactive visualizations, distribution charts, heatmaps, and dashboarding.'
    },
    {
      id: 'ds-feature-engineering',
      topic: 'Feature Engineering & Data Preprocessing',
      category: 'Data Preparation',
      difficulty: 'Intermediate',
      prerequisites: ['ds-visualization'],
      relatedSkills: ['featureengineering', 'onehotencoding', 'scaling', 'scikitlearn'],
      estimatedHours: 8,
      whyRecommended: 'Categorical encoding, numerical scaling, feature extraction, outlier detection, and dimensionality reduction.'
    },
    {
      id: 'ds-predictive-modeling',
      topic: 'Applied Predictive Modeling with Scikit-learn',
      category: 'Machine Learning',
      difficulty: 'Intermediate',
      prerequisites: ['ds-feature-engineering'],
      relatedSkills: ['scikitlearn', 'regression', 'classification', 'machinelearning'],
      estimatedHours: 12,
      whyRecommended: 'Regression analysis, classification models, decision trees, random forests, and model interpretation.'
    },
    {
      id: 'ds-capstone',
      topic: 'End-to-End Data Science Case Study & Dashboard',
      category: 'Project',
      difficulty: 'Advanced',
      prerequisites: ['ds-predictive-modeling'],
      relatedSkills: ['datascience', 'project', 'capstone', 'streamlit'],
      estimatedHours: 20,
      whyRecommended: 'Perform a comprehensive exploratory and predictive analysis on a real-world dataset and present findings.'
    }
  ],

  // ─── 6. DEVOPS ───
  'DevOps': [
    {
      id: 'devops-linux-bash',
      topic: 'Linux System Administration & Shell Scripting',
      category: 'Operating Systems',
      difficulty: 'Beginner',
      prerequisites: [],
      relatedSkills: ['linux', 'bash', 'shell', 'cli', 'permissions'],
      estimatedHours: 8,
      whyRecommended: 'Linux file permissions, process management, networking commands, SSH configuration, and automated Bash scripts.'
    },
    {
      id: 'devops-git-workflows',
      topic: 'Git Workflows, Branching Strategies & Release Management',
      category: 'Version Control',
      difficulty: 'Beginner',
      prerequisites: ['devops-linux-bash'],
      relatedSkills: ['git', 'github', 'branching', 'versioncontrol'],
      estimatedHours: 6,
      whyRecommended: 'Trunk-based development, GitFlow, merge conflicts, interactive rebasing, and semantic versioning.'
    },
    {
      id: 'devops-docker',
      topic: 'Docker Containerization & Image Optimization',
      category: 'Containers',
      difficulty: 'Intermediate',
      prerequisites: ['devops-git-workflows'],
      relatedSkills: ['docker', 'containers', 'dockerfile', 'dockercompose'],
      estimatedHours: 10,
      whyRecommended: 'Building lightweight multi-stage Dockerfiles, managing container networks, volumes, and compose environments.'
    },
    {
      id: 'devops-cicd-actions',
      topic: 'CI/CD Automation with GitHub Actions',
      category: 'Automation',
      difficulty: 'Intermediate',
      prerequisites: ['devops-docker'],
      relatedSkills: ['cicd', 'githubactions', 'continuousintegration', 'automation'],
      estimatedHours: 8,
      whyRecommended: 'Automated test runners, build pipelines, artifact deployment, secret management, and CD workflows.'
    },
    {
      id: 'devops-kubernetes',
      topic: 'Kubernetes Container Orchestration & Helm',
      category: 'Orchestration',
      difficulty: 'Advanced',
      prerequisites: ['devops-cicd-actions'],
      relatedSkills: ['kubernetes', 'k8s', 'helm', 'pods', 'services', 'ingress'],
      estimatedHours: 14,
      whyRecommended: 'Pods, Deployments, Services, Ingress controllers, ConfigMaps, Secrets, and Helm chart package management.'
    },
    {
      id: 'devops-terraform-iac',
      topic: 'Infrastructure as Code (IaC) with Terraform',
      category: 'Cloud Infrastructure',
      difficulty: 'Advanced',
      prerequisites: ['devops-kubernetes'],
      relatedSkills: ['terraform', 'iac', 'cloudinfrastructure'],
      estimatedHours: 10,
      whyRecommended: 'Declarative cloud provisioning, state file management, modules, and multi-environment infrastructure.'
    },
    {
      id: 'devops-cloud-aws',
      topic: 'Cloud Computing Architecture (AWS / GCP)',
      category: 'Cloud Platforms',
      difficulty: 'Advanced',
      prerequisites: ['devops-terraform-iac'],
      relatedSkills: ['aws', 'gcp', 'azure', 'cloud', 'vpc', 'iam'],
      estimatedHours: 12,
      whyRecommended: 'VPC networking, IAM security policies, EC2/S3/RDS management, and managed serverless/container services.'
    },
    {
      id: 'devops-observability',
      topic: 'Observability & Monitoring (Prometheus & Grafana)',
      category: 'Monitoring',
      difficulty: 'Advanced',
      prerequisites: ['devops-cloud-aws'],
      relatedSkills: ['prometheus', 'grafana', 'monitoring', 'logging', 'sre'],
      estimatedHours: 8,
      whyRecommended: 'Metrics collection, dashboard creation, log aggregation, alerting thresholds, and SRE uptime practices.'
    },
    {
      id: 'devops-capstone',
      topic: 'Automated Multi-Service DevOps Capstone Pipeline',
      category: 'Project',
      difficulty: 'Advanced',
      prerequisites: ['devops-observability'],
      relatedSkills: ['devops', 'kubernetes', 'terraform', 'project', 'capstone'],
      estimatedHours: 20,
      whyRecommended: 'Provision cloud infrastructure using Terraform, deploy microservices on Kubernetes, and wire automated CI/CD.'
    }
  ],

  // ─── 7. FULL STACK DEVELOPMENT ───
  'Full Stack Development': [
    {
      id: 'fs-html-css',
      topic: 'HTML5 & Responsive CSS Layouts',
      category: 'Frontend Basics',
      difficulty: 'Beginner',
      prerequisites: [],
      relatedSkills: ['html', 'css', 'html5', 'css3'],
      estimatedHours: 6,
      whyRecommended: 'Semantic markup and responsive styling for web user interfaces.'
    },
    {
      id: 'fs-js-fund',
      topic: 'JavaScript Fundamentals & ES6+',
      category: 'Core Language',
      difficulty: 'Beginner',
      prerequisites: ['fs-html-css'],
      relatedSkills: ['javascript', 'js', 'es6'],
      estimatedHours: 8,
      whyRecommended: 'The core scripting language powering both frontend and Node.js runtimes.'
    },
    {
      id: 'fs-react-hooks',
      topic: 'React Components, Props & Hooks',
      category: 'Frontend Framework',
      difficulty: 'Intermediate',
      prerequisites: ['fs-js-fund'],
      relatedSkills: ['react', 'reactjs', 'hooks'],
      estimatedHours: 12,
      whyRecommended: 'Modern component-based UI engineering with declarative state management.'
    },
    {
      id: 'fs-node-express',
      topic: 'Node.js & Express REST APIs',
      category: 'Backend',
      difficulty: 'Intermediate',
      prerequisites: ['fs-js-fund'],
      relatedSkills: ['node', 'nodejs', 'express', 'expressjs', 'restapi'],
      estimatedHours: 10,
      whyRecommended: 'Server-side JavaScript runtime for designing performant RESTful APIs.'
    },
    {
      id: 'fs-mongodb-schema',
      topic: 'MongoDB & Relational Data Modeling',
      category: 'Database',
      difficulty: 'Intermediate',
      prerequisites: ['fs-node-express'],
      relatedSkills: ['mongodb', 'mongoose', 'database', 'sql'],
      estimatedHours: 8,
      whyRecommended: 'Schema design, indexing, relationships, and data persistence.'
    },
    {
      id: 'fs-jwt-auth',
      topic: 'Authentication & JWT Security',
      category: 'Security',
      difficulty: 'Intermediate',
      prerequisites: ['fs-node-express', 'fs-mongodb-schema'],
      relatedSkills: ['jwt', 'auth', 'authentication', 'security'],
      estimatedHours: 6,
      whyRecommended: 'Secure user login, password hashing, token validation, and protected routes.'
    },
    {
      id: 'fs-testing-jest',
      topic: 'Automated Testing with Jest & React Testing Library',
      category: 'Quality',
      difficulty: 'Intermediate',
      prerequisites: ['fs-react-hooks', 'fs-node-express'],
      relatedSkills: ['testing', 'jest', 'rtl'],
      estimatedHours: 8,
      whyRecommended: 'End-to-end reliability through automated unit and integration tests.'
    },
    {
      id: 'fs-docker-containers',
      topic: 'Docker Containerization & Compose',
      category: 'DevOps',
      difficulty: 'Intermediate',
      prerequisites: ['fs-node-express'],
      relatedSkills: ['docker', 'containers', 'dockercompose'],
      estimatedHours: 8,
      whyRecommended: 'Package multi-tier applications into portable container environments.'
    },
    {
      id: 'fs-system-design',
      topic: 'System Design & Distributed Architecture',
      category: 'Architecture',
      difficulty: 'Advanced',
      prerequisites: ['fs-docker-containers'],
      relatedSkills: ['systemdesign', 'architecture', 'scalability'],
      estimatedHours: 12,
      whyRecommended: 'Architect scalable web systems with load balancers, caches, and database replication.'
    },
    {
      id: 'fs-fullstack-capstone',
      topic: 'Full Stack Production Capstone Project',
      category: 'Project',
      difficulty: 'Advanced',
      prerequisites: ['fs-system-design'],
      relatedSkills: ['capstone', 'project', 'fullstack'],
      estimatedHours: 20,
      whyRecommended: 'Build, test, and deploy a complete production-grade full stack application.'
    }
  ]
};

/**
 * 1. Skill Gap Analysis - strictly target-specific
 */
const generateSkillGapAnalysis = (profile) => {
  const skills = profile.skills || [];
  const strongSkills = skills.filter(s => levelToNumber(s.level) >= 7).map(s => s.skillName);
  const developingSkills = skills.filter(s => {
    const lv = levelToNumber(s.level);
    return lv >= 4 && lv < 7;
  }).map(s => s.skillName);

  const learningGoal = profile.learningGoal || null;

  // Use target-specific goal skill requirements
  const goalReqs = GOAL_SKILL_MAP[learningGoal] || (learningGoal ? [
    `${learningGoal} Fundamentals`,
    `${learningGoal} Core Syntax`,
    `${learningGoal} Standard Libraries`,
    `${learningGoal} Architecture & Patterns`,
    `${learningGoal} Testing & Quality`,
    `${learningGoal} Project Application`
  ] : []);

  const userSkillNames = new Set(skills.map(s => normalizeSkill(s.skillName)));
  const missingSkills = goalReqs.filter(req => !userSkillNames.has(normalizeSkill(req)));

  return {
    learningGoal,
    strongSkills,
    developingSkills,
    missingSkills,
    totalSkills: skills.length,
    skillsNeeded: missingSkills.length
  };
};

/**
 * AI-assisted personalized roadmap generator for custom/unlisted goals
 */
const generateAIPersonalizedRoadmap = async (profile) => {
  const goal = profile.learningGoal;
  if (!genAI || !process.env.GEMINI_API_KEY) {
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const userSkillsList = (profile.skills || []).map(s => `${s.skillName} (${s.level})`).join(', ') || 'None declared';

    const prompt = `
You are an expert curriculum designer. Generate a personalized learning roadmap for a student whose TARGET LEARNING GOAL is strictly: "${goal}".

STUDENT CONTEXT:
- Learning Goal: ${goal}
- Declared Skills: ${userSkillsList}
- Difficulty Preference: ${profile.difficultyPreference || 'Intermediate'}

STRICT RULES:
1. ONLY generate learning topics that are directly relevant to "${goal}".
2. DO NOT include web technologies (HTML, CSS, React, Node.js, Express, MongoDB) unless the goal explicitly demands them.
3. Order the topics progressively from foundational to advanced prerequisites.
4. Output 7 to 10 sequential learning nodes.
5. Return ONLY a valid JSON array matching this exact schema:
[
  {
    "id": "slug-id",
    "topic": "Concise Topic Title",
    "category": "Core" | "Framework" | "Architecture" | "Testing" | "Project",
    "difficulty": "Beginner" | "Intermediate" | "Advanced",
    "prerequisites": ["prerequisite-node-id"],
    "relatedSkills": ["skill-name"],
    "estimatedHours": number,
    "whyRecommended": "Clear explanation of why this topic is essential for ${goal}."
  }
]
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length >= 4) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('AI Roadmap generation fallback:', err.message);
  }

  return null;
};

/**
 * 2. Personalized Learning Path Generator
 * Strictly derives the path from the authenticated user's target learningGoal.
 * Prunes already mastered concepts. Never defaults to Full Stack for Python/ML/DevOps.
 */
const generatePersonalizedRoadmap = (profile) => {
  const userSkillsMap = new Map();
  (profile.skills || []).forEach(s => {
    userSkillsMap.set(normalizeSkill(s.skillName), levelToNumber(s.level));
  });

  const learningGoal = profile.learningGoal;
  if (!learningGoal) {
    return [];
  }

  // 1. Check if we have a curated catalog matching the goal
  let masterNodes = GOAL_CATALOGS[learningGoal];

  // Try matching by normalized key if exact name differs
  if (!masterNodes) {
    const normGoal = normalizeSkill(learningGoal);
    for (const [catalogKey, nodes] of Object.entries(GOAL_CATALOGS)) {
      if (normalizeSkill(catalogKey) === normGoal || normGoal.includes(normalizeSkill(catalogKey))) {
        masterNodes = nodes;
        break;
      }
    }
  }

  // Fallback: If goal is custom and not in static catalogs, build goal-specific generic sequence (never full-stack!)
  if (!masterNodes) {
    masterNodes = [
      {
        id: `${normalizeSkill(learningGoal)}-fund`,
        topic: `${learningGoal} Fundamentals & Core Syntax`,
        category: 'Foundations',
        difficulty: 'Beginner',
        prerequisites: [],
        relatedSkills: [normalizeSkill(learningGoal), 'basics'],
        estimatedHours: 8,
        whyRecommended: `Master core syntax and basic mental models for ${learningGoal}.`
      },
      {
        id: `${normalizeSkill(learningGoal)}-structures`,
        topic: `${learningGoal} Data Structures & Standard Libraries`,
        category: 'Core Concepts',
        difficulty: 'Beginner',
        prerequisites: [`${normalizeSkill(learningGoal)}-fund`],
        relatedSkills: [normalizeSkill(learningGoal), 'datastructures'],
        estimatedHours: 8,
        whyRecommended: `Core building blocks and standard libraries for ${learningGoal}.`
      },
      {
        id: `${normalizeSkill(learningGoal)}-patterns`,
        topic: `${learningGoal} Design Patterns & Idioms`,
        category: 'Architecture',
        difficulty: 'Intermediate',
        prerequisites: [`${normalizeSkill(learningGoal)}-structures`],
        relatedSkills: [normalizeSkill(learningGoal), 'patterns'],
        estimatedHours: 10,
        whyRecommended: `Professional architecture and design patterns in ${learningGoal}.`
      },
      {
        id: `${normalizeSkill(learningGoal)}-testing`,
        topic: `Testing & Quality Assurance in ${learningGoal}`,
        category: 'Testing',
        difficulty: 'Intermediate',
        prerequisites: [`${normalizeSkill(learningGoal)}-patterns`],
        relatedSkills: [normalizeSkill(learningGoal), 'testing'],
        estimatedHours: 6,
        whyRecommended: `Automated testing and debugging techniques for ${learningGoal}.`
      },
      {
        id: `${normalizeSkill(learningGoal)}-advanced`,
        topic: `Advanced ${learningGoal} & Optimization`,
        category: 'Advanced',
        difficulty: 'Advanced',
        prerequisites: [`${normalizeSkill(learningGoal)}-testing`],
        relatedSkills: [normalizeSkill(learningGoal), 'optimization'],
        estimatedHours: 12,
        whyRecommended: `High-performance execution, concurrency, and internals of ${learningGoal}.`
      },
      {
        id: `${normalizeSkill(learningGoal)}-capstone`,
        topic: `${learningGoal} Production Capstone Project`,
        category: 'Project',
        difficulty: 'Advanced',
        prerequisites: [`${normalizeSkill(learningGoal)}-advanced`],
        relatedSkills: [normalizeSkill(learningGoal), 'capstone', 'project'],
        estimatedHours: 18,
        whyRecommended: `Build and showcase a complete, robust project demonstrating mastery of ${learningGoal}.`
      }
    ];
  }

  // 2. Skill Pruning: Filter out nodes where user already knows the skill at Advanced/Expert level (>= 7)
  const filteredNodes = masterNodes.filter(node => {
    const hasSkillMastered = (node.relatedSkills || []).some(skKey => {
      const userLvl = userSkillsMap.get(normalizeSkill(skKey));
      return userLvl && userLvl >= 7;
    });
    return !hasSkillMastered;
  });

  // If user mastered all foundational topics, keep the advanced and capstone nodes
  const finalNodes = filteredNodes.length >= 3 ? filteredNodes : masterNodes.slice(-4);

  // 3. Attach interactive metadata, resources, practice tasks, and quiz
  const personalizedNodes = finalNodes.map((node) => ({
    ...node,
    whyRecommended: (node.relatedSkills || []).some(sk => userSkillsMap.has(normalizeSkill(sk)))
      ? `You have prior experience with ${node.topic}. This deepens your expertise to production-level mastery for ${learningGoal}.`
      : `${node.whyRecommended} Fulfills a core requirement for your ${learningGoal} path.`,
    resources: [
      { title: `${node.topic} — Comprehensive Documentation`, url: '#', type: 'Documentation', estimatedMinutes: 45 },
      { title: `${node.topic} — Interactive Exercises`, url: '#', type: 'Interactive', estimatedMinutes: 60 }
    ],
    practiceTask: `Build an exercise or module demonstrating ${node.topic} concepts.`,
    quiz: [
      {
        id: `${node.id}-q1`,
        question: `What is the recommended best practice when applying ${node.topic}?`,
        options: [
          'Modular, decoupled implementation with proper error handling',
          'Tightly coupled code with inline side effects',
          'Global mutable state without validation',
          'Skipping edge case handling for development speed'
        ],
        correctIndex: 0,
        explanation: 'Modular design, clear abstraction boundaries, and robust error handling ensure production reliability.'
      }
    ]
  }));

  return personalizedNodes;
};

/**
 * 3. Adaptive Remediation Generator
 */
const generateAdaptiveRemediation = (topicId, topicName, weakAreas = []) => {
  return weakAreas.map((area, idx) => ({
    id: `${topicId}-remediation-${idx + 1}`,
    topic: `${area} — Focused Remediation`,
    category: 'Remediation',
    difficulty: 'Intermediate',
    prerequisites: [topicId],
    whyRecommended: `Your quiz evaluation showed ${area} needs reinforcement. This targeted practice module strengthens your understanding before you proceed.`,
    estimatedHours: 3,
    isRemediation: true,
    parentTopicId: topicId,
    resources: [
      { title: `${area} — Focused Refresher`, url: '#', type: 'Article', estimatedMinutes: 30 },
      { title: `${area} — Interactive Practice`, url: '#', type: 'Interactive', estimatedMinutes: 45 }
    ],
    practiceTask: `Complete targeted exercises on ${area}.`,
    quiz: []
  }));
};

module.exports = {
  generatePersonalizedRoadmap,
  generateSkillGapAnalysis,
  generateAdaptiveRemediation,
  generateAIPersonalizedRoadmap,
  normalizeSkill,
  levelToNumber,
  GOAL_SKILL_MAP,
  GOAL_CATALOGS
};
