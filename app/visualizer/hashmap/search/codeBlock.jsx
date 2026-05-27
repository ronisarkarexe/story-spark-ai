"use client";
import { useState } from "react";

const codes = {
  JavaScript: `// HashMap Search in JavaScript
const hashMap = new Map();

// Insert some entries
hashMap.set("name", "Alice");
hashMap.set("age", 25);
hashMap.set("city", "New York");

// Search for a key
console.log(hashMap.get("name")); // Alice
console.log(hashMap.get("age"));  // 25

// Check if key exists
console.log(hashMap.has("city")); // true
console.log(hashMap.has("country")); // false`,

  Python: `# HashMap Search in Python
hash_map = {
    "name": "Alice",
    "age": 25,
    "city": "New York"
}

# Search for a key
print(hash_map.get("name"))  # Alice
print(hash_map.get("age"))   # 25

# Safe search with default
print(hash_map.get("country", "Not found"))  # Not found

# Check if key exists
print("city" in hash_map)  # True`,

  Java: `// HashMap Search in Java
import java.util.HashMap;

HashMap<String, Object> hashMap = new HashMap<>();
hashMap.put("name", "Alice");
hashMap.put("age", 25);
hashMap.put("city", "New York");

// Search for a key
System.out.println(hashMap.get("name")); // Alice
System.out.println(hashMap.get("age"));  // 25

// Check if key exists
System.out.println(hashMap.containsKey("city"));    // true
System.out.println(hashMap.containsKey("country")); // false`,

  C: `// HashMap Search in C (manual implementation)
#include <stdio.h>
#include <string.h>
#define SIZE 8

typedef struct Node {
  char key[50];
  int value;
  struct Node* next;
} Node;

Node* table[SIZE];

int hashFunction(char* key) {
  int hash = 0;
  for (int i = 0; key[i]; i++)
    hash = (hash + key[i]) % SIZE;
  return hash;
}

int search(char* key) {
  int index = hashFunction(key);
  Node* curr = table[index];
  while (curr) {
    if (strcmp(curr->key, key) == 0) {
      printf("Found: %s = %d\\n", key, curr->value);
      return curr->value;
    }
    curr = curr->next;
  }
  printf("Key not found: %s\\n", key);
  return -1;
}`,
};

const CodeBlock = () => {
  const [activeTab, setActiveTab] = useState("JavaScript");

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden">
        <div className="flex border-b border-[#e5e7eb] dark:border-[#222]">
          {Object.keys(codes).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === lang
                  ? "text-[#a435f0] border-b-2 border-[#a435f0]"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
        <pre className="p-6 overflow-x-auto text-sm text-[#374151] dark:text-[#d1d5db] bg-[#f9fafb] dark:bg-[#0a0a0a]">
          <code>{codes[activeTab]}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;