import type { CodingCategory } from '../types';

export interface CurriculumTopic {
  title: string;
  explanation: string;
  syntaxLabel: string;
  code: string;
  realWorldUseCase: string;
  commonMistake: string;
}

export interface CurriculumModule {
  slug: string;
  category: CodingCategory;
  title: string;
  shortSummary: string;
  learningObjectives: string[];
  topics: CurriculumTopic[];
  faqs: Array<{ q: string; a: string }>;
}

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    slug: 'python-programming',
    category: 'Python',
    title: 'Python Programming: Core Syntax to Object-Oriented Design',
    shortSummary:
      'Master Python from variables, operators, and control flow through functions, collections, OOP, file handling, and safe exception management.',
    learningObjectives: [
      'Understand dynamic variable binding and Python built-in scalar and collection types.',
      'Write clean conditional logic, deterministic loops, and reusable typed functions.',
      'Model domain entities using classes, constructors, and encapsulation.',
      'Safely read/write files using context managers and handle runtime errors explicitly.'
    ],
    topics: [
      {
        title: 'Introduction to Python, Variables & Data Types',
        explanation:
          'Python is a readable, interpreted general-purpose language. Variables act as name references bound to objects in memory. Core primitive types include int (arbitrary precision), float, bool, and immutable str.',
        syntaxLabel: 'Python 3',
        code: `course_title = "Computer Science 101"
enrolled_students = 42
completion_rate = 0.875
is_active = True

print(f"{course_title} | {enrolled_students} learners | {completion_rate:.1%}")`,
        realWorldUseCase:
          'Automation scripts, backend web services, data processing pipelines, and rapid algorithm prototyping.',
        commonMistake:
          'Assuming "10" + 5 coerces automatically like JavaScript; Python raises a TypeError unless you explicitly cast with int("10").'
      },
      {
        title: 'Operators, Conditionals & Loops',
        explanation:
          'Python uses indentation (4 spaces) to define block scope. Use if/elif/else for branching, for loops to iterate sequences or ranges, and while loops when iteration depends on state.',
        syntaxLabel: 'Python 3',
        code: `def grade_score(score: int) -> str:
    if score >= 90:
        return "A"
    elif score >= 75:
        return "B"
    elif score >= 60:
        return "C"
    return "Needs Review"

for attempt, mark in enumerate([68, 82, 94], start=1):
    print(f"Attempt {attempt}: {grade_score(mark)}")`,
        realWorldUseCase:
          'Validating input thresholds, batch-processing student records, and paginating API responses.',
        commonMistake:
          'Using integer division / when floor division // is required, or mutating a list while iterating directly over it.'
      },
      {
        title: 'Functions, Lists, Tuples, Dictionaries & Sets',
        explanation:
          'Lists are mutable ordered sequences; tuples are immutable fixed records; sets store unique hashable items with O(1) average lookup; dictionaries map keys to values.',
        syntaxLabel: 'Python 3',
        code: `def summarize_topics(topics: list[str], scores: dict[str, int]) -> tuple[int, float]:
    unique_topics = set(topics)
    total = sum(scores.get(t, 0) for t in unique_topics)
    avg = total / len(unique_topics) if unique_topics else 0.0
    return len(unique_topics), avg`,
        realWorldUseCase:
          'Indexing configuration maps, deduplicating log entries, and returning structured multi-value function results.',
        commonMistake:
          'Passing a mutable default argument like def add_item(items=[]): instead of items: list[str] | None = None.'
      },
      {
        title: 'Object-Oriented Programming, File Handling & Exceptions',
        explanation:
          'Classes combine data attributes and methods. Always open files using with open(...) context managers so resources release deterministically, and catch specific exceptions instead of bare except.',
        syntaxLabel: 'Python 3',
        code: `from pathlib import Path

class StudyRecord:
    def __init__(self, topic: str, minutes: int) -> None:
        self.topic = topic
        self.minutes = minutes

def load_syllabus(file_path: str) -> str:
    try:
        return Path(file_path).read_text(encoding="utf-8")
    except FileNotFoundError:
        return "Syllabus file is not available yet."`,
        realWorldUseCase:
          'Building maintainable CLI utilities, parsing CSV/JSON datasets, and encapsulating business entities.',
        commonMistake:
          'Using bare except: blocks which swallow KeyboardInterrupt and hide genuine logic bugs.'
      }
    ],
    faqs: [
      {
        q: 'Is Python a good first programming language for school and college students?',
        a: 'Yes. Python minimizes syntactic boilerplate so beginners can focus on variables, control flow, functions, and problem decomposition right away.'
      },
      {
        q: 'When should I choose a tuple instead of a list in Python?',
        a: 'Use a tuple for fixed-structure records that should not change after creation (such as coordinates or database rows) and a list for homogeneous collections that grow or shrink.'
      }
    ]
  },
  {
    slug: 'c-programming',
    category: 'C Programming',
    title: 'C Programming: Memory Model, Pointers & Structures',
    shortSummary:
      'Build rock-solid systems foundations in C: compilation, scalar types, arrays, functions, pointer arithmetic, and struct memory layout.',
    learningObjectives: [
      'Trace the four stages of C compilation from preprocessor to executable binary.',
      'Pass arrays safely to functions by pairing pointers with explicit element counts.',
      'Understand stack vs. heap memory, pointer dereferencing, and malloc/free discipline.',
      'Model structured records cleanly with typedef struct and const pointers.'
    ],
    topics: [
      {
        title: 'Introduction to C, Data Types & Operators',
        explanation:
          'C gives programmers direct control over memory and CPU instructions. Fundamental types include int, char, float, double, and size_t for array sizes and byte counts.',
        syntaxLabel: 'C11',
        code: `#include <stdio.h>

int main(void) {
    int modules = 9;
    double progress = 75.5;
    printf("Completed %d modules (%.1f%%)\\n", modules, progress);
    return 0;
}`,
        realWorldUseCase:
          'Operating system kernels, embedded microcontrollers, compilers, and high-throughput database engines.',
        commonMistake:
          'Reading uninitialized local variables on the stack, which contain indeterminate garbage values.'
      },
      {
        title: 'Conditionals, Loops, Arrays & Functions',
        explanation:
          'Arrays store elements contiguously in memory. Because C decays arrays into pointers when passed to functions, always pass the array length as a separate size_t parameter.',
        syntaxLabel: 'C11',
        code: `#include <stddef.h>

int find_max(const int *arr, size_t len) {
    int max_val = arr[0];
    for (size_t i = 1; i < len; i++) {
        if (arr[i] > max_val) {
            max_val = arr[i];
        }
    }
    return max_val;
}`,
        realWorldUseCase:
          'Signal processing buffers, sensor telemetry arrays, and low-overhead numeric loops.',
        commonMistake:
          'Writing past index len - 1 (buffer overflow), causing undefined behavior or memory corruption.'
      },
      {
        title: 'Pointers & Structures',
        explanation:
          'A pointer variable stores a memory address (& obtains an address; * dereferences it). Structures combine related fields under one type name and use -> when accessed through a pointer.',
        syntaxLabel: 'C11',
        code: `#include <stdio.h>

typedef struct {
    int id;
    char section;
} Learner;

void print_learner(const Learner *l) {
    if (!l) return;
    printf("Learner #%d (Section %c)\\n", l->id, l->section);
}`,
        realWorldUseCase:
          'Implementing linked lists, device driver descriptors, and network packet headers.',
        commonMistake:
          'Returning a pointer to a local stack variable after the function returns (dangling pointer).'
      }
    ],
    faqs: [
      {
        q: 'Why do computer science programs still teach C first?',
        a: 'C reveals how variables, arrays, strings, call stacks, and heap allocation actually work in hardware memory—knowledge that transfers to every higher-level language.'
      },
      {
        q: 'What compiler flags should beginners enable when compiling C?',
        a: 'Compile with gcc -Wall -Wextra -std=c11 so the compiler warns about uninitialized variables, signed/unsigned mismatches, and missing return values.'
      }
    ]
  },
  {
    slug: 'cpp-object-oriented',
    category: 'C++',
    title: 'C++ Object-Oriented Programming & Polymorphism',
    shortSummary:
      'Learn C++ data types, references, classes, member initializer constructors, inheritance hierarchies, and runtime virtual polymorphism.',
    learningObjectives: [
      'Distinguish pass-by-value, pass-by-const-reference, and pointer semantics.',
      'Design encapsulated classes using member initializer lists and RAII principles.',
      'Build clean inheritance hierarchies with virtual destructors and override safety.'
    ],
    topics: [
      {
        title: 'Introduction to C++, Data Types & Functions',
        explanation:
          'C++ combines C-level hardware efficiency with strong type abstraction. Prefer std::string and std::vector over raw C arrays, and pass large objects by const reference (const T&) to avoid unnecessary copies.',
        syntaxLabel: 'C++17',
        code: `#include <iostream>
#include <string>

void announce(const std::string& topic, int level) {
    std::cout << topic << " [Level " << level << "]\\n";
}`,
        realWorldUseCase:
          'Competitive programming, game engines, high-frequency trading systems, and desktop compilers.',
        commonMistake:
          'Passing large std::vector or std::string objects by value inside tight loops, causing repeated heap allocations.'
      },
      {
        title: 'Classes, Objects & Constructors',
        explanation:
          'Constructors initialize member variables directly via member initializer lists before the constructor body executes. Keep internal fields private and expose const-qualified getters.',
        syntaxLabel: 'C++17',
        code: `class NoteCard {
private:
    std::string title_;
    int minutes_;
public:
    NoteCard(std::string title, int minutes)
        : title_(std::move(title)), minutes_(minutes) {}

    const std::string& title() const { return title_; }
    int minutes() const { return minutes_; }
};`,
        realWorldUseCase:
          'Designing safe resource wrappers (files, sockets, mutex locks) with deterministic cleanup.',
        commonMistake:
          'Omitting const on getter methods, preventing callers with const references from reading values.'
      },
      {
        title: 'Inheritance & Polymorphism',
        explanation:
          'Runtime polymorphism uses base class pointers or references pointing to derived objects. Always mark base class destructors virtual and mark overridden methods with override.',
        syntaxLabel: 'C++17',
        code: `class Resource {
public:
    virtual ~Resource() = default;
    virtual std::string kind() const = 0;
};

class PdfResource : public Resource {
public:
    std::string kind() const override { return "PDF Guide"; }
};`,
        realWorldUseCase:
          'Plugin architectures, UI widget trees, and simulation entity hierarchies.',
        commonMistake:
          'Forgetting virtual ~Resource() on a polymorphic base class, causing partial destruction when deleting via a base pointer.'
      }
    ],
    faqs: [
      {
        q: 'What is the difference between overloading and overriding in C++?',
        a: 'Function overloading defines multiple functions with the same name but different parameter lists in the same scope. Overriding replaces a base class virtual method in a derived class using the exact same signature.'
      }
    ]
  },
  {
    slug: 'web-development',
    category: 'Web Development',
    title: 'Web Development: Semantic HTML, CSS Layout & JavaScript DOM',
    shortSummary:
      'Build accessible, responsive websites using semantic HTML5, modern CSS Flexbox/Grid, ES6+ JavaScript, and safe DOM manipulation.',
    learningObjectives: [
      'Structure web documents semantically for screen readers and search engine crawlers.',
      'Compose fluid, mobile-first layouts using the CSS box model, Flexbox, and Grid.',
      'Handle browser events cleanly and update the DOM without introducing XSS risks.'
    ],
    topics: [
      {
        title: 'HTML Fundamentals & Accessibility',
        explanation:
          'HTML defines document meaning. Pair landmark elements (<header>, <nav>, <main>, <article>, <footer>) with one clear <h1> per page and explicit form labels.',
        syntaxLabel: 'HTML5',
        code: `<main>
  <article aria-labelledby="note-heading">
    <h1 id="note-heading">Semantic HTML Foundations</h1>
    <p>Meaningful tags improve keyboard navigation and SEO indexing.</p>
  </article>
</main>`,
        realWorldUseCase:
          'Accessible web applications, documentation portals, and search-engine-optimized publishing.',
        commonMistake:
          'Using clickable <div> elements instead of native <button> or <a> tags, breaking keyboard focus and screen readers.'
      },
      {
        title: 'CSS Fundamentals & Responsive Web Design',
        explanation:
          'Set box-sizing: border-box so element widths include padding and borders. Combine Flexbox for navbars/toolbars with CSS Grid for multi-column cards and clamp() for fluid typography.',
        syntaxLabel: 'CSS3',
        code: `.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1.5rem;
}

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; }
}`,
        realWorldUseCase:
          'Building layouts that adapt seamlessly across smartphones, tablets, laptops, and 4K displays.',
        commonMistake:
          'Hardcoding fixed pixel widths (width: 1200px) on containers, causing horizontal scrollbars on mobile.'
      },
      {
        title: 'JavaScript Fundamentals & Safe DOM Manipulation',
        explanation:
          'Use const and let, attach listeners via addEventListener, and always sanitize or render user-provided strings via textContent instead of innerHTML.',
        syntaxLabel: 'JavaScript ES2022',
        code: `const searchInput = document.querySelector("#note-search");
const countLabel = document.querySelector("#result-count");

if (searchInput && countLabel) {
  searchInput.addEventListener("input", (event) => {
    const query = event.target.value.trim();
    countLabel.textContent = query ? \`Filtering: \${query}\` : "Showing all notes";
  });
}`,
        realWorldUseCase:
          'Client-side filtering, form validation, interactive calculators, and progressive enhancement.',
        commonMistake:
          'Injecting user input into element.innerHTML, creating Cross-Site Scripting (XSS) vulnerabilities.'
      }
    ],
    faqs: [
      {
        q: 'When should I use CSS Flexbox vs. CSS Grid?',
        a: 'Use Flexbox for one-dimensional alignment (a row of buttons or navigation links) and CSS Grid for two-dimensional page structures with rows and columns.'
      }
    ]
  },
  {
    slug: 'computer-science-fundamentals',
    category: 'Computer Science Fundamentals',
    title: 'Computer Science Core: DSA, OS, Databases & Networks',
    shortSummary:
      'Connect software theory to production engineering across Data Structures, Algorithms, Operating Systems, Relational Databases, and TCP/IP.',
    learningObjectives: [
      'Analyze algorithm efficiency using Big-O time and space complexity.',
      'Understand process vs. thread concurrency, scheduling, and deadlock prevention.',
      'Apply relational database normalization (1NF–3NF) and write clear SQL queries.',
      'Trace how DNS, TCP handshakes, TLS, and HTTP status codes power the web.'
    ],
    topics: [
      {
        title: 'Data Structures & Algorithms',
        explanation:
          'Choosing the right data structure determines runtime scalability. Arrays offer O(1) random access; hash maps provide O(1) average lookup; balanced trees guarantee O(log n) ordered operations.',
        syntaxLabel: 'TypeScript',
        code: `function binarySearch(sorted: number[], target: number): number {
  let lo = 0;
  let hi = sorted.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (sorted[mid] === target) return mid;
    if (sorted[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
        realWorldUseCase:
          'Database B-tree indexing, search autocomplete, route shortest-path calculation, and technical interviews.',
        commonMistake:
          'Applying binary search to an unsorted array or computing (lo + hi) / 2 without integer floor/overflow safety.'
      },
      {
        title: 'Operating Systems & Database Fundamentals',
        explanation:
          'Operating systems isolate processes with virtual memory while threads share address space inside a process. Relational databases organize normalized tables connected by primary and foreign keys under ACID guarantees.',
        syntaxLabel: 'SQL',
        code: `SELECT language, COUNT(*) AS published_count
FROM coding_notes
WHERE is_published = TRUE
GROUP BY language
ORDER BY published_count DESC;`,
        realWorldUseCase:
          'Designing concurrent backend servers, preventing race conditions, and structuring consistent application schemas.',
        commonMistake:
          'Storing comma-separated values in a single column (violating 1NF) instead of using a normalized join table.'
      },
      {
        title: 'Computer Networks & Software Development Fundamentals',
        explanation:
          'A browser request resolves a hostname via DNS, opens a reliable TCP connection, negotiates TLS encryption, and exchanges structured HTTP requests and responses (2xx success, 4xx client error, 5xx server error).',
        syntaxLabel: 'HTTP',
        code: `GET /coding-notes HTTP/1.1
Host: shortstudy.example
Accept: text/html,application/xhtml+xml`,
        realWorldUseCase:
          'Debugging API latency, configuring caching headers, and securing client-server communication.',
        commonMistake:
          'Confusing authentication (401 Unauthorized) with missing permissions (403 Forbidden) in REST APIs.'
      }
    ],
    faqs: [
      {
        q: 'Why is Big-O notation independent of CPU clock speed?',
        a: 'Big-O measures how operation counts scale relative to input size n rather than wall-clock milliseconds on a specific machine, making algorithmic comparisons portable.'
      }
    ]
  }
];
