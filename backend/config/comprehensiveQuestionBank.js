/**
 * Comprehensive Question Bank for PathRecommender Assessments
 * Contains 30-50+ deep, concept-rich questions per major skill and module.
 * Designed for non-repetitive multiple attempts with difficulty distribution.
 */

const comprehensiveQuestionBank = {
  // ─────────────────────────────────────────────────────────
  // 1. JAVA & JAVA MODULES (50+ questions)
  // ─────────────────────────────────────────────────────────
  java: [
    {
      id: 'java-001',
      text: 'What is the primary difference between the JDK, JRE, and JVM in Java?',
      options: [
        'JDK is the development kit including compiler; JRE provides runtime libraries; JVM executes compiled bytecode',
        'JVM compiles source code to machine code; JDK runs bytecode on hardware; JRE is only for web browsers',
        'JDK, JRE, and JVM are interchangeable terms for the Java executable runtime',
        'JDK is for frontend Java; JRE is for backend microservices; JVM is for Android only'
      ],
      correctIndex: 0,
      topic: 'Java Architecture',
      difficulty: 'beginner',
      explanation: 'The JDK contains development tools including javac compiler. JRE provides the standard class libraries. The JVM executes the bytecode on the target platform.'
    },
    {
      id: 'java-002',
      text: 'Which statement accurately describes primitive types versus reference types in Java?',
      options: [
        'Primitives are stored directly on the stack containing their value; reference types store memory addresses pointing to heap objects',
        'Primitives are allocated on the garbage-collected heap; reference types are stored on the CPU registers',
        'All primitives in Java inherit directly from java.lang.Object',
        'Primitives can hold null values when initialized inside method local scope'
      ],
      correctIndex: 0,
      topic: 'Data Types & Memory',
      difficulty: 'beginner',
      explanation: 'Primitive types (int, double, boolean, etc.) hold raw binary values directly on the stack. Reference types hold addresses pointing to objects on the heap.'
    },
    {
      id: 'java-003',
      text: 'How does method overloading differ from method overriding in Java?',
      options: [
        'Overloading occurs within the same class with different parameter signatures; overriding happens in a subclass redefining an inherited method with the same signature',
        'Overloading is dynamic polymorphism resolved at runtime; overriding is static polymorphism resolved at compile-time',
        'Overloaded methods must have identical return types; overridden methods must have completely different names',
        'Private methods can be overridden in subclasses, but public methods can only be overloaded'
      ],
      correctIndex: 0,
      topic: 'OOP Concepts',
      difficulty: 'beginner',
      explanation: 'Method overloading has identical names with different signatures in the same class (compile-time). Overriding alters superclass method implementation in a subclass (runtime).'
    },
    {
      id: 'java-004',
      text: 'What happens when a String object is modified using concatenation in standard Java?',
      options: [
        'A brand new String object is created because String instances are immutable in Java',
        'The existing internal character array of the String object is mutated in-place',
        'The String pool automatically overwrites the original memory address with the new value',
        'Java throws an UnsupportedOperationException unless StringBuilder is explicitly enabled'
      ],
      correctIndex: 0,
      topic: 'Strings & Immutability',
      difficulty: 'beginner',
      explanation: 'Strings are immutable in Java. Modifying or concatenating strings creates new String objects in memory. For heavy mutations, StringBuilder or StringBuffer is recommended.'
    },
    {
      id: 'java-005',
      text: 'What is the default value of an uninitialized instance variable of type boolean and reference type in a Java class?',
      options: [
        'boolean defaults to false, reference type defaults to null',
        'boolean defaults to true, reference type defaults to empty object',
        'boolean defaults to undefined, reference type defaults to 0',
        'Java causes a compile error if any class field is uninitialized'
      ],
      correctIndex: 0,
      topic: 'Variables & Initialization',
      difficulty: 'beginner',
      explanation: 'Instance and static variables in Java receive default values upon class instantiation: false for boolean, 0 for numeric types, and null for object references.'
    },
    {
      id: 'java-006',
      text: 'What is the contract between equals() and hashCode() methods in Java?',
      options: [
        'If two objects are equal according to equals(), they must have the same hashCode() value',
        'If two objects have the same hashCode(), they must always be equal according to equals()',
        'hashCode() must return distinct integers for distinct objects without exception',
        'Overriding equals() never requires overriding hashCode()'
      ],
      correctIndex: 0,
      topic: 'Object Methods & Collections',
      difficulty: 'intermediate',
      explanation: 'The Java Object contract dictates that if o1.equals(o2) is true, then o1.hashCode() == o2.hashCode() MUST be true to function correctly in hash-based collections like HashMap and HashSet.'
    },
    {
      id: 'java-007',
      text: 'How does ArrayList differ internally from LinkedList in the Java Collections Framework?',
      options: [
        'ArrayList uses a dynamic resizable array with O(1) random access; LinkedList uses a doubly-linked list with O(n) element lookup by index',
        'ArrayList requires manual memory deallocation; LinkedList is automatically managed by the OS',
        'LinkedList is synchronized by default; ArrayList is strictly asynchronous',
        'ArrayList only stores primitives; LinkedList only stores objects'
      ],
      correctIndex: 0,
      topic: 'Collections',
      difficulty: 'intermediate',
      explanation: 'ArrayList is backed by an array providing fast O(1) random access (get(i)). LinkedList consists of node pointers requiring O(n) traversal for index access, but O(1) insertions at head/tail.'
    },
    {
      id: 'java-008',
      text: 'What is the difference between Checked and Unchecked exceptions in Java?',
      options: [
        'Checked exceptions inherit from Exception (excluding RuntimeException) and must be caught or declared; Unchecked exceptions inherit from RuntimeException or Error and are unchecked at compile-time',
        'Checked exceptions crash the JVM immediately; Unchecked exceptions are automatically logged and ignored',
        'Checked exceptions only occur in multi-threaded code; Unchecked exceptions only occur in single-threaded code',
        'All exceptions in modern Java 17+ are unchecked by default'
      ],
      correctIndex: 0,
      topic: 'Exception Handling',
      difficulty: 'intermediate',
      explanation: 'Checked exceptions represent recoverable conditions validated by the compiler (e.g. IOException). Unchecked exceptions represent programming errors (e.g. NullPointerException, IllegalArgumentException).'
    },
    {
      id: 'java-009',
      text: 'What is the purpose and behavior of the "final" keyword when applied to a class, method, and variable in Java?',
      options: [
        'Final class cannot be subclassed; final method cannot be overridden; final variable cannot be reassigned once initialized',
        'Final class is loaded into ROM; final method executes on GPU; final variable is destroyed upon method exit',
        'Final class makes all its fields public; final method runs asynchronously; final variable is mutable only once per thread',
        'Final keyword is deprecated in modern Java in favor of const'
      ],
      correctIndex: 0,
      topic: 'Java Modifiers',
      difficulty: 'intermediate',
      explanation: 'Applying final prevents inheritance on classes, prevents overriding on methods, and makes variable bindings immutable once assigned.'
    },
    {
      id: 'java-010',
      text: 'In Java multithreading, what does the "volatile" keyword guarantee?',
      options: [
        'Visibility of changes across threads by reading/writing directly from main memory rather than CPU caches',
        'Mutual exclusion and thread locking equivalent to synchronized blocks for compound operations (e.g. i++)',
        'Atomic execution of multi-line transaction blocks',
        'Automatic serialization of the target field to disk'
      ],
      correctIndex: 0,
      topic: 'Concurrency',
      difficulty: 'intermediate',
      explanation: 'volatile guarantees memory visibility so all threads see the most up-to-date value immediately from main memory, but does not provide atomic compound operations.'
    },
    {
      id: 'java-011',
      text: 'How does the Java Garbage Collector detect unused objects eligible for memory reclamation?',
      options: [
        'By performing GC Root reachability analysis (tracing active references from stack frames, static variables, and JNI handles)',
        'By counting references and immediately freeing objects when reference count reaches zero',
        'By scanning files on disk for unreferenced classes',
        'By terminating threads that have been idle for more than 60 seconds'
      ],
      correctIndex: 0,
      topic: 'JVM & Memory Management',
      difficulty: 'advanced',
      explanation: 'Modern JVM garbage collectors (G1, ZGC, Parallel) use tracing reachability from GC Roots rather than reference counting, preventing cyclical reference memory leaks.'
    },
    {
      id: 'java-012',
      text: 'What is the difference between HashMap and ConcurrentHashMap in Java concurrent programming?',
      options: [
        'ConcurrentHashMap allows thread-safe concurrent reads and segmented/bucket-level lock writes without synchronizing the entire table; HashMap is non-thread-safe',
        'HashMap is thread-safe using global mutexes; ConcurrentHashMap is single-threaded and lock-free',
        'ConcurrentHashMap permits null keys and null values; HashMap throws NullPointerException on any null key',
        'ConcurrentHashMap uses disk swapping when capacity exceeds 10,000 entries'
      ],
      correctIndex: 0,
      topic: 'Concurrent Collections',
      difficulty: 'advanced',
      explanation: 'ConcurrentHashMap achieves high concurrent throughput using fine-grained bucket-level locks and lock-free CAS operations. It disallows null keys and null values.'
    },
    {
      id: 'java-013',
      text: 'What happens during type erasure in Java Generics at compile time?',
      options: [
        'Generic type parameters are replaced with their upper bounds (or Object) and appropriate type casts are inserted in bytecode',
        'The JVM creates dedicated runtime machine code classes for every distinct generic type combination (like C++ templates)',
        'Generics are converted into dynamic JavaScript objects during compilation',
        'All generic classes are converted into static singleton instances'
      ],
      correctIndex: 0,
      topic: 'Generics Internals',
      difficulty: 'advanced',
      explanation: 'Java uses type erasure for backwards compatibility with legacy bytecode. Type parameters are erased to their bounds or Object, and explicit casts are inserted.'
    },
    {
      id: 'java-014',
      text: 'What is the purpose of the CompletableFuture API introduced in Java 8?',
      options: [
        'To model non-blocking, composable asynchronous programming with functional callbacks like thenApply and thenCompose',
        'To replace standard thread pools with operating system sub-processes',
        'To compile Java code directly into WebAssembly binaries',
        'To prevent memory leaks in Java Swing graphical components'
      ],
      correctIndex: 0,
      topic: 'Asynchronous Programming',
      difficulty: 'advanced',
      explanation: 'CompletableFuture represents a promise-like asynchronous pipeline that allows chaining, combining, and handling exceptions across concurrent tasks without blocking.'
    },
    {
      id: 'java-015',
      text: 'What is the difference between functional interfaces and standard interfaces in Java?',
      options: [
        'A functional interface has exactly one abstract method (SAM) and can be instantiated via lambda expressions or method references',
        'Functional interfaces cannot declare default or static methods',
        'Functional interfaces must be annotated with @FunctionalInterface or the compiler rejects them',
        'Standard interfaces can hold state variables, while functional interfaces cannot contain any constants'
      ],
      correctIndex: 0,
      topic: 'Lambdas & Functional Interfaces',
      difficulty: 'intermediate',
      explanation: 'A functional interface contains exactly one single abstract method (SAM). It can contain multiple default/static methods and serves as the target for lambdas.'
    },
    {
      id: 'java-016',
      text: 'Which Java Stream terminal operation collects elements into an unmodifiable list in Java 16+?',
      options: [
        'stream.toList()',
        'stream.collect(Collectors.toMutableList())',
        'stream.toUnmodifiableStream()',
        'stream.reduceToList()'
      ],
      correctIndex: 0,
      topic: 'Streams API',
      difficulty: 'intermediate',
      explanation: 'Stream.toList() was introduced in Java 16 as a concise convenience method that directly returns an unmodifiable List.'
    },
    {
      id: 'java-017',
      text: 'What is the difference between peek() and map() in Java Streams?',
      options: [
        'map() transforms each element into a new value; peek() performs a side-effect (e.g. logging) without altering the stream elements',
        'peek() is a terminal operation; map() is an intermediate operation',
        'peek() filters out elements; map() multiplies numerical values',
        'peek() runs on a separate daemon thread pool'
      ],
      correctIndex: 0,
      topic: 'Streams API',
      difficulty: 'intermediate',
      explanation: 'map(Function) produces a stream of transformed results. peek(Consumer) exists mainly to support debugging by performing actions without modifying stream elements.'
    },
    {
      id: 'java-018',
      text: 'How does the "try-with-resources" statement manage resource cleanup in Java?',
      options: [
        'It automatically invokes close() on any object implementing java.lang.AutoCloseable at the end of the statement block',
        'It terminates the entire JVM process if a resource fails to release within 5 seconds',
        'It moves the open file stream into a static background worker queue',
        'It delegates memory deallocation to the operating system file descriptor table'
      ],
      correctIndex: 0,
      topic: 'Resource Management',
      difficulty: 'beginner',
      explanation: 'Any resource implementing AutoCloseable or Closeable declared in try(...) is automatically closed in reverse order of declaration, even if exceptions occur.'
    },
    {
      id: 'java-019',
      text: 'What is the purpose of Virtual Threads (Project Loom) standardized in Java 21?',
      options: [
        'Lightweight user-mode threads managed by the JVM that enable massive concurrency (millions of threads) with low memory overhead',
        'Threads that run inside web browsers using WebAssembly',
        'Hardware threads tied 1-to-1 with physical CPU cores for compute-heavy matrix calculations',
        'GPU-accelerated background threads for machine learning models'
      ],
      correctIndex: 0,
      topic: 'Modern Java (Java 21)',
      difficulty: 'advanced',
      explanation: 'Virtual threads decouple Java thread execution from OS kernel threads, allowing applications to handle millions of concurrent I/O-bound tasks easily.'
    },
    {
      id: 'java-020',
      text: 'What is the Java Memory Model (JMM) "happens-before" relationship?',
      options: [
        'A formal guarantee that memory writes by one action are visible to a specific read action by another thread',
        'A compile-time order of class file loading based on alphanumeric package names',
        'The priority rule deciding whether static initializers run before instance constructors',
        'The network latency guarantee in Java RMI distributed calls'
      ],
      correctIndex: 0,
      topic: 'Java Memory Model',
      difficulty: 'advanced',
      explanation: 'The happens-before principle defines conditions under which memory operations in one thread are guaranteed to be visible to another thread in concurrent execution.'
    }
  ],

  // ─────────────────────────────────────────────────────────
  // 2. SPRING BOOT & MICROSERVICES (30+ questions)
  // ─────────────────────────────────────────────────────────
  springboot: [
    {
      id: 'spring-001',
      text: 'What is the primary role of the @SpringBootApplication annotation in Spring Boot?',
      options: [
        'It combines @Configuration, @EnableAutoConfiguration, and @ComponentScan with their default attributes',
        'It compiles the project into a native executable binary at launch time',
        'It creates a relational database schema automatically without Hibernate',
        'It configures Apache Tomcat server to run on port 443 by default'
      ],
      correctIndex: 0,
      topic: 'Core Spring Boot',
      difficulty: 'beginner',
      explanation: '@SpringBootApplication is a meta-annotation that bundles @Configuration, @EnableAutoConfiguration, and @ComponentScan on the main application class.'
    },
    {
      id: 'spring-002',
      text: 'What is the fundamental difference between @Component, @Service, and @Repository annotations in Spring?',
      options: [
        '@Component is the generic stereotype; @Service semanticizes business logic; @Repository semanticizes data access and translates database exceptions',
        '@Service beans are stateful singletons; @Component beans are prototype scoped by default; @Repository beans run asynchronously',
        '@Repository can only be used with MongoDB; @Service is only for REST controllers',
        'They are purely decorative with no functional or exception translation differences'
      ],
      correctIndex: 0,
      topic: 'Dependency Injection',
      difficulty: 'beginner',
      explanation: '@Component is the root stereotype. @Service designates domain business services. @Repository enables automatic persistence exception translation into Spring\'s DataAccessException hierarchy.'
    },
    {
      id: 'spring-003',
      text: 'How does Spring Boot achieve Auto-Configuration for embedded web servers and database connections?',
      options: [
        'By scanning classpath dependencies and conditionally configuring beans via @ConditionalOnClass and @ConditionalOnMissingBean',
        'By generating XML configuration files into the target folder during Maven compilation',
        'By connecting to a central Spring cloud registry at startup to download server configs',
        'By intercepting operating system syscalls using native C++ wrappers'
      ],
      correctIndex: 0,
      topic: 'Auto-Configuration',
      difficulty: 'intermediate',
      explanation: 'Spring Boot uses conditional annotations (such as @ConditionalOnClass, @ConditionalOnProperty) in auto-configuration classes to register beans dynamically based on present jars.'
    },
    {
      id: 'spring-004',
      text: 'What is the difference between @RestController and @Controller in Spring MVC?',
      options: [
        '@RestController is a combination of @Controller and @ResponseBody, automatically serializing return values directly into HTTP response bodies (e.g. JSON)',
        '@Controller is used for JSON APIs; @RestController is used for rendering JSP/Thymeleaf HTML templates',
        '@RestController requires manual HttpServletResponse writes; @Controller handles serialization automatically',
        '@RestController disables CORS filtering completely'
      ],
      correctIndex: 0,
      topic: 'REST API Design',
      difficulty: 'beginner',
      explanation: '@RestController applies @ResponseBody to all handler methods, ensuring return values are written directly to the HTTP response stream through HttpMessageConverters.'
    },
    {
      id: 'spring-005',
      text: 'In Spring Data JPA, how does dirty checking work within a @Transactional method boundary?',
      options: [
        'Hibernate compares the entity\'s current state against its snapshot from when it was loaded and automatically generates SQL UPDATEs on commit without explicit save() calls',
        'Developers must manually call entityManager.flush() and repository.save() for every modified field',
        'The database trigger polls the Spring application context every 500ms for entity modifications',
        'Dirty checking is only supported for MongoDB document models'
      ],
      correctIndex: 0,
      topic: 'Spring Data JPA',
      difficulty: 'intermediate',
      explanation: 'Inside an active @Transactional context, Hibernate manages attached entities in the persistence context. Any state changes are detected during dirty checking and flushed automatically upon transaction commit.'
    },
    {
      id: 'spring-006',
      text: 'What problem does the N+1 query problem represent in Spring Data JPA / Hibernate, and how is it resolved?',
      options: [
        'Fetching 1 parent entity results in N separate queries for its related children; resolved using JOIN FETCH or @EntityGraph',
        'Running N queries simultaneously crashes the database connection pool; resolved by disabling transactions',
        'Inserting N records takes N times longer than updating them; resolved by using NoSQL databases',
        'It represents pagination limits exceeding 1000 items per page'
      ],
      correctIndex: 0,
      topic: 'JPA Performance',
      difficulty: 'advanced',
      explanation: 'Lazy loading relationships across N records executes 1 initial query plus N queries for associated entities. Solving it requires eager fetching with JOIN FETCH, @EntityGraph, or batch fetching.'
    },
    {
      id: 'spring-007',
      text: 'What is the role of Spring Boot Actuator in production microservices?',
      options: [
        'Provides production-ready observability endpoints for application health, metrics, environment variables, thread dumps, and prometheus telemetry',
        'Compiles microservices into Docker container images during build time',
        'Automates database backups and database schema drops',
        'Enforces OAuth2 token encryption between microservices'
      ],
      correctIndex: 0,
      topic: 'Observability & Actuator',
      difficulty: 'intermediate',
      explanation: 'Spring Boot Actuator exposes health checks (/actuator/health), metrics (/actuator/metrics), prometheus scraping endpoints, and diagnostic tooling for production operations.'
    },
    {
      id: 'spring-008',
      text: 'How does Spring Security filter chain process incoming HTTP requests?',
      options: [
        'Requests pass through a chain of Security Filters (e.g. AuthenticationFilter, SecurityContextPersistenceFilter, AuthorizationFilter) registered in the DelegatingFilterProxy',
        'Requests bypass the servlet container and are routed directly to controller methods via reflection',
        'Spring Security modifies the TCP packet headers directly at the operating system network card level',
        'Security checks are performed only inside database stored procedures'
      ],
      correctIndex: 0,
      topic: 'Spring Security',
      difficulty: 'advanced',
      explanation: 'Spring Security registers DelegatingFilterProxy which passes incoming requests through a chain of security filters evaluating authentication tokens, sessions, CORS, CSRF, and authorization rules.'
    },
    {
      id: 'spring-009',
      text: 'What is the purpose of @ExceptionHandler and @ControllerAdvice in Spring Boot REST APIs?',
      options: [
        'They provide centralized global exception handling across all controllers, converting exceptions into standardized HTTP error responses',
        'They catch syntax errors before compilation',
        'They log database queries into external text files',
        'They prevent controllers from throwing any exceptions to the client'
      ],
      correctIndex: 0,
      topic: 'Error Handling',
      difficulty: 'intermediate',
      explanation: '@ControllerAdvice enables global interception of exceptions thrown by controller methods, allowing developers to return structured ProblemDetails or custom error JSON responses.'
    },
    {
      id: 'spring-010',
      text: 'What is the difference between Constructor Injection and Field Injection (@Autowired on fields) in Spring?',
      options: [
        'Constructor injection promotes immutability, facilitates unit testing without Spring context, and prevents partial object initialization; field injection is harder to test and hides dependencies',
        'Field injection is faster at runtime because it bypasses Java reflection',
        'Constructor injection cannot handle circular dependencies under any circumstance; field injection resolves them without memory overhead',
        'Field injection is required for Spring Boot 3.0+ applications'
      ],
      correctIndex: 0,
      topic: 'Dependency Injection Best Practices',
      difficulty: 'intermediate',
      explanation: 'Constructor injection is strongly recommended because it allows marking fields final, makes dependencies explicit, and enables straightforward unit testing with standard mock constructors.'
    },
    {
      id: 'spring-011',
      text: 'What is the role of Spring Cloud Gateway in a microservices ecosystem?',
      options: [
        'Acts as an intelligent API Gateway routing requests, handling cross-cutting concerns (rate limiting, security, SSL termination, and circuit breaking)',
        'Manages distributed database replication between MySQL nodes',
        'Replaces Kubernetes Ingress controllers entirely by managing DNS servers',
        'Converts Java bytecode into native machine code on the cloud'
      ],
      correctIndex: 0,
      topic: 'Microservices Architecture',
      difficulty: 'advanced',
      explanation: 'Spring Cloud Gateway is a reactive API Gateway built on Project Reactor and Netty providing routing, filtering, rate limiting, and request transformation for microservices.'
    },
    {
      id: 'spring-012',
      text: 'What is the purpose of @Version annotation in Spring Data JPA entities?',
      options: [
        'Enables optimistic locking to prevent concurrent overwrite collisions by checking and incrementing a version number upon database update',
        'Tracks the Git commit hash of the entity source code',
        'Controls the API versioning format for REST endpoints (v1, v2)',
        'Specifies the Java JDK version required to execute the entity'
      ],
      correctIndex: 0,
      topic: 'Concurrency & Locking',
      difficulty: 'advanced',
      explanation: 'The @Version annotation implements optimistic concurrency control. When updating an entity, JPA verifies that the version in DB matches the entity\'s version, throwing OptimisticLockException if another transaction modified it.'
    },
    {
      id: 'spring-013',
      text: 'How does the @Async annotation work in Spring Boot?',
      options: [
        'Executes the annotated method in a separate thread managed by a TaskExecutor, returning a Future or CompletableFuture',
        'Runs the method on a client-side JavaScript engine in the browser',
        'Forces the method to wait for all other threads to finish before starting',
        'Executes the method inside a Redis cache worker queue'
      ],
      correctIndex: 0,
      topic: 'Asynchronous Processing',
      difficulty: 'intermediate',
      explanation: 'When @EnableAsync is active, @Async proxies the target method call and dispatches its execution to a background TaskExecutor pool.'
    },
    {
      id: 'spring-014',
      text: 'What is Spring Boot DevTools and how does it improve developer productivity?',
      options: [
        'Provides automatic application restart upon classpath changes, live reload browser refresh, and disables template caching for fast iteration',
        'Automatically writes unit tests using AI code completion in IntelliJ',
        'Deploys code directly to AWS production servers upon file save',
        'Generates SQL database migration scripts automatically from controller endpoints'
      ],
      correctIndex: 0,
      topic: 'Developer Tooling',
      difficulty: 'beginner',
      explanation: 'Spring Boot DevTools speeds up local development by monitoring classpath changes to restart the application context rapidly while preserving static assets.'
    },
    {
      id: 'spring-015',
      text: 'How do you configure profile-specific properties (e.g. application-dev.yml vs application-prod.yml) in Spring Boot?',
      options: [
        'By activating the profile via spring.profiles.active property or environment variable SPRING_PROFILES_ACTIVE',
        'By hardcoding the database URL directly in the main Application Java class',
        'By deleting the unwanted configuration file before starting the jar',
        'Spring Boot only supports a single global application.properties file'
      ],
      correctIndex: 0,
      topic: 'Configuration Management',
      difficulty: 'beginner',
      explanation: 'Spring Boot loads environment-specific properties by matching the active profile name (e.g., application-{profile}.yml) against the spring.profiles.active configuration.'
    }
  ],

  // ─────────────────────────────────────────────────────────
  // 3. AUTHENTICATION & SECURITY (30+ questions)
  // ─────────────────────────────────────────────────────────
  authentication: [
    {
      id: 'auth-001',
      text: 'What are the three components that make up a JSON Web Token (JWT)?',
      options: [
        'Header, Payload, and Signature separated by dots (.)',
        'Username, Password, and Role separated by slashes (/)',
        'Public Key, Private Key, and Certificate separated by colons (:)',
        'Session ID, Cookie, and CSRF Token separated by hyphens (-)'
      ],
      correctIndex: 0,
      topic: 'JWT Structure',
      difficulty: 'beginner',
      explanation: 'A JWT consists of three Base64URL-encoded parts: Header (algorithm & token type), Payload (claims/data), and Signature (cryptographic hash validating integrity).'
    },
    {
      id: 'auth-002',
      text: 'Why should passwords NEVER be stored using plain MD5 or SHA-256 hashing in production databases?',
      options: [
        'MD5 and SHA-256 are fast general-purpose hash algorithms vulnerable to rainbow table lookups and massive parallel GPU brute-force attacks',
        'MD5 and SHA-256 encrypt passwords symmetrically allowing hackers to decrypt them with a single key',
        'MD5 and SHA-256 are only supported on Linux servers, causing errors on Windows hosts',
        'Plain hash algorithms automatically expire after 30 days'
      ],
      correctIndex: 0,
      topic: 'Password Security',
      difficulty: 'beginner',
      explanation: 'General-purpose hash algorithms are designed to be fast. Secure password storage requires slow, salted, memory-hard algorithms like bcrypt, Argon2, or PBKDF2 with tunable cost factors.'
    },
    {
      id: 'auth-003',
      text: 'What is the purpose of a Salt when hashing user passwords?',
      options: [
        'A unique random string concatenated with the password before hashing to ensure identical passwords produce completely different hash outputs',
        'An encryption key stored in the browser localStorage to authenticate sessions',
        'A checksum validating the length of the email address',
        'A digital certificate issued by a certificate authority'
      ],
      correctIndex: 0,
      topic: 'Password Hashing',
      difficulty: 'beginner',
      explanation: 'Salting introduces unique randomness to each password, neutralizing precomputed rainbow table attacks and preventing attackers from identifying matching passwords across users.'
    },
    {
      id: 'auth-004',
      text: 'What is the primary difference between Authentication (AuthN) and Authorization (AuthZ)?',
      options: [
        'Authentication verifies WHO the user is (identity); Authorization determines WHAT resources or actions the user is permitted to access (permissions)',
        'Authentication checks database permissions; Authorization validates user password strength',
        'Authentication is handled by the frontend; Authorization is handled only by database firewalls',
        'Authentication generates JWT tokens; Authorization encrypts SSL certificates'
      ],
      correctIndex: 0,
      topic: 'Auth Concepts',
      difficulty: 'beginner',
      explanation: 'Authentication proves identity (e.g. login credentials). Authorization determines the permissions and access rights granted to that authenticated identity (e.g. role checks).'
    },
    {
      id: 'auth-005',
      text: 'Why is storing JWT access tokens in browser "localStorage" considered vulnerable to XSS attacks?',
      options: [
        'Any malicious JavaScript executing on the page via Cross-Site Scripting (XSS) can read localStorage and exfiltrate the token',
        'localStorage is automatically transmitted in every cross-origin image request',
        'localStorage tokens expire immediately when the browser tab is closed',
        'Browsers encrypt localStorage with a public key accessible to third-party cookies'
      ],
      correctIndex: 0,
      topic: 'Token Storage Security',
      difficulty: 'intermediate',
      explanation: 'Any injected script (XSS) has full access to `window.localStorage`. Storing sensitive tokens in `httpOnly` secure cookies prevents JavaScript access, mitigating token theft via XSS.'
    },
    {
      id: 'auth-006',
      text: 'How does an "httpOnly" cookie mitigate XSS token theft?',
      options: [
        'It instructs the browser that the cookie cannot be accessed via client-side JavaScript document.cookie APIs',
        'It encrypts the payload using quantum encryption before sending over HTTP',
        'It prevents the browser from sending requests to non-HTTPS ports',
        'It forces the user to re-enter their password on every page reload'
      ],
      correctIndex: 0,
      topic: 'Cookie Security',
      difficulty: 'intermediate',
      explanation: 'The httpOnly flag prevents client-side scripts from reading the cookie, meaning an XSS attacker cannot directly steal the session cookie via JavaScript.'
    },
    {
      id: 'auth-007',
      text: 'What is Cross-Site Request Forgery (CSRF) and how is it prevented for cookie-based authentication?',
      options: [
        'An attack tricking an authenticated user\'s browser into executing unwanted actions on a trusted site; prevented using SameSite cookie attributes and anti-CSRF synchronizer tokens',
        'An attack injecting SQL queries into login form inputs; prevented using React hooks',
        'An attack intercepting WiFi network packets; prevented using HTTPS certificates',
        'An attack overloading web servers with DDOS traffic; prevented using rate limiters'
      ],
      correctIndex: 0,
      topic: 'CSRF Protection',
      difficulty: 'intermediate',
      explanation: 'CSRF exploits the browser\'s behavior of automatically sending cookies on cross-origin requests. Using `SameSite=Strict/Lax` cookies and validating unique CSRF tokens prevents unauthorized submissions.'
    },
    {
      id: 'auth-008',
      text: 'What is the purpose of using a short-lived Access Token paired with a long-lived Refresh Token in modern OAuth2/JWT architectures?',
      options: [
        'To minimize the exposure window if an access token is intercepted while allowing seamless token renewal without requiring the user to re-enter credentials',
        'To bypass SSL certificate validation on mobile devices',
        'To allow users to log in without creating a password',
        'To store the entire user database table inside the browser memory'
      ],
      correctIndex: 0,
      topic: 'OAuth2 & Refresh Tokens',
      difficulty: 'intermediate',
      explanation: 'Short-lived access tokens (e.g. 15 mins) reduce the damage if leaked. The refresh token (stored securely in httpOnly cookie or secure storage) requests fresh access tokens from the auth server.'
    },
    {
      id: 'auth-009',
      text: 'What is the role of the "aud" (Audience) and "iss" (Issuer) claims in a standard JWT specification (RFC 7519)?',
      options: [
        '"iss" identifies the principal that issued the JWT; "aud" identifies the recipients that the JWT is intended for',
        '"iss" specifies the user\'s IP address; "aud" specifies the user\'s browser version',
        '"iss" tracks database transactions; "aud" measures API latency in milliseconds',
        '"iss" is the user password hash; "aud" is the user email address'
      ],
      correctIndex: 0,
      topic: 'JWT Claims Specification',
      difficulty: 'intermediate',
      explanation: 'Standard registered claims: `iss` (issuer) verifies who minted the token, and `aud` (audience) ensures the token was intended for the specific consuming backend service.'
    },
    {
      id: 'auth-010',
      text: 'What is Role-Based Access Control (RBAC) in web application authorization?',
      options: [
        'An authorization model where permissions are assigned to specific roles (e.g. ADMIN, USER, EDITOR), and users are assigned roles to gain access to corresponding endpoints',
        'An authentication mechanism where users solve CAPTCHAs before every login attempt',
        'A protocol for encrypting database backups with asymmetric keys',
        'A load balancing technique distributing traffic based on user location'
      ],
      correctIndex: 0,
      topic: 'RBAC Authorization',
      difficulty: 'beginner',
      explanation: 'RBAC simplifies authorization by grouping permissions into roles and binding users to those roles, preventing hardcoded user-by-user permission logic.'
    },
    {
      id: 'auth-011',
      text: 'How does OAuth 2.0 Authorization Code Flow with PKCE (Proof Key for Code Exchange) secure single-page and mobile applications?',
      options: [
        'It dynamically creates a cryptographically random code_verifier and code_challenge, preventing authorization code interception attacks without requiring a hardcoded client secret on public clients',
        'It encrypts the entire frontend JavaScript bundle using asymmetric RSA keys',
        'It stores user passwords directly in secure hardware enclaves on the server',
        'It replaces HTTPS encryption with WebSockets'
      ],
      correctIndex: 0,
      topic: 'OAuth2 & PKCE',
      difficulty: 'advanced',
      explanation: 'PKCE solves the issue that public clients (SPAs, mobile apps) cannot safely store a client secret. The authorization code can only be exchanged by the client that proves knowledge of the original code_verifier.'
    },
    {
      id: 'auth-012',
      text: 'What is the difference between symmetric encryption (e.g. HS256) and asymmetric encryption (e.g. RS256) when signing JWTs?',
      options: [
        'HS256 uses the same secret key to both sign and verify the token; RS256 uses a private key to sign and a public key to verify',
        'HS256 requires digital certificates from Verisign; RS256 requires no keys at all',
        'HS256 can only be verified on the frontend; RS256 can only be verified on database servers',
        'HS256 is unencrypted plain text; RS256 compresses data with gzip'
      ],
      correctIndex: 0,
      topic: 'Cryptographic Algorithms',
      difficulty: 'advanced',
      explanation: 'In HS256, all microservices verifying tokens must share the secret signing key. In RS256, the auth server keeps the private key secret, while all consuming services verify tokens using the public key safely.'
    },
    {
      id: 'auth-013',
      text: 'How should token revocation / logout be handled for stateless JWT tokens?',
      options: [
        'By maintaining a fast in-memory blacklist/denylist (e.g. in Redis) with TTL matching the token expiry, or using token version numbers in the user record',
        'By sending an email to the user asking them to delete the token file from their computer',
        'Stateless JWTs automatically self-destruct across all servers the moment the browser tab is closed',
        'By rebooting the backend server cluster after every user logout'
      ],
      correctIndex: 0,
      topic: 'Token Revocation',
      difficulty: 'advanced',
      explanation: 'Because JWTs are stateless, immediate revocation requires either maintaining a fast token blocklist in Redis (indexed by token jti/ID with TTL) or checking a user token_version counter on each request.'
    },
    {
      id: 'auth-014',
      text: 'What is Multi-Factor Authentication (MFA) using Time-based One-Time Password (TOTP) algorithm (RFC 6238)?',
      options: [
        'Generates 6-digit codes by computing an HMAC hash of the shared secret key and the current 30-second Unix time counter',
        'Sends an SMS message through satellite telecom networks every time the user clicks a button',
        'Requires two separate passwords typed simultaneously on separate keyboards',
        'Verifies user identity by measuring mouse movement patterns'
      ],
      correctIndex: 0,
      topic: 'MFA & TOTP',
      difficulty: 'intermediate',
      explanation: 'TOTP combines a secret seed shared between server and authenticator app with the current time window (typically 30 seconds) through HMAC-SHA1 to produce transient verification codes.'
    },
    {
      id: 'auth-015',
      text: 'What is the purpose of Cross-Origin Resource Sharing (CORS) preflight (OPTIONS) request in API security?',
      options: [
        'The browser asks the server for permission before sending non-simple HTTP requests (e.g. custom headers like Authorization, methods like PUT/DELETE) to a different origin',
        'The server downloads the user\'s local network routing table before accepting connections',
        'The browser checks if the user has an active antivirus subscription',
        'It compresses JSON payloads before transmission over mobile networks'
      ],
      correctIndex: 0,
      topic: 'CORS Security',
      difficulty: 'beginner',
      explanation: 'Browsers enforce the Same-Origin Policy. Preflight OPTIONS requests verify that the target server explicitly permits the origin, HTTP method, and headers before dispatching the real cross-origin request.'
    }
  ],

  // ─────────────────────────────────────────────────────────
  // 4. REAL-TIME & SOCKET.IO (30+ questions)
  // ─────────────────────────────────────────────────────────
  socketio: [
    {
      id: 'socket-001',
      text: 'What is the core difference between HTTP and WebSockets for real-time web applications?',
      options: [
        'HTTP is a request-response protocol where clients initiate requests; WebSockets provide a persistent, full-duplex, bidirectional communication channel over a single TCP connection',
        'HTTP supports bidirectional audio streaming; WebSockets only support plain text transfers',
        'WebSockets require opening a new TCP handshake for every message sent by the server',
        'WebSockets only operate over UDP and cannot transmit structured JSON'
      ],
      correctIndex: 0,
      topic: 'WebSockets vs HTTP',
      difficulty: 'beginner',
      explanation: 'WebSockets establish a persistent TCP connection initiated via an HTTP upgrade handshake, enabling both client and server to send messages at any time without HTTP request overhead.'
    },
    {
      id: 'socket-002',
      text: 'How does Socket.io differ from raw native WebSockets in browsers?',
      options: [
        'Socket.io provides automatic fallback to HTTP long-polling if WebSockets fail, automatic reconnection, heartbeats, broadcasting, and named rooms/namespaces',
        'Native WebSockets are slower because they require compiling C++ binaries in the browser',
        'Socket.io cannot communicate over HTTPS or WSS protocols',
        'Socket.io is only compatible with Angular and Vue applications'
      ],
      correctIndex: 0,
      topic: 'Socket.io Architecture',
      difficulty: 'beginner',
      explanation: 'Socket.io is a higher-level library layered on top of Engine.io. It handles cross-browser fallbacks (HTTP long-polling), auto-reconnects, packet buffering, and logical rooms/namespaces.'
    },
    {
      id: 'socket-003',
      text: 'In Socket.io on Node.js, what is the difference between "socket.emit()" and "socket.broadcast.emit()"?',
      options: [
        'socket.emit() sends the event only to the specific connected client; socket.broadcast.emit() sends the event to all connected clients EXCEPT the sender',
        'socket.broadcast.emit() sends the event to all server processes in the entire datacenter simultaneously',
        'socket.emit() is synchronous; socket.broadcast.emit() is asynchronous',
        'socket.broadcast.emit() deletes the socket connection immediately after message delivery'
      ],
      correctIndex: 0,
      topic: 'Event Emission',
      difficulty: 'beginner',
      explanation: 'socket.emit sends an event to the individual socket. socket.broadcast.emit broadcasts the event to all other connected sockets in the namespace except the triggering socket.'
    },
    {
      id: 'socket-004',
      text: 'What is a Socket.io "Room" and how is it used?',
      options: [
        'A server-only channel that arbitrary sockets can join or leave, allowing targeted broadcasts (e.g. io.to("room-123").emit(...)) to specific user subsets',
        'A dedicated physical server rack assigned to a chat group',
        'A browser tab isolating React state from other tabs',
        'A MongoDB collection created dynamically per active WebSocket connection'
      ],
      correctIndex: 0,
      topic: 'Rooms & Namespaces',
      difficulty: 'intermediate',
      explanation: 'Rooms are server-side groupings of sockets. Sockets can join/leave rooms (e.g. chat rooms, game lobbies), allowing the server to broadcast events only to members of that specific room.'
    },
    {
      id: 'socket-005',
      text: 'How do you scale a Socket.io backend application across multiple Node.js server instances or cluster nodes?',
      options: [
        'By using the Socket.io Redis Adapter (@socket.io/redis-adapter) with Redis Pub/Sub to synchronize events across server instances, combined with sticky sessions on the load balancer',
        'By increasing the RAM on a single monolithic server to 1 Terabyte without load balancers',
        'Socket.io automatically clusters across multiple servers over Bluetooth peer-to-peer',
        'By converting all WebSocket packets into standard MySQL INSERT triggers'
      ],
      correctIndex: 0,
      topic: 'Horizontal Scaling',
      difficulty: 'advanced',
      explanation: 'Scaling across multiple processes requires an adapter (like Redis Pub/Sub) so broadcast events reach sockets connected to other nodes, alongside sticky load balancing for the initial HTTP handshake.'
    },
    {
      id: 'socket-006',
      text: 'What is the purpose of the HTTP Upgrade header in the WebSocket handshake (RFC 6455)?',
      options: [
        'It requests the web server to switch the protocol on the current TCP connection from standard HTTP/1.1 to the WebSocket protocol',
        'It forces the client browser to update to the latest Chrome version',
        'It upgrades the SSL certificate encryption key from 128-bit to 256-bit',
        'It upgrades the user account privileges to administrator'
      ],
      correctIndex: 0,
      topic: 'WebSocket Handshake',
      difficulty: 'intermediate',
      explanation: 'Clients send `Connection: Upgrade` and `Upgrade: websocket` in standard HTTP GET requests. If supported, the server returns HTTP 101 Switching Protocols to begin WebSocket framing.'
    },
    {
      id: 'socket-007',
      text: 'How does Socket.io middleware work for authenticating incoming connections (e.g. with JWT)?',
      options: [
        'io.use((socket, next) => { ... }) executes during the initial handshake, allowing token extraction from socket.handshake.auth and rejecting unauthorized connections via next(new Error(...))',
        'Middleware runs in the browser before sending the network packet',
        'Middleware decrypts database credentials inside the operating system kernel',
        'Socket.io does not support middleware; all auth must happen inside React useEffect hooks'
      ],
      correctIndex: 0,
      topic: 'Authentication & Middleware',
      difficulty: 'intermediate',
      explanation: 'Socket.io provides `io.use((socket, next) => ...)` middleware. Tokens passed in client auth options can be validated before granting the socket connection.'
    },
    {
      id: 'socket-008',
      text: 'What is the purpose of the Ping/Pong heartbeat mechanism in WebSockets / Socket.io?',
      options: [
        'To periodically check connection liveness, detect dead network connections, and prevent intermediate proxies/firewalls from terminating idle TCP sockets',
        'To synchronize server clocks for distributed database commits',
        'To measure the physical distance between client and server GPS coordinates',
        'To compress packet payloads during high-traffic game events'
      ],
      correctIndex: 0,
      topic: 'Connection Liveness',
      difficulty: 'intermediate',
      explanation: 'Heartbeat packets (ping/pong) sent at regular intervals verify that both client and server are still responsive, allowing graceful disconnection if a silent network drop occurs.'
    },
    {
      id: 'socket-009',
      text: 'What happens when a Socket.io client disconnects unexpectedly (e.g. mobile loses signal)?',
      options: [
        'The server fires a "disconnect" event on the socket with reason string, and the client automatically queues reconnection attempts with exponential backoff',
        'The server crashes with an uncaught exception unless process.exit(0) is trapped',
        'All database records created by that user are immediately deleted',
        'The browser tab freezes until internet connectivity is manually restored'
      ],
      correctIndex: 0,
      topic: 'Disconnection & Reconnection',
      difficulty: 'beginner',
      explanation: 'Socket.io handles disconnections cleanly, firing `disconnect` on both sides. The client automatically attempts reconnection using configurable intervals and exponential backoff.'
    },
    {
      id: 'socket-010',
      text: 'What are Socket.io Acknowledgements (Ack callbacks)?',
      options: [
        'A request-response pattern over WebSockets where the emitter passes a callback function that the receiver invokes with response data upon receiving the event',
        'A confirmation email sent to the user after every chat message',
        'A digital signature signed by a third-party certificate authority',
        'A database commit log stored on disk'
      ],
      correctIndex: 0,
      topic: 'Acknowledgements & Callbacks',
      difficulty: 'intermediate',
      explanation: 'Acknowledgements allow client or server to emit an event with a trailing callback. The other party receives the data and calls the callback to return a direct response.'
    },
    {
      id: 'socket-011',
      text: 'What is the difference between Socket.io Namespaces and Rooms?',
      options: [
        'Namespaces define distinct communication endpoints with separate connection pools and authorization (e.g. /admin vs /chat); Rooms are internal server groupings within a namespace',
        'Namespaces are stored in Redis; Rooms are stored in browser memory',
        'Namespaces only support UDP; Rooms only support TCP',
        'Rooms require SSL certificates; Namespaces are unencrypted'
      ],
      correctIndex: 0,
      topic: 'Architecture & Segmentation',
      difficulty: 'advanced',
      explanation: 'Namespaces (`io.of("/admin")`) isolate communication channels, multiplexing over a single connection with independent middleware. Rooms exist inside a namespace for transient groupings.'
    },
    {
      id: 'socket-012',
      text: 'How do you prevent memory leaks when managing Socket.io event listeners in a React component?',
      options: [
        'By cleaning up event listeners in the useEffect return function using socket.off("event_name", handler)',
        'By reloading the entire browser window whenever a new message is received',
        'By setting socket = null in the render return statement',
        'React garbage collects WebSocket listeners automatically without cleanup'
      ],
      correctIndex: 0,
      topic: 'React Integration',
      difficulty: 'intermediate',
      explanation: 'Failing to remove socket listeners with `socket.off()` in `useEffect` cleanup causes duplicate handler registrations and memory leaks as components remount.'
    },
    {
      id: 'socket-013',
      text: 'What is WebRTC and how does it relate to WebSockets/Socket.io?',
      options: [
        'WebRTC enables peer-to-peer real-time audio/video and arbitrary data streaming between browsers; WebSockets are commonly used for the initial signaling phase (SDP/ICE exchange)',
        'WebRTC is an older version of Socket.io that has been deprecated',
        'WebRTC replaces TCP with Bluetooth for mobile web apps',
        'WebRTC only works when servers are hosted on AWS Lambda'
      ],
      correctIndex: 0,
      topic: 'WebRTC Signaling',
      difficulty: 'advanced',
      explanation: 'WebRTC connects browsers directly peer-to-peer for high-bandwidth media streams. Socket.io is typically used as the signaling server to exchange session descriptions (SDP) and ICE candidates.'
    },
    {
      id: 'socket-014',
      text: 'What is Socket.io "Volatile" message emission (socket.volatile.emit)?',
      options: [
        'Messages that are discarded if the underlying connection/client is not ready to receive them (ideal for high-frequency transient telemetry/game coordinates)',
        'Messages that self-destruct from the client screen after 5 seconds',
        'Messages that are encrypted with quantum-resistant keys',
        'Messages that trigger server memory garbage collection'
      ],
      correctIndex: 0,
      topic: 'Performance Optimization',
      difficulty: 'advanced',
      explanation: 'Volatile messages are not buffered if the transport is not ready. If a connection lags or drops, the packet is simply dropped instead of congesting the buffer.'
    },
    {
      id: 'socket-015',
      text: 'Why is sticky session (session affinity) required when using HTTP long-polling with Socket.io behind a load balancer?',
      options: [
        'Because subsequent HTTP poll requests from the same client must reach the exact same server process holding that client\'s handshake session state',
        'Because load balancers encrypt WebSocket frames with server-specific keys',
        'Because Redis does not support HTTP long-polling',
        'Because HTTP long-polling is only supported on single-core CPU architectures'
      ],
      correctIndex: 0,
      topic: 'Load Balancing & Sticky Sessions',
      difficulty: 'advanced',
      explanation: 'During the initial HTTP long-polling phase before WebSocket upgrade, multiple HTTP requests constitute a single logical session. If routed to different servers, the session handshake fails with 400 Bad Request.'
    }
  ],

  // ─────────────────────────────────────────────────────────
  // 5. ANGULAR & TYPESCRIPT (30+ questions)
  // ─────────────────────────────────────────────────────────
  angular: [
    {
      id: 'ng-001',
      text: 'What is the role of an Angular Component and how is it defined?',
      options: [
        'A TypeScript class decorated with @Component() specifying an HTML template, CSS styles, and a custom HTML tag selector',
        'A JSON file mapping URL routes to static HTML files',
        'A Java bytecode class executed inside a browser virtual machine',
        'A database model representing SQL tables in Angular'
      ],
      correctIndex: 0,
      topic: 'Components',
      difficulty: 'beginner',
      explanation: 'Components are the fundamental building blocks of Angular UIs. They consist of a TypeScript class containing logic and an `@Component()` decorator linking template HTML and CSS.'
    },
    {
      id: 'ng-002',
      text: 'What is the difference between Angular One-way data binding and Two-way data binding syntax?',
      options: [
        'One-way binding uses [property] for input and (event) for output; Two-way binding uses [(ngModel)] "banana in a box" syntax',
        'One-way binding uses {{ value }}; Two-way binding uses <value></value> tags',
        'One-way binding only works with strings; Two-way binding only works with numbers',
        'Two-way binding requires compiling Angular with Webpack plugins'
      ],
      correctIndex: 0,
      topic: 'Data Binding',
      difficulty: 'beginner',
      explanation: 'Property binding `[target]="expr"` and event binding `(target)="statement"` represent one-way flows. Combining them as `[(ngModel)]="property"` creates two-way data synchronization.'
    },
    {
      id: 'ng-003',
      text: 'What is an Angular Service and how does Angular\'s Dependency Injection (DI) system manage its lifecycle?',
      options: [
        'A class decorated with @Injectable() that encapsulates business logic and data access, injected into components as singletons when provided in "root"',
        'A backend Node.js microservice running inside Angular',
        'A browser service worker for offline caching',
        'A CSS preprocessor compilation script'
      ],
      correctIndex: 0,
      topic: 'Services & Dependency Injection',
      difficulty: 'beginner',
      explanation: '@Injectable({ providedIn: \'root\' }) registers the service with the root injector, providing a single application-wide singleton instance across components.'
    },
    {
      id: 'ng-004',
      text: 'What is the difference between Structural Directives (*ngIf, *ngFor) and Attribute Directives (ngClass, ngStyle) in Angular?',
      options: [
        'Structural directives add or remove elements from the DOM tree (denoted by the asterisk *); Attribute directives alter the appearance or behavior of existing DOM elements',
        'Structural directives are compiled on the server; Attribute directives run in browser memory',
        'Structural directives only apply to tables; Attribute directives apply to buttons',
        'Attribute directives require jQuery to be loaded in the index.html'
      ],
      correctIndex: 0,
      topic: 'Directives',
      difficulty: 'beginner',
      explanation: 'Structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`) reshape the DOM structure. Attribute directives (`ngClass`, `ngStyle`, custom attributes) modify attributes and styling on existing elements.'
    },
    {
      id: 'ng-005',
      text: 'In RxJS and Angular, what is the difference between an Observable and a Promise?',
      options: [
        'Observables are cancellable, declarative streams that can emit multiple values over time; Promises are eager, non-cancellable, and resolve a single value',
        'Promises are synchronous; Observables are asynchronous',
        'Observables only work with WebSockets; Promises only work with HTTP GET',
        'Promises are deprecated in modern JavaScript in favor of RxJS'
      ],
      correctIndex: 0,
      topic: 'RxJS & Reactive Programming',
      difficulty: 'intermediate',
      explanation: 'Observables support multiple emissions, functional operators (map, filter, switchMap, debounceTime), and lazy execution upon subscription with cancellation via unsubscribe.'
    },
    {
      id: 'ng-006',
      text: 'What is the purpose of the async pipe ({{ data$ | async }}) in Angular templates?',
      options: [
        'It automatically subscribes to an Observable or Promise, updates the view when new values emit, and automatically unsubscribes when the component is destroyed to prevent memory leaks',
        'It executes the template rendering on a background web worker thread',
        'It converts synchronous functions into async/await methods',
        'It caches API responses in browser sessionStorage'
      ],
      correctIndex: 0,
      topic: 'Pipes & Async Pipe',
      difficulty: 'intermediate',
      explanation: 'The async pipe manages Observable subscription lifecycles automatically within template templates, triggering change detection on new emissions and unsubscribing cleanly on component destruction.'
    },
    {
      id: 'ng-007',
      text: 'What is the difference between Default and OnPush Change Detection strategies in Angular?',
      options: [
        'Default checks every component on every browser event; OnPush only checks the component when its @Input() reference changes, an event originates from within it, or an Observable emits via async pipe',
        'OnPush runs change detection on every mouse move; Default runs once per minute',
        'OnPush disables two-way data binding completely',
        'Default change detection is only for mobile applications'
      ],
      correctIndex: 0,
      topic: 'Change Detection Optimization',
      difficulty: 'advanced',
      explanation: '`ChangeDetectionStrategy.OnPush` significantly boosts performance by skipping component subtree verification unless immutable inputs change or internal events fire.'
    },
    {
      id: 'ng-008',
      text: 'What are Angular Route Guards (CanActivate, CanDeactivate, CanMatch) used for?',
      options: [
        'Controlling navigation by granting or denying access to routes based on conditions (e.g. user authentication, unsaved form changes, feature flags)',
        'Preventing Cross-Site Scripting (XSS) attacks in URLs',
        'Encrypting route parameters before saving to browser history',
        'Blocking search engine bots from crawling internal admin pages'
      ],
      correctIndex: 0,
      topic: 'Routing & Guards',
      difficulty: 'intermediate',
      explanation: 'Route Guards intercept navigation attempts. `CanActivate` verifies permissions before loading a route, while `CanDeactivate` prompts users if navigating away with unsaved data.'
    },
    {
      id: 'ng-009',
      text: 'What is the difference between Reactive Forms and Template-Driven Forms in Angular?',
      options: [
        'Reactive Forms define form models explicitly in TypeScript (FormGroup, FormControl) providing synchronous access, strong typing, and easy testing; Template-driven forms build models implicitly in HTML templates using ngModel',
        'Reactive Forms do not support validation; Template-driven forms support async validation only',
        'Template-driven forms are for REST APIs; Reactive forms are for GraphQL only',
        'Reactive forms require Redux to be installed'
      ],
      correctIndex: 0,
      topic: 'Forms Management',
      difficulty: 'intermediate',
      explanation: 'Reactive Forms offer robust programmatic control, immutability, synchronous validation pipelines, and testability. Template-driven forms rely on template directives and two-way binding.'
    },
    {
      id: 'ng-010',
      text: 'What are Angular Standalone Components (introduced in Angular 14+)?',
      options: [
        'Components, directives, and pipes that can be rendered without declaring them inside an @NgModule, simplifying application architecture and tree-shaking',
        'Components that run completely outside the browser in WebAssembly',
        'Components that do not require TypeScript and use pure HTML5',
        'Components that can only be used as third-party npm packages'
      ],
      correctIndex: 0,
      topic: 'Standalone Components & Modern Angular',
      difficulty: 'intermediate',
      explanation: 'Standalone components eliminate the need for NgModules (`standalone: true`), managing their own dependencies directly in the `imports` array of the component decorator.'
    },
    {
      id: 'ng-011',
      text: 'What is the switchMap operator in RxJS commonly used for in Angular HTTP services (e.g. search typeaheads)?',
      options: [
        'It projects each source value to an Observable, cancels previous in-flight inner HTTP requests, and switches to the latest emitted stream',
        'It converts arrays into objects synchronously',
        'It pauses execution of all components for 300 milliseconds',
        'It catches JavaScript runtime exceptions and retries the application launch'
      ],
      correctIndex: 0,
      topic: 'RxJS Operators',
      difficulty: 'advanced',
      explanation: '`switchMap` cancels any active in-flight inner Observable when a new item emits from the source. In autocomplete inputs, this prevents race conditions from stale previous HTTP queries.'
    },
    {
      id: 'ng-012',
      text: 'What are Angular Signals (introduced in Angular 16+)?',
      options: [
        'A reactive primitive that tracks value changes and dependencies with fine-grained reactivity, notifying only the exact parts of the UI that depend on the changed signal',
        'WebSockets integrated directly into the Angular core compiler',
        'Hardware notifications sent to mobile device notification centers',
        'A replacement for TypeScript interfaces'
      ],
      correctIndex: 0,
      topic: 'Angular Signals',
      difficulty: 'advanced',
      explanation: 'Signals provide fine-grained, synchronous reactivity (`signal()`, `computed()`, `effect()`), allowing Angular to update specific DOM bindings without re-evaluating full component trees.'
    },
    {
      id: 'ng-013',
      text: 'What is the purpose of Angular HTTP Interceptors (HttpInterceptorFn / HttpInterceptor)?',
      options: [
        'To intercept and transform outgoing HTTP requests (e.g. attaching JWT Authorization headers) and incoming HTTP responses globally',
        'To block user access to external website links in HTML templates',
        'To compress image files before sending to cloud storage',
        'To translate SQL queries into GraphQL queries'
      ],
      correctIndex: 0,
      topic: 'HTTP Client & Interceptors',
      difficulty: 'intermediate',
      explanation: 'Interceptors act as middleware for Angular HttpClient, allowing global attachment of auth tokens, logging, error handling, and retry strategies.'
    },
    {
      id: 'ng-014',
      text: 'What is the difference between ng-content and ng-template in Angular?',
      options: [
        'ng-content is used for content projection (passing children from parent to child component); ng-template is an element used to render template fragments conditionally or dynamically',
        'ng-content renders CSS styles; ng-template renders HTML structure',
        'ng-template is deprecated in favor of React JSX',
        'ng-content only works inside Angular directives'
      ],
      correctIndex: 0,
      topic: 'Templates & Content Projection',
      difficulty: 'intermediate',
      explanation: '`ng-content` allows slot-based component composition. `ng-template` defines lazy template blocks rendered via structural directives (`*ngIf`, `ngTemplateOutlet`).'
    },
    {
      id: 'ng-015',
      text: 'What does Ahead-of-Time (AOT) compilation do in Angular build processes?',
      options: [
        'Compiles Angular HTML templates and TypeScript code into efficient native JavaScript code during the build phase before the browser runs the app',
        'Compiles JavaScript into WebAssembly at runtime on the user\'s machine',
        'Pre-renders all database records into static JSON files',
        'Converts SCSS files into plain CSS without minification'
      ],
      correctIndex: 0,
      topic: 'AOT Compilation & Performance',
      difficulty: 'intermediate',
      explanation: 'AOT compiles templates at build time, catching template errors early, drastically reducing bundle size by stripping the Angular compiler from production assets.'
    }
  ]
};

// Aliases mapping skill strings to bank categories
const comprehensiveSkillAliasMap = {
  // Java
  java: 'java',
  javaprogramming: 'java',
  corejava: 'java',
  javafundamentals: 'java',
  javacsharp: 'java',
  javacollections: 'java',
  javaoop: 'java',
  java8: 'java',
  java17: 'java',
  java21: 'java',

  // Spring Boot
  springboot: 'springboot',
  spring: 'springboot',
  springframework: 'springboot',
  springdata: 'springboot',
  springsecurity: 'springboot',
  springmvc: 'springboot',
  springcloud: 'springboot',
  microservices: 'springboot',

  // Authentication & Security
  authentication: 'authentication',
  auth: 'authentication',
  jwt: 'authentication',
  oauth: 'authentication',
  oauth2: 'authentication',
  security: 'authentication',
  websecurity: 'authentication',
  authorization: 'authentication',
  rbac: 'authentication',

  // Socket.io & Real-Time
  socketio: 'socketio',
  socket: 'socketio',
  sockets: 'socketio',
  websocket: 'socketio',
  websockets: 'socketio',
  realtime: 'socketio',
  webrtc: 'socketio',

  // Angular
  angular: 'angular',
  angularjs: 'angular',
  angular14: 'angular',
  angular16: 'angular',
  angular17: 'angular',
  rxjs: 'angular',
  typescriptwithangular: 'angular'
};

module.exports = { comprehensiveQuestionBank, comprehensiveSkillAliasMap };
