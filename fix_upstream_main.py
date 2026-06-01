import os
import re

def fix_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Strategy: For most files, just keep the HEAD part and remove the upstream part.
    # The regex non-greedily matches from <<<<<<< HEAD to =======, and from ======= to >>>>>>> ...
    
    # Simple regex to remove the markers and keep HEAD content
    # <<<<<<< HEAD\n(HEAD_CONTENT)=======\n(UPSTREAM_CONTENT)>>>>>>> ...
    pattern = re.compile(r'<<<<<<< HEAD\n(.*?)\n=======\n.*?\n>>>>>>> [^\n]+', re.DOTALL)
    
    content = pattern.sub(r'\1', content)

    # Some markers might not have a newline after them if they are at the end
    pattern2 = re.compile(r'<<<<<<< HEAD\n(.*?)\n=======\n.*?>>>>>>> [^\n]+', re.DOTALL)
    content = pattern2.sub(r'\1', content)

    # Fix specific duplicated tags in login.component.tsx
    if 'login.component.tsx' in file_path:
        content = content.replace('''          <form
            className="space-y-5 w-full"
            onSubmit={handleSubmit(onSubmit)}
            >

          {/* Added w-full to the form */}

          <form className="space-y-5 w-full" onSubmit={handleSubmit(onSubmit)}>''', '''          <form className="space-y-5 w-full" onSubmit={handleSubmit(onSubmit)}>''')
          
    # Fix root_layout.component.tsx duplicated </div>
    if 'root_layout.component.tsx' in file_path:
        content = content.replace('''      </Suspense>
    </div>
  );
};


export default RootLayout;
  );
};


export default RootLayout;''', '''      </Suspense>
    </div>
  );
};

export default RootLayout;''')

    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {file_path}")

frontend_dir = r'C:\Users\SURAJ\Desktop\gssoc1\story-spark-ai\frontend\src'
for root, _, files in os.walk(frontend_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.js', '.jsx', '.css')):
            fix_file(os.path.join(root, file))
