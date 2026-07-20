import re

with open('frontend/src/components/stories/stories.component.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I need to fix the topics.map block at line 1718.
# And remove the trailing language dropdown part at line 2154.

# Let's just fix it by finding the start of topics.map and the end of the language dropdown garbage.
start_marker = "{topics.map((topic, index) => ("
end_marker = """                </li>
              ))}
            </ul>
          )}
        </div>
      </div>"""

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    print(f"Found markers at {start_idx} and {end_idx}. Length of broken block: {end_idx + len(end_marker) - start_idx}")
else:
    print("Markers not found!")
    exit(1)
