import subprocess
import os
import sys

# Get the list of commits that modified stories.component.tsx
commits_output = subprocess.check_output([
    'git', 'log', '--format=%H', '--', 'frontend/src/components/stories/stories.component.tsx'
]).decode('utf-8').splitlines()

print(f"Found {len(commits_output)} commits to check.")

for commit in commits_output:
    # Get file content for this commit
    try:
        content = subprocess.check_output([
            'git', 'show', f'{commit}:frontend/src/components/stories/stories.component.tsx'
        ])
    except subprocess.CalledProcessError:
        print(f"Skipping {commit}: file not found in commit")
        continue

    # Write to target path
    open('frontend/src/components/stories/stories.component.tsx', 'wb').write(content)
    
    # Run tsc typecheck
    print(f"Checking commit: {commit}...")
    try:
        # Run tsc typecheck in frontend directory
        result = subprocess.run(
            ['npm', 'run', 'typecheck'],
            cwd='frontend',
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            shell=True
        )
        output = (result.stdout + result.stderr).decode('utf-8')
    except Exception as e:
        print(f"Error running typecheck: {e}")
        continue
        
    # Check if there are any errors referencing stories.component.tsx
    stories_errors = [line for line in output.splitlines() if 'stories.component.tsx' in line]
    if not stories_errors:
        print(f"SUCCESS! Commit {commit} has a clean, compiling version of stories.component.tsx!")
        sys.exit(0)
    else:
        print(f"Commit {commit} has {len(stories_errors)} compiler errors in stories.component.tsx.")

print("Could not find any clean commit.")
sys.exit(1)
