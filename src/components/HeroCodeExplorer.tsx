import { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface SnippetTab {
  id: string;
  label: string;
  filename: string;
  topic: string;
  code: string;
  note: string;
}

const SNIPPETS: SnippetTab[] = [
  {
    id: 'python',
    label: 'Python',
    filename: 'binary_search.py',
    topic: 'Algorithms & Complexity',
    code: `def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    note: 'O(log n) time · O(1) space'
  },
  {
    id: 'cpp',
    label: 'C++',
    filename: 'raii_buffer.cpp',
    topic: 'OOP & Memory Safety',
    code: `class StudyGuide {
private:
    std::string title_;
    int modules_;
public:
    StudyGuide(std::string title, int modules)
        : title_(std::move(title)), modules_(modules) {}

    const std::string& title() const { return title_; }
    int modules() const { return modules_; }
};`,
    note: 'C++17 · Member Initializer List'
  },
  {
    id: 'c',
    label: 'C',
    filename: 'pointer_swap.c',
    topic: 'Pointers & Memory',
    code: `#include <stdio.h>

void swap_values(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int x = 12, y = 48;
    swap_values(&x, &y);
    printf("x=%d y=%d\\n", x, y);
    return 0;
}`,
    note: 'C11 · Pass-by-pointer'
  },
  {
    id: 'js',
    label: 'JavaScript',
    filename: 'debounce.js',
    topic: 'Web Engineering',
    code: `export function debounce(fn, delayMs = 200) {
  let timerId = null;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn(...args);
    }, delayMs);
  };
}`,
    note: 'ES2022 · Closure & Event Control'
  }
];

export function HeroCodeExplorer() {
  const [activeId, setActiveId] = useState<string>('python');
  const [copied, setCopied] = useState(false);

  const current = SNIPPETS.find((s) => s.id === activeId) || SNIPPETS[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="min-w-0 w-full rounded-xl border border-white/10 bg-[#090F1C] shadow-2xl overflow-hidden">
      {/* Window Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 border-b border-white/[0.08] bg-[#111827] px-4 py-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[#9CA3AF] min-w-0">
          <Terminal className="h-4 w-4 text-[#06B6D4] shrink-0" />
          <span className="truncate">{current.filename}</span>
        </div>

        <div className="grid grid-cols-4 sm:flex items-center gap-1 rounded-lg bg-[#030712] p-1">
          {SNIPPETS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveId(tab.id);
                setCopied(false);
              }}
              className={`rounded-md px-2.5 py-1.5 sm:py-1 text-xs font-medium transition-colors whitespace-nowrap text-center ${
                activeId === tab.id
                  ? 'bg-[#6366F1] text-white'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Code Viewport */}
      <div className="p-4 sm:p-5 overflow-x-auto">
        <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-[#E5E7EB]">
          <code>{current.code}</code>
        </pre>
      </div>

      {/* Footer Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 border-t border-white/[0.08] bg-[#090F1C] px-4 py-2.5 text-xs text-[#9CA3AF]">
        <span className="font-mono truncate">
          {current.topic} <span aria-hidden="true">&middot;</span> {current.note}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-[#D1D5DB] hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#10B981]" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
