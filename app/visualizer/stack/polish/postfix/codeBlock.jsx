'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Postfix Evaluation using Stack ─────────────
const codeExamples = {
  javascript: `// Postfix Evaluation using Stack
function evaluatePostfix(expression){

    let stack=[];

    for(let char of expression){

        if(!isNaN(char)){

            stack.push(
                parseInt(char)
            );
        }
        else{

            let b=stack.pop();
            let a=stack.pop();

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
                    Math.floor(a/b)
                    );
                    break;
            }
        }
    }

    return stack.pop();
}

// Usage
console.log(
evaluatePostfix(
"23*5+"
));`,

  python: `# Postfix Evaluation using Stack

def evaluate_postfix(
        expression):

    stack=[]

    for char in expression:

        if char.isdigit():

            stack.append(
                int(char)
            )

        else:

            b=stack.pop()
            a=stack.pop()

            if char=='+':
                stack.append(a+b)

            elif char=='-':
                stack.append(a-b)

            elif char=='*':
                stack.append(a*b)

            elif char=='/':
                stack.append(a//b)

    return stack.pop()


print(
evaluate_postfix(
"23*5+"
))`,

  java: `// Postfix Evaluation using Stack
import java.util.Stack;

public class PostfixEvaluator{

    static int evaluatePostfix(
            String expression){

        Stack<Integer>
        stack=
        new Stack<>();

        for(char c:
            expression
            .toCharArray()){

            if(
            Character
            .isDigit(c)
            ){

                stack.push(
                c-'0'
                );
            }

            else{

                int b=
                stack.pop();

                int a=
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
        evaluatePostfix(
        "23*5+"
        ));
    }
}`,

  c: `// Postfix Evaluation using Stack
#include<stdio.h>
#include<ctype.h>

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

int evaluatePostfix(
        char* expression){

    Stack s={.top=-1};

    for(
        int i=0;
        expression[i];
        i++
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

            int b=
            pop(&s);

            int a=
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
    evaluatePostfix(
    "23*5+"
    )
    );

    return 0;
}`,

  cpp: `// Postfix Evaluation using Stack
#include<iostream>
#include<stack>

using namespace std;

int evaluatePostfix(
        string expression){

    stack<int> st;

    for(
        char c:
        expression
    ){

        if(
        isdigit(c)
        ){

            st.push(
            c-'0'
            );
        }

        else{

            int b=
            st.top();

            st.pop();

            int a=
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
    <<evaluatePostfix(
    "23*5+"
    );

    return 0;
}`
};

// ─── Filenames ───────────────────────────
const fileNames = {
    javascript:'postfix.js',
    python:'postfix.py',
    java:'PostfixEvaluator.java',
    c:'postfix.c',
    cpp:'postfix.cpp'
};

// ─── Component ───────────────────────────
const CodeBlock = () => (
    <CodeBlockUI
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default CodeBlock;