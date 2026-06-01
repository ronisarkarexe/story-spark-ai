import os
import glob

files_to_check = [
    "frontend/src/components/footer/contributors.tsx",
    "frontend/src/components/help_center/setup_guide/setup_guide.component.tsx",
    "frontend/src/components/home/feature/feature.component.tsx",
    "frontend/src/components/home/recommended_writers/recommended_writers.component.tsx",
    "frontend/src/components/signup/signup.component.tsx",
    "frontend/src/components/stories/stories.view.component.tsx",
    "frontend/src/components/top_header/top_header.component.tsx",
    "frontend/src/hooks/useSpeechSynthesis.ts"
]

for file_path in files_to_check:
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    in_conflict = False
    conflict_block = []
    
    print(f"\n--- Conflicts in {file_path} ---")
    for i, line in enumerate(lines):
        if line.startswith("<<<<<<<"):
            in_conflict = True
            conflict_block = []
            
        if in_conflict:
            conflict_block.append(f"{i+1}: {line.strip()}")
            
        if line.startswith(">>>>>>>"):
            in_conflict = False
            for c in conflict_block:
                print(c)
            print("-" * 20)
