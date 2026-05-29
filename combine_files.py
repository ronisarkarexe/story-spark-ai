import os

# --- CONFIGURATION ---
PROJECT_DIR = '.'  # Runs in the current directory
OUTPUT_FILE = 'combined_code.txt'

# Directories to completely ignore (saves time and token limits)
IGNORE_DIRS = {
    'node_modules', '.git', 'dist', 'build', '.vscode', '.idea',
    '__pycache__', 'coverage', 'dev-dist', 'public'
}

# File extensions you want to include
ALLOWED_EXTENSIONS = {
    '.ts', '.tsx', '.js', '.jsx', '.json', '.html', '.css', '.py'
}

# Specific files to ignore even if they have an allowed extension
IGNORE_FILES = {
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'
}
# ---------------------

def combine_code():
    print(f"Scanning directory: {os.path.abspath(PROJECT_DIR)}...")
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
        outfile.write("=== COMBINED FILES OUTPUT ===\n")
        
        file_count = 0
        
        for root, dirs, files in os.walk(PROJECT_DIR):
            # Modify dirs in-place to skip ignored directories
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            for file in files:
                if file in IGNORE_FILES:
                    continue
                
                ext = os.path.splitext(file)[1].lower()
                if ext in ALLOWED_EXTENSIONS:
                    filepath = os.path.join(root, file)
                    
                    try:
                        # Read the file
                        with open(filepath, 'r', encoding='utf-8', errors='ignore') as infile:
                            content = infile.read()
                            
                            # Write a clear separator and file path header
                            outfile.write(f"\n\n{'='*60}\n")
                            outfile.write(f"FILE: {filepath}\n")
                            outfile.write(f"{'='*60}\n\n")
                            
                            # Write the actual code content
                            outfile.write(content)
                            outfile.write("\n")
                            
                            file_count += 1
                            print(f"Added: {filepath}")
                            
                    except Exception as e:
                        print(f"Error reading {filepath}: {e}")

    print(f"\nDone! Successfully combined {file_count} files into '{OUTPUT_FILE}'")

if __name__ == "__main__":
    combine_code()