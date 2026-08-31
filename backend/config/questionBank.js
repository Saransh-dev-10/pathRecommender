const questionBank = {
  javascript: [
    {
      id: 'js-q1',
      text: 'What is the return value of Array.prototype.map() in JavaScript?',
      options: [
        'A new array containing the results of calling the callback on every element',
        'The original array mutated with the new callback values',
        'A boolean indicating if any element matched the callback condition',
        'Undefined'
      ],
      correctIndex: 0,
      topic: 'Arrays',
      explanation: 'Array.map() returns a brand new array containing the results of running the mapping function on each item, without mutating the original array.'
    },
    {
      id: 'js-q2',
      text: 'Which behavior is true regarding arrow functions in ES6?',
      options: [
        'They bind their own dynamic "this" context',
        'They lexically bind the "this" value from their surrounding outer context',
        'They can be used as constructors with the "new" keyword',
        'They do not support rest parameters'
      ],
      correctIndex: 1,
      topic: 'Functions',
      explanation: 'Arrow functions do not have their own "this" binding. They inherit "this" lexically from the enclosing scope.'
    },
    {
      id: 'js-q3',
      text: 'What does Promise.all() do if any of the input promises reject?',
      options: [
        'It waits for all other promises to resolve and ignores the rejection',
        'It rejects immediately with the error of the first promise that rejects',
        'It returns an array of both resolved values and rejection errors',
        'It retries the rejected promise automatically'
      ],
      correctIndex: 1,
      topic: 'Async JavaScript',
      explanation: 'Promise.all() is fail-fast: if any promise in the array rejects, the returned promise immediately rejects with that error, discarding other operations.'
    },
    {
      id: 'js-q4',
      text: 'How does block scoping behave for variable declarations with "let" and "const"?',
      options: [
        'They are scoped to the nearest function block, ignoring curly braces',
        'They are scoped to the enclosing block (demarcated by curly braces {})',
        'They are hoisted to the top of the global scope and initialized to null',
        'They can be redeclared in the same block scope without throwing errors'
      ],
      correctIndex: 1,
      topic: 'Scope',
      explanation: 'let and const are block-scoped, meaning they only exist within the curly braces ({}) in which they are declared.'
    },
    {
      id: 'js-q5',
      text: 'What is a JavaScript closure?',
      options: [
        'A function bundled together with references to its surrounding lexical state',
        'A method that terminates database connections to prevent memory leaks',
        'The process of minifying JS code before production deployment',
        'An API endpoint that rejects unauthenticated requests'
      ],
      correctIndex: 0,
      topic: 'Closures',
      explanation: 'A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment).'
    },
    {
      id: 'js-q6',
      text: 'In the event loop, what is the correct priority of execution queues?',
      options: [
        'Macrotasks always execute before all Microtasks',
        'Microtasks (like Promise callbacks) are executed fully before the next Macrotask (like setTimeout)',
        'They execute in parallel on separate threads',
        'Animation frame callbacks are executed after Macrotasks but before Microtasks'
      ],
      correctIndex: 1,
      topic: 'Event Loop',
      explanation: 'After every macrotask is completed, the event loop fully drains the microtask queue (Promise resolve handlers, process.nextTick) before picking up the next macrotask.'
    },
    {
      id: 'js-q7',
      text: 'What happens during event capturing in the browser DOM?',
      options: [
        'The event travels from the target element up to the window object',
        'The event travels from the window down through ancestors to the target element',
        'The event is intercepted by service workers and cached',
        'The event is executed synchronously, blocking UI rendering'
      ],
      correctIndex: 1,
      topic: 'Objects',
      explanation: 'Event propagation has three phases: capturing (window down to target), target phase, and bubbling (target back up to window).'
    },
    {
      id: 'js-q8',
      text: 'What is the main difference between strict equality (===) and loose equality (==) in JavaScript?',
      options: [
        '=== compares values, while == compares data types only',
        '=== compares both value and type without coercion, while == performs type coercion if types differ',
        '=== is slower because it runs on a separate engine thread',
        '== is only used for comparing object references'
      ],
      correctIndex: 1,
      topic: 'Scope',
      explanation: 'Strict equality (===) checks both value and type equality without performing implicit conversion. Loose equality (==) coerces types before comparison.'
    },
    {
      id: 'js-q9',
      text: 'Which method should be used to parse a JSON string into a JavaScript object?',
      options: [
        'JSON.stringify()',
        'JSON.parse()',
        'Object.fromJson()',
        'parseJson()'
      ],
      correctIndex: 1,
      topic: 'Objects',
      explanation: 'JSON.parse() parses a JSON string, constructing the JavaScript value or object described by the string.'
    },
    {
      id: 'js-q10',
      text: 'What happens in JavaScript if you attempt to access a variable declared with "let" before its declaration line?',
      options: [
        'It returns undefined',
        'It throws a ReferenceError due to the Temporal Dead Zone (TDZ)',
        'It initializes as null',
        'It resolves to the global window context'
      ],
      correctIndex: 1,
      topic: 'Scope',
      explanation: 'Variables declared with let and const are hoisted but not initialized. Accessing them before declaration throws a ReferenceError due to the Temporal Dead Zone.'
    }
  ],
  react: [
    {
      id: 'react-q1',
      text: 'Which Hook should be used to memoize the computed result of an expensive calculation?',
      options: [
        'useCallback',
        'useMemo',
        'useEffect',
        'useRef'
      ],
      correctIndex: 1,
      topic: 'Hooks',
      explanation: 'useMemo caches the returned value of a function between renders. useCallback caches the function instance itself.'
    },
    {
      id: 'react-q2',
      text: 'What is the primary rule of React Hooks execution order?',
      options: [
        'Hooks must be called inside conditional statements to ensure state sync',
        'Hooks must only be called at the top level of React functions (not inside loops or conditions)',
        'Hooks must be called after return statements to avoid render blocking',
        'Hooks must be registered inside helper utilities outside components'
      ],
      correctIndex: 1,
      topic: 'Hooks',
      explanation: 'React relies on the order in which Hooks are called. Never call Hooks inside loops, conditions, or nested functions to ensure consistency.'
    },
    {
      id: 'react-q3',
      text: 'What is the purpose of the "key" prop when rendering lists of elements in React?',
      options: [
        'To style list elements using CSS selectors',
        'To help React identify which items have changed, been added, or been removed',
        'To encrypt list values for security purposes',
        'To bind click event handlers to DOM elements'
      ],
      correctIndex: 1,
      topic: 'State Management',
      explanation: 'Keys help React identify which items have changed, are added, or are removed. It gives elements a stable identity within a list for efficient diffing.'
    },
    {
      id: 'react-q4',
      text: 'How does Context API state changes trigger component re-renders?',
      options: [
        'Only components using useContext or Consumer re-render when context provider value changes',
        'All descendant components under the Provider re-render, even if they do not consume context',
        'Only the component holding the context provider state re-renders',
        'React context never triggers re-renders; it requires Redux'
      ],
      correctIndex: 0,
      topic: 'State Management',
      explanation: 'Only components that consume the context (via useContext or Consumer) will re-render when the Provider value changes, unless parent components themselves trigger standard re-renders.'
    },
    {
      id: 'react-q5',
      text: 'What is the primary benefit of React.lazy() and Suspense?',
      options: [
        'They enable server-side database clustering support',
        'They enable component code-splitting to load parts of the bundle asynchronously',
        'They compress images in the background',
        'They automatically translate component texts'
      ],
      correctIndex: 1,
      topic: 'Performance',
      explanation: 'React.lazy lets you render a dynamic import as a regular component. Suspense lets you show fallback content (like spinners) while loading the bundle.'
    },
    {
      id: 'react-q6',
      text: 'Which React hook allows creating a persistent mutable reference that doesn\'t trigger re-renders when updated?',
      options: [
        'useState',
        'useReducer',
        'useRef',
        'useMemo'
      ],
      correctIndex: 2,
      topic: 'Hooks',
      explanation: 'useRef returns a mutable ref object whose .current property can be updated without triggering a component re-render.'
    },
    {
      id: 'react-q7',
      text: 'In React, what does the dependency array in useEffect control?',
      options: [
        'The list of styling stylesheets to load',
        'The properties that force the effect hook to run again when they change',
        'The database schemas the component subscribes to',
        'The execution context of event listeners'
      ],
      correctIndex: 1,
      topic: 'Hooks',
      explanation: 'If a dependency array is provided, useEffect will only execute again if one of the dependencies in the array changes between renders.'
    },
    {
      id: 'react-q8',
      text: 'What is a React Error Boundary?',
      options: [
        'A middleware that validates forms automatically',
        'A class component that catches JavaScript errors anywhere in its child component tree and displays a fallback UI',
        'A browser setting that blocks insecure HTTP API requests',
        'A method in useEffect that triggers cleanups'
      ],
      correctIndex: 1,
      topic: 'State Management',
      explanation: 'Error Boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of crashing the app.'
    },
    {
      id: 'react-q9',
      text: 'What is the virtual DOM in React?',
      options: [
        'A virtual machine running a browser emulator',
        'A lightweight, in-memory representation of the real DOM that React diffs to optimize rendering',
        'A security extension built into Google Chrome',
        'A node package that builds HTML templates'
      ],
      correctIndex: 1,
      topic: 'Performance',
      explanation: 'The Virtual DOM is a programming concept where an ideal, or "virtual", representation of a UI is kept in memory and synced with the "real" DOM via reconciliation.'
    },
    {
      id: 'react-q10',
      text: 'What happens when state is updated in a React component?',
      options: [
        'The browser page is fully reloaded',
        'The component and its children are re-rendered based on the virtual DOM diffing',
        'The state is saved to localStorage immediately',
        'The backend database is automatically updated'
      ],
      correctIndex: 1,
      topic: 'State Management',
      explanation: 'State changes trigger React to schedule a re-render for that component and recursively for its children, updating the DOM only where changes are detected.'
    }
  ],
  nodejs: [
    {
      id: 'node-q1',
      text: 'What is Node.js?',
      options: [
        'A backend JavaScript framework built on Express',
        'An open-source, cross-platform JavaScript runtime environment built on Chrome\'s V8 engine',
        'A relational database management application',
        'A compile-to-JS programming language'
      ],
      correctIndex: 1,
      topic: 'Fundamentals',
      explanation: 'Node.js is a runtime environment that executes JavaScript code outside of a web browser, leveraging Chrome V8 engine.'
    },
    {
      id: 'node-q2',
      text: 'How does Node.js handle heavy concurrent I/O requests efficiently?',
      options: [
        'By spawning a separate operating system thread for every single connection',
        'By utilizing a single-threaded event loop and asynchronous, non-blocking APIs',
        'By blocking subsequent users until the first completes',
        'By compiling JS code into static binary scripts'
      ],
      correctIndex: 1,
      topic: 'Event Loop',
      explanation: 'Node.js uses an event loop and non-blocking I/O to handle thousands of concurrent connections efficiently on a single thread.'
    },
    {
      id: 'node-q3',
      text: 'In Express.js, what is the role of middleware?',
      options: [
        'To establish connection strings to the database',
        'Functions that have access to the request, response objects, and the next function in the cycle',
        'To compile CSS assets to client-side bundles',
        'To replicate models between database shards'
      ],
      correctIndex: 1,
      topic: 'Middleware',
      explanation: 'Express middleware functions execute code, make modifications to request/response objects, end request-response cycles, and call the next middleware.'
    },
    {
      id: 'node-q4',
      text: 'What is the signature of error-handling middleware in Express?',
      options: [
        'app.use((req, res, next) => {})',
        'app.use((err, req, res, next) => {})',
        'app.use((err, res) => {})',
        'app.use((req, res, err) => {})'
      ],
      correctIndex: 1,
      topic: 'Middleware',
      explanation: 'Express identifies error-handling middleware specifically by having exactly four arguments: (err, req, res, next).'
    },
    {
      id: 'node-q5',
      text: 'What is the purpose of "npm package-lock.json"?',
      options: [
        'To lock the folder structure so developers cannot delete core files',
        'To record the exact version of every installed package and its dependencies for reproducible builds',
        'To encrypt user passwords in the node_modules folder',
        'To restrict access to the application in production'
      ],
      correctIndex: 1,
      topic: 'Fundamentals',
      explanation: 'package-lock.json locks down the dependencies tree, ensuring all environments install the exact same versions of sub-dependencies.'
    },
    {
      id: 'node-q6',
      text: 'Which core module is used in Node.js to handle file paths across operating systems?',
      options: [
        'fs',
        'path',
        'os',
        'url'
      ],
      correctIndex: 1,
      topic: 'Fundamentals',
      explanation: 'The "path" module provides utilities for working with file and directory paths, handling differences in forward and backward slashes between OSes.'
    },
    {
      id: 'node-q7',
      text: 'What happens when "fs.readFile" is called in Node.js?',
      options: [
        'It blocks the thread until the file is fully read',
        'It initiates a non-blocking request to read the file and calls a callback function when finished',
        'It runs on a separate worker thread inside a cluster',
        'It uploads the file to MongoDB'
      ],
      correctIndex: 1,
      topic: 'Fundamentals',
      explanation: 'fs.readFile is asynchronous and non-blocking, delegating the I/O operation to the thread pool and calling the callback with the result.'
    },
    {
      id: 'node-q8',
      text: 'What is the purpose of the "cluster" module in Node.js?',
      options: [
        'To shard a database across multiple server nodes',
        'To run multiple instances of Node.js that share server ports, utilizing multi-core CPU capacity',
        'To secure API endpoints with rate limits',
        'To manage Docker containers automatically'
      ],
      correctIndex: 1,
      topic: 'Performance',
      explanation: 'Node.js is single-threaded. The cluster module allows spawning multiple child processes (workers) that share the same port to distribute CPU workload.'
    },
    {
      id: 'node-q9',
      text: 'What is the event-driven programming model in Node.js?',
      options: [
        'Objects (emitters) periodically emit events that cause listener functions to execute',
        'Components are re-rendered based on mouse click events',
        'A system where databases dispatch events to client sockets',
        'A CSS design system matching events'
      ],
      correctIndex: 0,
      topic: 'Event Loop',
      explanation: 'Node.js is built around events. Core objects like streams or servers inherit from EventEmitter, emitting named events that trigger callbacks.'
    },
    {
      id: 'node-q10',
      text: 'How do you handle uncaught exceptions in a Node.js process to prevent it from silently failing or crashing without logs?',
      options: [
        'Wrap the entire server.js in a try-catch block',
        'Listen to the "uncaughtException" event on the process object and log the error before exiting/restarting',
        'Node.js automatically handles crashes and restarts by default',
        'Use strict equality checks'
      ],
      correctIndex: 1,
      topic: 'Fundamentals',
      explanation: 'By listening to process.on("uncaughtException", handler), developers can log critical syntax/runtime errors that would otherwise terminate the process unexpectedly.'
    }
  ],
  mongodb: [
    {
      id: 'mongo-q1',
      text: 'What kind of database is MongoDB?',
      options: [
        'A relational SQL database',
        'A document-based NoSQL database that stores data in JSON-like BSON documents',
        'A graph database',
        'A key-value cache store'
      ],
      correctIndex: 1,
      topic: 'Data Modeling',
      explanation: 'MongoDB is a document database which stores data in BSON format, providing horizontal scaling and flexible schemas.'
    },
    {
      id: 'mongo-q2',
      text: 'What is the role of Mongoose in a MERN stack application?',
      options: [
        'To act as a CSS-in-JS layout framework',
        'An Object Data Modeling (ODM) library for MongoDB and Node.js that provides schema validation and query building',
        'To run local memory databases in production',
        'To handle route redirection in React'
      ],
      correctIndex: 1,
      topic: 'Mongoose',
      explanation: 'Mongoose is an ODM library that provides a straight-forward, schema-based solution to model application data with built-in validation.'
    },
    {
      id: 'mongo-q3',
      text: 'Which MongoDB command is used to retrieve documents matching a query?',
      options: [
        'db.collection.select()',
        'db.collection.find()',
        'db.collection.get()',
        'db.collection.query()'
      ],
      correctIndex: 1,
      topic: 'Queries',
      explanation: 'db.collection.find() selects documents in a collection and returns a cursor to the selected documents.'
    },
    {
      id: 'mongo-q4',
      text: 'What is a MongoDB Index and why is it used?',
      options: [
        'An indicator showing database storage capacity limits',
        'A data structure that improves the speed of data retrieval operations on a database collection',
        'A list of collections in the database catalog',
        'A security lock protecting documents'
      ],
      correctIndex: 1,
      topic: 'Performance',
      explanation: 'Without indexes, MongoDB must perform a collection scan (read every document) to select matching queries. Indexes limit the scanned document count.'
    },
    {
      id: 'mongo-q5',
      text: 'In MongoDB, what is an aggregation pipeline?',
      options: [
        'A backup recovery process',
        'A framework for data aggregation modeled on the concept of data processing pipelines (using stages like $match, $group, $sort)',
        'A protocol for syncing replicas',
        'A connection pool utility'
      ],
      correctIndex: 1,
      topic: 'Queries',
      explanation: 'Aggregation pipelines allow multi-stage data processing to transform, filter, group, and calculate summaries directly on the database engine.'
    },
    {
      id: 'mongo-q6',
      text: 'What is the default unique identifier field generated automatically for every document in MongoDB?',
      options: [
        'id',
        '_id',
        'uuid',
        'key'
      ],
      correctIndex: 1,
      topic: 'Data Modeling',
      explanation: 'Every document in a MongoDB collection requires a unique "_id" field that acts as a primary key, defaulting to an ObjectId.'
    },
    {
      id: 'mongo-q7',
      text: 'What does the Mongoose option "ref" accomplish in a Schema definition?',
      options: [
        'It marks the field as required',
        'It tells Mongoose which model to use during populate() to link documents in different collections',
        'It encrypts the field before writing',
        'It prevents duplicate keys'
      ],
      correctIndex: 1,
      topic: 'Mongoose',
      explanation: '"ref" stands for reference. It is used to declare relational links between models, which can be resolved using Mongoose `.populate()`.'
    },
    {
      id: 'mongo-q8',
      text: 'What is MongoDB sharding?',
      options: [
        'Replicating data for high availability',
        'Distributing data across multiple machines (horizontal scaling) to support very large datasets and high throughput',
        'Compacted storage of files',
        'Adding users to access controls'
      ],
      correctIndex: 1,
      topic: 'Performance',
      explanation: 'Sharding partitions collection data across multiple shard servers, distributing read/write loads horizontally.'
    },
    {
      id: 'mongo-q9',
      text: 'Which operator is used to modify specific fields of a document in MongoDB instead of replacing the entire document?',
      options: [
        '$update',
        '$set',
        '$push',
        '$mod'
      ],
      correctIndex: 1,
      topic: 'Queries',
      explanation: 'The $set operator replaces the value of a field with the specified value, leaving other fields unchanged.'
    },
    {
      id: 'mongo-q10',
      text: 'What is the main difference between embedding documents (subdocuments) vs referencing documents (normalized relation) in MongoDB?',
      options: [
        'Embedding is faster for write-intensive operations',
        'Embedding keeps related data together in a single document for fast read access, while referencing splits data to avoid document size limit (16MB)',
        'Referencing is not supported by Mongoose schemas',
        'Embedding is only supported in MongoDB Atlas clusters'
      ],
      correctIndex: 1,
      topic: 'Data Modeling',
      explanation: 'Embedding is ideal for denormalized datasets fetched together. Referencing is preferred for many-to-many structures or large objects exceeding 16MB.'
    }
  ],
  htmlcss: [
    {
      id: 'hc-q1',
      text: 'What does semantic HTML mean?',
      options: [
        'Using tags that describe the meaning of their content (like <article>, <nav>, <header>) rather than visual appearance',
        'Writing HTML with inline styles instead of stylesheet files',
        'Validating HTML tags against browser cache guidelines',
        'Compiling HTML pages using node engines'
      ],
      correctIndex: 0,
      topic: 'HTML Structure',
      explanation: 'Semantic elements clearly describe their meaning to both the browser and the developer, assisting SEO and accessibility.'
    },
    {
      id: 'hc-q2',
      text: 'How does CSS Flexbox align items horizontally along the main axis?',
      options: [
        'align-items',
        'justify-content',
        'align-content',
        'flex-direction'
      ],
      correctIndex: 1,
      topic: 'Flexbox & Grid',
      explanation: 'justify-content aligns flex items along the main axis (horizontally by default), while align-items aligns them along the cross axis.'
    },
    {
      id: 'hc-q3',
      text: 'In the CSS Box Model, what is the correct order of layers from inside to outside?',
      options: [
        'Content -> Padding -> Border -> Margin',
        'Content -> Border -> Padding -> Margin',
        'Margin -> Border -> Padding -> Content',
        'Padding -> Content -> Border -> Margin'
      ],
      correctIndex: 0,
      topic: 'Box Model',
      explanation: 'The CSS Box Model consists of the Content itself, surrounded by Padding, bordered by the Border, and spaced by the Margin.'
    },
    {
      id: 'hc-q4',
      text: 'What is the difference between "em" and "rem" CSS relative units?',
      options: [
        'em is relative to the element font size; rem is relative to the root (html) element font size',
        'rem is relative to the screen height; em is relative to the parent div width',
        'em is only used for margins; rem is only used for text sizes',
        'They are identical and can be swapped interchangeably'
      ],
      correctIndex: 0,
      topic: 'Layout Basics',
      explanation: 'em units resolve relative to the font-size of the element itself (or its parent). rem resolves relative to the root HTML font size.'
    },
    {
      id: 'hc-q5',
      text: 'How does the "position: absolute" rule align elements?',
      options: [
        'Relative to the browser viewport',
        'Relative to the nearest positioned ancestor (an ancestor with position other than static)',
        'Always relative to the screen body wrapper',
        'It floats the element to the bottom of the container'
      ],
      correctIndex: 1,
      topic: 'Layout Basics',
      explanation: 'An absolutely positioned element is positioned relative to the nearest ancestor that has a position set (relative, absolute, fixed).'
    },
    {
      id: 'hc-q6',
      text: 'What does the "box-sizing: border-box" rule accomplish?',
      options: [
        'It draws a shadow border around the margin',
        'It includes padding and borders in the element\'s total specified width and height',
        'It forces elements to display in inline blocks',
        'It prevents margin collapse between blocks'
      ],
      correctIndex: 1,
      topic: 'Box Model',
      explanation: 'With border-box, padding and border are part of the width/height (e.g. 100px wide + 10px padding remains 100px wide, content contracts).'
    },
    {
      id: 'hc-q7',
      text: 'What is a media query in CSS?',
      options: [
        'A rule that queries database tables for image assets',
        'A technique to apply different styles depending on device characteristics (like viewport width or orientation)',
        'An API call loading audio/video streams',
        'A selector targeting class elements'
      ],
      correctIndex: 1,
      topic: 'Layout Basics',
      explanation: 'Media queries are essential for Responsive Web Design, allowing style sheets to adapt to mobile, tablet, and desktop viewports.'
    },
    {
      id: 'hc-q8',
      text: 'In CSS selectors, which of the following has the highest specificity?',
      options: [
        'A class selector (.item)',
        'An ID selector (#submit)',
        'An element selector (div)',
        'A universal selector (*)'
      ],
      correctIndex: 1,
      topic: 'HTML Structure',
      explanation: 'ID selectors have higher specificity (100) compared to class/attributes (10) and tag elements (1).'
    },
    {
      id: 'hc-q9',
      text: 'What does CSS Grid allow that Flexbox does not?',
      options: [
        'Responsive layout scaling',
        'True two-dimensional layouts, defining columns and rows simultaneously',
        'Centering elements on a page',
        'Dynamic state updates'
      ],
      correctIndex: 1,
      topic: 'Flexbox & Grid',
      explanation: 'Flexbox is primarily one-dimensional (row or column). CSS Grid is a two-dimensional grid system, managing both rows and columns.'
    },
    {
      id: 'hc-q10',
      text: 'What does the "z-index" property control in CSS positioning?',
      options: [
        'The horizontal scaling of an element',
        'The stack order of elements along the Z-axis (which element overlaps the other)',
        'The zoom level of responsive screens',
        'The grid row span value'
      ],
      correctIndex: 1,
      topic: 'Layout Basics',
      explanation: 'z-index sets the stack order of positioned elements. Elements with a larger z-index cover elements with a smaller one.'
    }
  ]
};

// Maps normalized skill queries to their bank category
const skillAliasMap = {
  javascript: 'javascript',
  js: 'javascript',
  es6: 'javascript',
  react: 'react',
  reactjs: 'react',
  hooks: 'react',
  nodejs: 'nodejs',
  node: 'nodejs',
  express: 'nodejs',
  expressjs: 'nodejs',
  mongodb: 'mongodb',
  mongo: 'mongodb',
  mongoose: 'mongodb',
  html: 'htmlcss',
  css: 'htmlcss',
  htmlcss: 'htmlcss',
  html5: 'htmlcss',
  'html/css': 'htmlcss',
  htmlcssbasics: 'htmlcss'
};

module.exports = { questionBank, skillAliasMap };
