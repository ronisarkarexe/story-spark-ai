"use client";
import { useState } from "react";

const codes = {
  JavaScript: `// HashMap Delete in JavaScript
const hashMap = new Map();

// Insert some entries
hashMap.set("name", "Alice");
hashMap.set("age", 25);
hashMap.set("city", "New York");

// Delete a key
hashMap.delete("age");

// Verify deletion
console.log(hashMap.has("age")); // false
console.log(hashMap.size); // 2`,

  Python: `# HashMap Delete in Python
hash_map = {
    "name": "Alice",
    "age": 25,
    "city": "New York"
}

# Delete a key
del hash_map["age"]

# Or use pop() with default
hash_map.pop("city", None)

# Verify deletion
print("age" in hash_map)  # False
print(hash_map)  # {"name": "Alice"}`,

  Java: `// HashMap Delete in Java
import java.util.HashMap;

HashMap<String, Object> hashMap = new HashMap<>();
hashMap.put("name", "Alice");
hashMap.put("age", 25);
hashMap.put("city", "New York");

// Delete a key
hashMap.remove("age");

// Verify deletion
System.out.println(hashMap.containsKey("age")); // false
System.out.println(hashMap.size()); // 2`,

  C: `// HashMap Delete in C (manual implementation)
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
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

void deleteKey(char* key) {
  int index = hashFunction(key);
  Node* curr = table[index];
  Node* prev = NULL;
  while (curr) {
    if (strcmp(curr->key, key) == 0) {
      if (prev) prev->next = curr->next;
      else table[index] = curr->next;
      free(curr);
      printf("Deleted key: %s\\n", key);
      return;
    }
    prev = curr;
    curr = curr->next;
  }
  printf("Key not found: %s\\n", key);
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