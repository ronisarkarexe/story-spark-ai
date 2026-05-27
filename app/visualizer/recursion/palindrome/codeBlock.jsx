"use client";
import React from "react";
import CodeBlock from "@/app/components/ui/CodeBlock";

const palindromeCode = {
  javascript: `// String Palindrome Check in JavaScript
function isPalindrome(i, str) {
  // Base case: crossed middle index
  if (i >= str.length / 2) {
    return true;
  }
  // Mismatch case
  if (str[i] !== str[str.length - 1 - i]) {
    return false;
  }
  // Recursive case
  return isPalindrome(i + 1, str);
}

// Example call:
const word = "radar";
const result = isPalindrome(0, word); // Returns true
console.log(result);`,

  python: `# String Palindrome Check in Python
def is_palindrome(i, string):
    # Base case
    if i >= len(string) // 2:
        return True
    # Mismatch case
    if string[i] != string[len(string) - 1 - i]:
        return False
    # Recursive case
    return is_palindrome(i + 1, string)

# Example call:
word = "radar"
result = is_palindrome(0, word) # Returns True
print(result)`,

  java: `// String Palindrome Check in Java
public class PalindromeCheck {
    public static boolean isPalindrome(int i, String str) {
        // Base case
        if (i >= str.length() / 2) {
            return true;
        }
        // Mismatch case
        if (str.charAt(i) != str.charAt(str.length() - 1 - i)) {
            return false;
        }
        // Recursive case
        return isPalindrome(i + 1, str);
    }

    public static void main(String[] args) {
        String word = "radar";
        boolean result = isPalindrome(0, word); // Returns true
        System.out.println(result);
    }
}`,

  c: `// String Palindrome Check in C
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

bool isPalindrome(int i, char str[]) {
    int len = strlen(str);
    // Base case
    if (i >= len / 2) {
        return true;
    }
    // Mismatch case
    if (str[i] != str[len - 1 - i]) {
        return false;
    }
    // Recursive case
    return isPalindrome(i + 1, str);
}

int main() {
    char word[] = "radar";
    bool result = isPalindrome(0, word);
    printf("%s\\n", result ? "true" : "false");
    return 0;
}`,

  cpp: `// String Palindrome Check in C++
#include <iostream>
#include <string>

bool isPalindrome(int i, const std::string& str) {
    // Base case
    if (i >= str.length() / 2) {
        return true;
    }
    // Mismatch case
    if (str[i] != str[str.length() - 1 - i]) {
        return false;
    }
    // Recursive case
    return isPalindrome(i + 1, str);
}

int main() {
    std::string word = "radar";
    bool result = isPalindrome(0, word);
    std::cout << (result ? "true" : "false") << std::endl;
    return 0;
}`,
};

const fileNames = {
  javascript: "palindrome.js",
  python: "palindrome_check.py",
  java: "PalindromeCheck.java",
  c: "palindrome.c",
  cpp: "palindrome.cpp",
};

const PalindromeCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={palindromeCode}
    fileNames={fileNames}
  />
);

export default PalindromeCode;
