'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Prefix Evaluation using Stack ──────────────
const codeExamples = {
  javascript: `// Prefix Evaluation using Stack
function evaluatePrefix(expression){

    let stack=[];

    for(
        let i=
        expression.length-1;
        i>=0;
        i--
    ){

        let char=
        expression[i];

        if(
        !isNaN(char)
        ){

            stack.push(
                parseInt(char)
            );
        }

        else{

            let a=
            stack.pop();

            let b=
            stack.pop();

            switch(char){

                case '+':
                    stack.push(a+b);
                    break;

                case '-':
                    stack.push(a-b);
                    break;

                case '*':
                    stack.push(a*b);
                    break;

                case '/':
                    stack.push(
                    Math.floor(
                    a/b
                    ));
                    break;
            }
        }
    }

    return stack.pop();
}

// Usage
console.log(
evaluatePrefix(
"+*235"
));`,

  python: `# Prefix Evaluation using Stack

def evaluate_prefix(
        expression):

    stack=[]

    for char in reversed(
        expression
    ):

        if char.isdigit():

            stack.append(
            int(char)
            )

        else:

            a=stack.pop()
            b=stack.pop()

            if char=='+':
                stack.append(
                a+b
                )

            elif char=='-':
                stack.append(
                a-b
                )

            elif char=='*':
                stack.append(
                a*b
                )

            elif char=='/':
                stack.append(
                a//b
                )

    return stack.pop()


print(
evaluate_prefix(
"+*235"
))`,

  java: `// Prefix Evaluation using Stack
import java.util.Stack;

public class PrefixEvaluator{

    static int evaluatePrefix(
            String expression){

        Stack<Integer>
        stack=
        new Stack<>();

        for(
        int i=
        expression.length()-1;
        i>=0;
        i--
        ){

            char c=
            expression.charAt(
            i
            );

            if(
            Character
            .isDigit(c)
            ){

                stack.push(
                c-'0'
                );
            }

            else{

                int a=
                stack.pop();

                int b=
                stack.pop();

                switch(c){

                    case '+':
                    stack.push(a+b);
                    break;

                    case '-':
                    stack.push(a-b);
                    break;

                    case '*':
                    stack.push(a*b);
                    break;

                    case '/':
                    stack.push(a/b);
                    break;
                }
            }
        }

        return stack.pop();
    }

    public static void main(
            String args[]){

        System.out.println(
        evaluatePrefix(
        "+*235"
        ));
    }
}`,

  c: `// Prefix Evaluation using Stack
#include<stdio.h>
#include<ctype.h>
#include<string.h>

#define MAX 100

typedef struct{

    int data[MAX];
    int top;

}Stack;

void push(
        Stack* s,
        int value){

    s->data[
    ++s->top
    ]=value;
}

int pop(
        Stack* s){

    return s->data[
    s->top--
    ];
}

int evaluatePrefix(
        char* expression){

    Stack s=
    {.top=-1};

    int length=
    strlen(
    expression
    );

    for(
        int i=
        length-1;
        i>=0;
        i--
    ){

        if(
        isdigit(
        expression[i]
        )){

            push(
            &s,
            expression[i]-'0'
            );
        }

        else{

            int a=
            pop(&s);

            int b=
            pop(&s);

            switch(
            expression[i]
            ){

                case '+':
                push(&s,a+b);
                break;

                case '-':
                push(&s,a-b);
                break;

                case '*':
                push(&s,a*b);
                break;

                case '/':
                push(&s,a/b);
                break;
            }
        }
    }

    return pop(&s);
}

int main(){

    printf(
    "%d",
    evaluatePrefix(
    "+*235"
    ));

    return 0;
}`,

  cpp: `// Prefix Evaluation using Stack
#include<iostream>
#include<stack>

using namespace std;

int evaluatePrefix(
        string expression){

    stack<int> st;

    for(
        auto i=
        expression.rbegin();
        i!=
        expression.rend();
        i++
    ){

        char c=*i;

        if(
        isdigit(c)
        ){

            st.push(
            c-'0'
            );
        }

        else{

            int a=
            st.top();

            st.pop();

            int b=
            st.top();

            st.pop();

            switch(c){

                case '+':
                st.push(a+b);
                break;

                case '-':
                st.push(a-b);
                break;

                case '*':
                st.push(a*b);
                break;

                case '/':
                st.push(a/b);
                break;
            }
        }
    }

    return st.top();
}

int main(){

    cout
    <<evaluatePrefix(
    "+*235"
    );

    return 0;
}`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'prefix.js',
    python:'prefix.py',
    java:'PrefixEvaluator.java',
    c:'prefix.c',
    cpp:'prefix.cpp'
};

// ─── Component ─────────────────────────────
const CodeBlock = () => (
    <CodeBlockUI
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default CodeBlock;