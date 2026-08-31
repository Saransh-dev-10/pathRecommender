/**
 * Module Details & Learning Guide Service for PathRecommender
 * Generates rich, actionable, topic-specific learning guides for each roadmap node.
 * Includes detailed checklists, structured section breakdowns, learning objectives,
 * study order, tailored resources, and progressive practice tasks.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (err) {
    console.warn('[ModuleDetailsService] Failed to initialize Gemini API:', err.message);
  }
}

const normalizeKey = (str) => (str || '').toLowerCase().trim().replace(/[.\s\-_]/g, '');

/**
 * Curated Module Knowledge Base
 */
const MODULE_CATALOG = {
  // ─── JAVA MODULES ───
  'javafundamentals': {
    overview: 'Build a rock-solid foundation in Java core syntax, compilation lifecycle (JDK/JVM), strong typing, control flow structures, method declarations, arrays, strings, and introductory class design.',
    whatYouWillLearn: [
      'JVM runtime architecture, bytecode execution, and JDK setup',
      'Primitive types, memory allocation on stack vs heap, and variable scoping',
      'Conditional branching (if/else, switch-case) and iterative loops (for, while, do-while)',
      'Method signatures, return types, parameter passing by value, and method overloading',
      'Array memory layout, String immutability, and basic object encapsulation'
    ],
    topicsToCover: [
      {
        sectionNumber: '01',
        title: 'Java Architecture & Environment',
        description: 'Understand how the JDK, JRE, and JVM interact to compile and execute platform-independent bytecode.',
        subtopics: ['JDK vs JRE vs JVM internals', 'Structure of public static void main(String[] args)', 'Compiling with javac and executing with java', 'Package declarations and import conventions']
      },
      {
        sectionNumber: '02',
        title: 'Variables, Types & Operators',
        description: 'Master primitive data types, explicit/implicit type casting, and operator precedence.',
        subtopics: ['8 Primitive types (byte, short, int, long, float, double, char, boolean)', 'Reference types vs primitive memory layout', 'Arithmetic, logical, bitwise, and ternary operators', 'Type promotion and overflow handling']
      },
      {
        sectionNumber: '03',
        title: 'Control Flow & Logic',
        description: 'Construct decision-making pipelines and repetitive iteration loops cleanly.',
        subtopics: ['if, else-if, else branching', 'Switch expressions (including modern pattern matching)', 'for, enhanced for-each, and while loops', 'break, continue, and labeled jump statements']
      },
      {
        sectionNumber: '04',
        title: 'Methods, Arrays & Strings',
        description: 'Modularize code into reusable functions, manage linear arrays, and handle string manipulation.',
        subtopics: ['Method definitions, return types, and varargs', 'Method overloading and signature resolution', 'One-dimensional and multidimensional arrays', 'String pool, immutability, and StringBuilder vs StringBuffer']
      }
    ],
    learningObjectives: [
      'Write, compile, and execute standalone Java console applications from scratch',
      'Explain Java primitive vs reference type memory allocation on stack and heap',
      'Implement multi-branch decision logic and complex nested loop algorithms',
      'Modularize code into clean, overloaded methods with appropriate return types',
      'Manipulate arrays and perform efficient string transformations avoiding memory leaks'
    ],
    recommendedStudyOrder: [
      '1. Java Platform & Program Structure',
      '2. Variables, Primitives & Operators',
      '3. Conditional Statements & Loops',
      '4. Methods & Overloading',
      '5. Array Structures & Strings',
      '6. Hands-on Practice Coding Tasks',
      '7. Module Mastery Assessment'
    ],
    resources: [
      { title: 'Oracle Java Core Language Specification', url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/index.html', type: 'Documentation', estimatedMinutes: 45 },
      { title: 'Java Syntax & Basics Interactive Tutorial', url: 'https://dev.java/learn/', type: 'Interactive', estimatedMinutes: 60 },
      { title: 'Java Memory Model (Stack vs Heap) Deep Dive', url: 'https://www.baeldung.com/java-stack-heap', type: 'Article', estimatedMinutes: 30 },
      { title: 'Java Core Fundamentals Cheatsheet & Best Practices', url: '#', type: 'Notes', estimatedMinutes: 20 }
    ],
    practiceTasks: [
      { id: 'task-1', title: 'Prime Number Validator', description: 'Write a method `boolean isPrime(int n)` that efficiently verifies prime numbers with O(sqrt(n)) time complexity.', difficulty: 'Easy' },
      { id: 'task-2', title: 'String Reversal & Palindrome Checker', description: 'Implement an in-place algorithm that checks if a string is a palindrome ignoring spaces and casing without external libraries.', difficulty: 'Easy' },
      { id: 'task-3', title: 'Array Rotation Algorithm', description: 'Write a program that rotates an array of size N by K steps to the right using O(1) extra space.', difficulty: 'Medium' },
      { id: 'task-4', title: 'Interactive CLI Banking System', description: 'Construct a command-line interface managing bank accounts with deposit, withdraw, and transaction history using methods and arrays.', difficulty: 'Hard' }
    ]
  },

  // ─── JAVA DATA STRUCTURES & COLLECTIONS ───
  'javadatastructures': {
    overview: 'Master the Java Collections Framework (JCF), understanding time complexities, internal hash table mechanics, tree structures, thread safety considerations, and generics.',
    whatYouWillLearn: [
      'Core hierarchy of List, Set, Queue, Deque, and Map interfaces',
      'Internal mechanics of ArrayList, LinkedList, and dynamic array resizing',
      'HashMap and HashSet hashing contracts (equals() and hashCode())',
      'TreeSet, TreeMap, and Red-Black tree sorting mechanisms',
      'Comparable and Comparator interfaces for custom object ordering'
    ],
    topicsToCover: [
      {
        sectionNumber: '01',
        title: 'The Collections Framework Hierarchy',
        description: 'Understand the architecture of Iterable, Collection, and Map roots.',
        subtopics: ['Collection interface vs Map interface', 'List vs Set vs Queue semantic guarantees', 'Generic type parameterization `<T>` and wildcards `<? extends E>`', 'Unmodifiable and immutable collection wrappers']
      },
      {
        sectionNumber: '02',
        title: 'Lists & Linear Structures',
        description: 'Analyze memory layouts, access patterns, and Big-O trade-offs of sequential collections.',
        subtopics: ['ArrayList dynamic resizing and amortized O(1) appends', 'LinkedList doubly-linked pointers and traversal costs', 'ArrayDeque as high-performance Stack and Queue', 'PriorityQueue and Binary Heap min/max scheduling']
      },
      {
        sectionNumber: '03',
        title: 'Hash-Based & Tree-Based Sets and Maps',
        description: 'Examine hash bucketing, collision resolution, and ordered tree traversals.',
        subtopics: ['HashMap internal table, hash spreading, and bucket treeification', 'equals() and hashCode() consistency rules', 'LinkedHashMap access-order for LRU caching', 'TreeMap and TreeSet with Comparable/Comparator']
      }
    ],
    learningObjectives: [
      'Select the optimal collection implementation based on time/space performance characteristics',
      'Correctly implement equals() and hashCode() to prevent silent hash collisions and leaks',
      'Sort collections using functional Comparators and lambda sorting pipelines',
      'Implement custom generic algorithms with bounded type parameters'
    ],
    recommendedStudyOrder: [
      '1. Java Collections Hierarchy Overview',
      '2. Lists: ArrayList vs LinkedList vs ArrayDeque',
      '3. Hash Tables: HashMap & HashSet Internals',
      '4. Trees: TreeMap & TreeSet Sorting',
      '5. Custom Sorting with Comparable & Comparator',
      '6. Hands-on Practice Coding Tasks',
      '7. Module Mastery Assessment'
    ],
    resources: [
      { title: 'Java Collections Framework Official Guide', url: 'https://docs.oracle.com/javase/8/docs/technotes/guides/collections/overview.html', type: 'Documentation', estimatedMinutes: 50 },
      { title: 'HashMap Internal Working in Java Deep Dive', url: 'https://www.baeldung.com/java-hashmap-advanced', type: 'Article', estimatedMinutes: 40 },
      { title: 'Big-O Cheat Sheet for Java Collections', url: '#', type: 'Notes', estimatedMinutes: 20 }
    ],
    practiceTasks: [
      { id: 'task-1', title: 'Frequency Map Counter', description: 'Write a method returning word occurrence counts from a text block using HashMap and computeIfAbsent.', difficulty: 'Easy' },
      { id: 'task-2', title: 'LRU Cache Implementation', description: 'Implement a Least Recently Used (LRU) Cache with capacity N using LinkedHashMap in O(1) time.', difficulty: 'Medium' },
      { id: 'task-3', title: 'Custom Object Sorter', description: 'Create an Employee class and sort a List<Employee> by Department ascending and Salary descending using Comparator.comparing().', difficulty: 'Medium' },
      { id: 'task-4', title: 'Top K Frequent Elements', description: 'Find the top K most frequent elements in a stream using a Min-Heap PriorityQueue in O(N log K) time.', difficulty: 'Hard' }
    ]
  },

  // ─── SPRING BOOT & REST APIS ───
  'springboot': {
    overview: 'Learn production Spring Boot engineering: Inversion of Control (IoC), Dependency Injection, Spring MVC REST APIs, Spring Data JPA persistence, and layered architecture.',
    whatYouWillLearn: [
      'Spring IoC container, ApplicationContext, and Bean lifecycle management',
      'Designing RESTful HTTP APIs with @RestController, @GetMapping, @PostMapping, and DTOs',
      'Spring Data JPA entity mappings, repositories, and transactional database integrity',
      'Centralized validation with @Valid and global exception handling via @ControllerAdvice',
      'Production configuration profiles and Spring Boot Actuator observability'
    ],
    topicsToCover: [
      {
        sectionNumber: '01',
        title: 'Core Spring Framework & Dependency Injection',
        description: 'Master Inversion of Control and constructor injection design patterns.',
        subtopics: ['ApplicationContext and Bean factories', '@Component, @Service, @Repository, and @Configuration stereotypes', 'Constructor injection vs field injection best practices', 'Bean scopes (Singleton, Prototype, Request)']
      },
      {
        sectionNumber: '02',
        title: 'RESTful API Engineering with Spring MVC',
        description: 'Construct resilient HTTP endpoints handling request mapping and serialization.',
        subtopics: ['@RestController and HTTP method mappings (@GetMapping, @PostMapping, etc.)', '@PathVariable, @RequestParam, and @RequestBody parsing', 'DTO pattern and response entity formatting with ResponseEntity', 'Input validation using Jakarta validation annotations (@NotNull, @Size)']
      },
      {
        sectionNumber: '03',
        title: 'Spring Data JPA & Persistence',
        description: 'Connect to relational databases, model entities, and run optimized queries.',
        subtopics: ['@Entity, @Table, @Id, and @GeneratedValue annotations', 'JpaRepository CRUD operations and derived query methods', '@Transactional boundary management and dirty checking', 'Solving N+1 query problems with JOIN FETCH and @EntityGraph']
      },
      {
        sectionNumber: '04',
        title: 'Error Handling & Configuration',
        description: 'Standardize error reporting and manage multi-environment properties.',
        subtopics: ['@ControllerAdvice and @ExceptionHandler for global error responses', 'Profile-specific properties (application-dev.yml, application-prod.yml)', 'Spring Boot Actuator health and metrics endpoints']
      }
    ],
    learningObjectives: [
      'Architect full layered Spring Boot microservices (Controller -> Service -> Repository)',
      'Design RESTful HTTP endpoints following HTTP status code conventions and DTO patterns',
      'Model relational database tables with Spring Data JPA and Hibernate ORM',
      'Implement robust global error handling and request validation'
    ],
    recommendedStudyOrder: [
      '1. Spring IoC & Dependency Injection Fundamentals',
      '2. Building RESTful Controllers & Request Mapping',
      '3. Database Persistence with Spring Data JPA',
      '4. Global Exception Handling & Validation',
      '5. Actuator & Production Configuration',
      '6. Hands-on Practice Coding Tasks',
      '7. Module Mastery Assessment'
    ],
    resources: [
      { title: 'Official Spring Boot Reference Documentation', url: 'https://docs.spring.io/spring-boot/docs/current/reference/html/', type: 'Documentation', estimatedMinutes: 60 },
      { title: 'Building a RESTful Web Service Guide', url: 'https://spring.io/guides/gs/rest-service/', type: 'Interactive', estimatedMinutes: 45 },
      { title: 'Spring Data JPA Best Practices & Optimizations', url: 'https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa', type: 'Article', estimatedMinutes: 40 }
    ],
    practiceTasks: [
      { id: 'task-1', title: 'Product Catalog REST Controller', description: 'Create a Spring Boot REST controller with full CRUD endpoints for a Product entity returning proper HTTP status codes.', difficulty: 'Easy' },
      { id: 'task-2', title: 'Input Validation & Custom Error Response', description: 'Add @Valid constraints to a UserRegistrationDTO and return structured error JSON using @ControllerAdvice.', difficulty: 'Medium' },
      { id: 'task-3', title: 'Custom JPA Repository Queries', description: 'Implement derived and @Query JPQL methods with pagination and sorting on an Order repository.', difficulty: 'Medium' },
      { id: 'task-4', title: 'Complete Layered Microservice API', description: 'Build an end-to-end service with H2/PostgreSQL database, DTO mapping, transactional service logic, and unit tests.', difficulty: 'Hard' }
    ]
  },

  // ─── AUTHENTICATION & SECURITY ───
  'authentication': {
    overview: 'Master modern identity management, token-based authentication (JWT), password cryptography (bcrypt/Argon2), OAuth2 flows, and web security defenses (CORS, CSRF, XSS).',
    whatYouWillLearn: [
      'Stateful session vs stateless JWT token authentication models',
      'Secure password hashing with salted one-way algorithms (bcrypt)',
      'JWT signing, claims validation, and access vs refresh token lifecycles',
      'Role-Based Access Control (RBAC) and route protection middleware',
      'Mitigating common vulnerabilities (XSS token theft, CSRF, CORS misconfigurations)'
    ],
    topicsToCover: [
      {
        sectionNumber: '01',
        title: 'Authentication Fundamentals & Cryptography',
        description: 'Understand identity verification, password hashing, and salting principles.',
        subtopics: ['Authentication (AuthN) vs Authorization (AuthZ)', 'Why MD5/SHA256 fail for passwords and how bcrypt/Argon2 protect hashes', 'Salting mechanisms and tunable work factors', 'Session IDs vs stateless bearer tokens']
      },
      {
        sectionNumber: '02',
        title: 'JSON Web Tokens (JWT) Architecture',
        description: 'Deep dive into JWT structure, cryptographic signatures, and token rotation.',
        subtopics: ['Header, Payload, and Signature components', 'Signing algorithms: HS256 (symmetric) vs RS256 (asymmetric)', 'Standard claims: sub, exp, iat, iss, aud', 'Short-lived access tokens + long-lived httpOnly refresh token rotation']
      },
      {
        sectionNumber: '03',
        title: 'Web Application Security & Defenses',
        description: 'Harden web APIs against Cross-Site Scripting, CSRF, and origin hijacking.',
        subtopics: ['httpOnly and SameSite cookie security attributes', 'Preventing XSS token exfiltration from localStorage', 'CSRF synchronizer tokens and Origin header validation', 'Configuring strict Cross-Origin Resource Sharing (CORS) policies']
      }
    ],
    learningObjectives: [
      'Implement secure user registration with salted password hashing (bcrypt)',
      'Mint, sign, and verify JSON Web Tokens in API authentication pipelines',
      'Implement access token renewal using secure httpOnly refresh tokens',
      'Protect API endpoints with Role-Based Access Control (RBAC) middleware'
    ],
    recommendedStudyOrder: [
      '1. Authentication Principles & Password Hashing',
      '2. JWT Structure & Cryptographic Signing',
      '3. Implementing Access & Refresh Token Rotation',
      '4. Securing APIs with RBAC Authorization Middleware',
      '5. Web Security Hardening (CORS, CSRF, httpOnly)',
      '6. Hands-on Practice Coding Tasks',
      '7. Module Mastery Assessment'
    ],
    resources: [
      { title: 'RFC 7519: JSON Web Token Standard Specification', url: 'https://datatracker.ietf.org/doc/html/rfc7519', type: 'Documentation', estimatedMinutes: 45 },
      { title: 'OWASP Authentication Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html', type: 'Article', estimatedMinutes: 40 },
      { title: 'JWT Security Best Practices Guide', url: 'https://jwt.io/introduction', type: 'Interactive', estimatedMinutes: 30 }
    ],
    practiceTasks: [
      { id: 'task-1', title: 'Password Hashing Utility', description: 'Write an asynchronous registration function that hashes passwords using bcrypt with a salt work factor of 12.', difficulty: 'Easy' },
      { id: 'task-2', title: 'JWT Sign & Verify Middleware', description: 'Create an Express or Spring security middleware that extracts Bearer tokens, verifies signatures, and attaches the user payload to the request.', difficulty: 'Medium' },
      { id: 'task-3', title: 'Refresh Token Rotation Pipeline', description: 'Implement an endpoint exchanging a valid refresh cookie for a new access token while invalidating reused refresh tokens.', difficulty: 'Hard' },
      { id: 'task-4', title: 'Role-Based Endpoint Protection', description: 'Build an authorization decorator/middleware allowing access only to users possessing the required roles (e.g. ADMIN).', difficulty: 'Medium' }
    ]
  }
};

/**
 * Generate rich, structured module details dynamically for any given module.
 * If not in the pre-curated catalog, uses intelligent synthesis with Gemini AI.
 */
const generateModuleDetails = async ({
  targetGoal = 'Software Development',
  moduleName,
  moduleCategory = 'Core',
  moduleDifficulty = 'Intermediate',
  whyRecommended = '',
  estimatedHours = 6,
  userCurrentLevel = 'Beginner',
  userSkills = []
}) => {
  const norm = normalizeKey(moduleName);

  // 1. Check curated catalog
  for (const [key, catalogEntry] of Object.entries(MODULE_CATALOG)) {
    if (norm.includes(key) || key.includes(norm)) {
      return formatCatalogResponse(catalogEntry, {
        targetGoal,
        moduleName,
        moduleCategory,
        moduleDifficulty,
        whyRecommended,
        estimatedHours,
        userCurrentLevel
      });
    }
  }

  // 2. Dynamic Synthesis via Gemini AI
  if (genAI && process.env.GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
You are an expert curriculum architect. Generate a highly detailed, actionable learning guide specifically for this learning path module:

CONTEXT:
- Target Learning Goal: ${targetGoal}
- Module Name: ${moduleName}
- Category: ${moduleCategory}
- Target Difficulty: ${moduleDifficulty}
- User's Current Proficiency: ${userCurrentLevel}

STRICT INSTRUCTIONS:
1. Provide content strictly tailored to "${moduleName}". DO NOT include generic or unrelated topics.
2. Structure the response into comprehensive sections.
3. Return ONLY a valid JSON object matching this schema:
{
  "overview": "Clear 2-3 sentence overview of what this module specifically teaches.",
  "whatYouWillLearn": [
    "Specific core skill 1",
    "Specific core skill 2",
    "Specific core skill 3",
    "Specific core skill 4",
    "Specific core skill 5"
  ],
  "topicsToCover": [
    {
      "sectionNumber": "01",
      "title": "Section Title",
      "description": "What this section focuses on.",
      "subtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3"]
    },
    {
      "sectionNumber": "02",
      "title": "Section Title",
      "description": "What this section focuses on.",
      "subtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3"]
    },
    {
      "sectionNumber": "03",
      "title": "Section Title",
      "description": "What this section focuses on.",
      "subtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3"]
    }
  ],
  "learningObjectives": [
    "Concrete ability 1 (e.g. Build and configure...)",
    "Concrete ability 2",
    "Concrete ability 3",
    "Concrete ability 4"
  ],
  "recommendedStudyOrder": [
    "1. Topic One",
    "2. Topic Two",
    "3. Topic Three",
    "4. Practice Coding Tasks",
    "5. Knowledge Check Assessment"
  ],
  "resources": [
    { "title": "Resource Title", "url": "https://developer.mozilla.org", "type": "Documentation", "estimatedMinutes": 45 },
    { "title": "Interactive Tutorial", "url": "#", "type": "Interactive", "estimatedMinutes": 60 },
    { "title": "Best Practices Guide", "url": "#", "type": "Article", "estimatedMinutes": 30 }
  ],
  "practiceTasks": [
    { "id": "task-1", "title": "Task 1 Title", "description": "Specific hands-on coding task description.", "difficulty": "Easy" },
    { "id": "task-2", "title": "Task 2 Title", "description": "Specific hands-on coding task description.", "difficulty": "Medium" },
    { "id": "task-3", "title": "Task 3 Title", "description": "Specific hands-on coding task description.", "difficulty": "Medium" },
    { "id": "task-4", "title": "Task 4 Title", "description": "Specific hands-on coding task description.", "difficulty": "Hard" }
  ]
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return formatCatalogResponse(parsed, {
          targetGoal,
          moduleName,
          moduleCategory,
          moduleDifficulty,
          whyRecommended,
          estimatedHours,
          userCurrentLevel
        });
      }
    } catch (err) {
      console.warn(`[ModuleDetailsService] AI generation fallback for "${moduleName}":`, err.message);
    }
  }

  // 3. Robust Algorithmic Fallback for Custom Modules
  return generateAlgorithmicDetails({
    targetGoal,
    moduleName,
    moduleCategory,
    moduleDifficulty,
    whyRecommended,
    estimatedHours,
    userCurrentLevel
  });
};

/**
 * Format and inject personalized calibration data
 */
function formatCatalogResponse(entry, {
  targetGoal,
  moduleName,
  moduleCategory,
  moduleDifficulty,
  whyRecommended,
  estimatedHours,
  userCurrentLevel
}) {
  const levelScores = { 'Beginner': 30, 'Intermediate': 65, 'Advanced': 85, 'Expert': 95 };
  const currentScore = levelScores[userCurrentLevel] || 30;
  const targetScore = levelScores[moduleDifficulty] || 65;
  const skillGapPercentage = Math.max(0, targetScore - currentScore);

  const personalizedWhy = whyRecommended || 
    `Your current ${moduleName} proficiency is estimated at ${userCurrentLevel} (${currentScore}%), while your target path toward ${targetGoal} requires a ${moduleDifficulty} (${targetScore}%) standard. This module closes that ${skillGapPercentage}% gap.`;

  return {
    title: moduleName,
    category: moduleCategory,
    difficulty: moduleDifficulty,
    estimatedHours: estimatedHours || 6,
    overview: entry.overview || `Master key architectural patterns and implementation standards for ${moduleName}.`,
    whyInPath: personalizedWhy,
    currentLevel: userCurrentLevel,
    targetLevel: moduleDifficulty,
    currentScore,
    targetScore,
    skillGapPercentage,
    whatYouWillLearn: entry.whatYouWillLearn || [],
    topicsToCover: entry.topicsToCover || [],
    learningObjectives: entry.learningObjectives || [],
    recommendedStudyOrder: entry.recommendedStudyOrder || [],
    resources: entry.resources || [],
    practiceTasks: entry.practiceTasks || []
  };
}

/**
 * Algorithmic fallback builder
 */
function generateAlgorithmicDetails({
  targetGoal,
  moduleName,
  moduleCategory,
  moduleDifficulty,
  whyRecommended,
  estimatedHours,
  userCurrentLevel
}) {
  const levelScores = { 'Beginner': 30, 'Intermediate': 65, 'Advanced': 85, 'Expert': 95 };
  const currentScore = levelScores[userCurrentLevel] || 30;
  const targetScore = levelScores[moduleDifficulty] || 65;
  const skillGapPercentage = Math.max(0, targetScore - currentScore);

  return {
    title: moduleName,
    category: moduleCategory,
    difficulty: moduleDifficulty,
    estimatedHours: estimatedHours || 6,
    overview: `Develop end-to-end conceptual and practical mastery of ${moduleName}, covering essential design patterns, robust syntax conventions, performance optimization, and testing standards.`,
    whyInPath: whyRecommended || `Your current proficiency is evaluated at ${userCurrentLevel} (${currentScore}%), and this module elevates your competence to the required ${moduleDifficulty} (${targetScore}%) standard for your ${targetGoal} goal.`,
    currentLevel: userCurrentLevel,
    targetLevel: moduleDifficulty,
    currentScore,
    targetScore,
    skillGapPercentage,
    whatYouWillLearn: [
      `Core structural principles and design idioms of ${moduleName}`,
      `State management, data flow, and error boundary handling in ${moduleName}`,
      `Writing clean, maintainable, and type-safe code adhering to industry standards`,
      `Debugging execution bottlenecks and profiling memory usage`,
      `Automated testing, mocking dependencies, and verification suites`
    ],
    topicsToCover: [
      {
        sectionNumber: '01',
        title: `${moduleName} Foundations & Mental Models`,
        description: `Understand the core abstractions, syntax, and execution runtime of ${moduleName}.`,
        subtopics: [`Architecture & environment setup`, `Core syntax, types, and scoping rules`, `Standard library tools and utilities`]
      },
      {
        sectionNumber: '02',
        title: `Design Patterns & Practical Architecture`,
        description: `Apply structured patterns to construct scalable, decoupled implementations in ${moduleName}.`,
        subtopics: [`Separation of concerns and modularity`, `Handling asynchronous workflows and data streams`, `Error recovery, boundary management, and logging`]
      },
      {
        sectionNumber: '03',
        title: `Performance, Security & Testing`,
        description: `Ensure production readiness through profiling, security hardening, and test suites.`,
        subtopics: [`Optimizing resource consumption and avoiding memory leaks`, `Security best practices and input validation`, `Automated unit and integration testing`]
      }
    ],
    learningObjectives: [
      `Design and implement production-ready solutions using ${moduleName}`,
      `Diagnose and resolve performance and runtime exceptions effectively`,
      `Structure modular, decoupled components following clean code standards`,
      `Validate implementation integrity using automated unit tests`
    ],
    recommendedStudyOrder: [
      `1. Core Concepts & Foundations in ${moduleName}`,
      `2. Architectural Design Patterns & Practical Pipelines`,
      `3. Performance Optimization & Error Handling`,
      `4. Automated Testing & Verification`,
      `5. Hands-on Practice Coding Tasks`,
      `6. Knowledge Check Assessment (15+ Questions)`
    ],
    resources: [
      { title: `${moduleName} Official Documentation & Reference`, url: '#', type: 'Documentation', estimatedMinutes: 45 },
      { title: `${moduleName} Interactive Deep Dive Tutorial`, url: '#', type: 'Interactive', estimatedMinutes: 60 },
      { title: `${moduleName} Architecture & Best Practices Guide`, url: '#', type: 'Article', estimatedMinutes: 30 }
    ],
    practiceTasks: [
      { id: 'task-1', title: `${moduleName} Basic Implementation`, description: `Construct a minimal, modular module demonstrating foundational ${moduleName} principles.`, difficulty: 'Easy' },
      { id: 'task-2', title: `Data Pipeline & Error Handling in ${moduleName}`, description: `Implement input validation and explicit error handling pipelines.`, difficulty: 'Medium' },
      { id: 'task-3', title: `Performance Optimization Exercise`, description: `Refactor an existing implementation to optimize memory footprint and execution speed.`, difficulty: 'Medium' },
      { id: 'task-4', title: `${moduleName} Production Feature Capstone`, description: `Build an end-to-end, tested feature demonstrating advanced capabilities of ${moduleName}.`, difficulty: 'Hard' }
    ]
  };
}

module.exports = {
  generateModuleDetails,
  MODULE_CATALOG
};
