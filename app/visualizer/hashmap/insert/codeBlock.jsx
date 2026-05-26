"use client";
import { useState } from "react";

const codes = {
  JavaScript: `// HashMap Insert in JavaScript
const hashMap = new Map();

// Insert key-value pairs
hashMap.set("name", "Alice");
hashMap.set("age", 25);
hashMap.set("city", "New York");

// Access value
console.log(hashMap.get("name")); // Alice

// Check if key exists
console.log(hashMap.has("age")); // true`,

  Python: `# HashMap Insert in Python
hash_map = {}

# Insert key-value pairs
hash_map["name"] = "Alice"
hash_map["age"] = 25
hash_map["city"] = "New York"

# Access value
print(hash_map["name"])  # Alice

# Check if key exists
print("age" in hash_map)  # True`,

  Java: `// HashMap Insert in Java
import java.util.HashMap;

HashMap<String, Object> hashMap = new HashMap<>();

// Insert key-value pairs
hashMap.put("name", "Alice");
hashMap.put("age", 25);
hashMap.put("city", "New York");

// Access value
System.out.println(hashMap.get("name")); // Alice

// Check if key exists
System.out.println(hashMap.containsKey("age")); // true`,

  C: `// HashMap in C (manual implementation)
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

void insert(char* key, int value) {
  int index = hashFunction(key);
  Node* newNode = malloc(sizeof(Node));
  strcpy(newNode->key, key);
  newNode->value = value;
  newNode->next = table[index];
  table[index] = newNode;
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