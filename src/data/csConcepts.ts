export interface CSConceptCard {
  id: string;
  subject: 'OS' | 'DBMS' | 'OOP' | 'CN';
  title: string;
  summary: string;
  keyPoints: string[];
  frequentInterviewQuestion: string;
}

export const CS_CONCEPTS_LIST: CSConceptCard[] = [
  {
    id: 'os-process-thread',
    subject: 'OS',
    title: 'Process vs Thread & Context Switching',
    summary: 'A process is an executing program instance with its own isolated memory space. A thread is a lightweight execution unit within a process sharing the same address space.',
    keyPoints: [
      'Threads share Code, Data, and Heap, but each thread has its own Stack, Program Counter, and Registers.',
      'Context switching between threads is faster than processes because virtual memory mappings and TLB caches remain intact.',
      'Process termination does not crash others; thread crashes (e.g., segfault) usually terminate the parent process.'
    ],
    frequentInterviewQuestion: 'Why is user-level thread switching faster than kernel-level thread switching?'
  },
  {
    id: 'os-deadlock',
    subject: 'OS',
    title: 'Deadlock: Coffman Conditions & Prevention',
    summary: 'A situation where a set of processes are blocked because each process is holding a resource and waiting for another resource held by someone else.',
    keyPoints: [
      '1. Mutual Exclusion: Resources cannot be shared.',
      '2. Hold and Wait: Process holding at least one resource is waiting for another.',
      '3. No Preemption: Resources cannot be forcibly taken.',
      '4. Circular Wait: P0 waits for P1, P1 waits for P2... Pn waits for P0.',
      'Prevention: Break any one of these 4 conditions (e.g. impose strict global order on resource requests).'
    ],
    frequentInterviewQuestion: 'How does Bankers Algorithm work to guarantee safe state?'
  },
  {
    id: 'dbms-acid',
    subject: 'DBMS',
    title: 'ACID Properties & Isolation Levels',
    summary: 'The bedrock guarantees of transactional database management systems ensuring reliability under concurrent operations and system crashes.',
    keyPoints: [
      'Atomicity: All-or-nothing (handled by Write-Ahead Logging/Undo log).',
      'Consistency: Data adheres to all schema rules and constraints.',
      'Isolation: Concurrent transactions execute as if serial.',
      'Durability: Committed data survives crashes (handled by Redo logs).',
      'Isolation Levels: Read Uncommitted < Read Committed < Repeatable Read < Serializable.'
    ],
    frequentInterviewQuestion: 'What is a Phantom Read and which isolation level prevents it?'
  },
  {
    id: 'dbms-indexing',
    subject: 'DBMS',
    title: 'B-Trees, B+ Trees & Database Indexing',
    summary: 'Indexes allow rapid random and range retrieval of records without scanning the entire disk table.',
    keyPoints: [
      'B+ Trees store data records/pointers exclusively in leaf nodes; internal nodes hold only routing keys.',
      'Leaf nodes in B+ Trees are linked sequentially in a doubly-linked list for ultra-fast range queries (BETWEEN x AND y).',
      'Clustered Index defines the physical sorting order on disk (only 1 per table); Non-clustered uses secondary pointers.'
    ],
    frequentInterviewQuestion: 'Why are B+ Trees preferred over Binary Search Trees or Hash Tables for disk storage?'
  },
  {
    id: 'oop-solid',
    subject: 'OOP',
    title: 'SOLID Principles of Object-Oriented Design',
    summary: 'Five design principles that make software designs more understandable, flexible, and maintainable.',
    keyPoints: [
      'S - Single Responsibility: A class should have one, and only one, reason to change.',
      'O - Open/Closed: Open for extension, closed for modification.',
      'L - Liskov Substitution: Subtypes must be substitutable for their base types without altering correctness.',
      'I - Interface Segregation: Clients should not be forced to depend on interfaces they do not use.',
      'D - Dependency Inversion: Depend on abstractions, not concretions.'
    ],
    frequentInterviewQuestion: 'Can you give a concrete violation example of the Liskov Substitution Principle?'
  },
  {
    id: 'oop-poly-abstract',
    subject: 'OOP',
    title: 'Abstract Class vs Interface & Polymorphism',
    summary: 'Core mechanisms for code reusability, abstraction, and contract definition in modern object-oriented languages.',
    keyPoints: [
      'Abstract Class: Can have constructor, state/instance variables, and method implementations. Represents "IS-A" hierarchy.',
      'Interface: Pure abstraction contract. Represents "CAN-DO" capability. A class can implement multiple interfaces.',
      'Compile-time polymorphism: Method Overloading.',
      'Runtime polymorphism: Method Overriding (resolved via virtual method table / vtable at runtime).'
    ],
    frequentInterviewQuestion: 'When should you choose an abstract class over an interface in system design?'
  },
  {
    id: 'cn-tcp-handshake',
    subject: 'CN',
    title: 'TCP 3-Way Handshake & 4-Way Teardown',
    summary: 'Connection establishment and termination protocol ensuring reliable, sequenced data stream between client and server.',
    keyPoints: [
      'SYN: Client sends SYN with random initial sequence number (ISN_c).',
      'SYN-ACK: Server replies with SYN, its own ISN_s, and ACK = ISN_c + 1.',
      'ACK: Client acknowledges with ACK = ISN_s + 1 (Connection ESTABLISHED).',
      'Teardown (FIN, ACK, FIN, ACK): TIME_WAIT state (2*MSL) ensures lingering packets drain and final ACK reaches server.'
    ],
    frequentInterviewQuestion: 'Why does TCP use a 3-way handshake instead of a 2-way handshake?'
  },
  {
    id: 'cn-osi-layers',
    subject: 'CN',
    title: 'OSI 7 Layers vs TCP/IP Protocol Suite',
    summary: 'Conceptual models standardizing network communication functions without regard to underlying internal structure.',
    keyPoints: [
      'Application (HTTP, DNS, SSH) -> Transport (TCP, UDP with port addressing) -> Network (IP, ICMP with logical IP routing) -> Data Link (Ethernet, MAC frames) -> Physical (bits, signals).',
      'TCP: Connection-oriented, flow control (sliding window), congestion control, ordered delivery.',
      'UDP: Connectionless, lightweight, low-overhead, ideal for real-time video/gaming.'
    ],
    frequentInterviewQuestion: 'What exact steps occur when you type https://google.com into your browser address bar?'
  }
];
