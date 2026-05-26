'use client';
import { useState } from 'react';
import usePlayback from '@/app/hooks/usePlayback';
import LinearMemoryControls from '@/app/components/ui/LinearMemoryControls';

const PushPop = ({ stack, setStack, isAnimating, setIsAnimating, message, setMessage, operation, setOperation, extraActions, stackLimit, speed: parentSpeed, setSpeed: parentSetSpeed }) => {
  const [inputValue, setInputValue] = useState('');
  const localPlayback = usePlayback(1);
  const speed = parentSpeed !== undefined ? parentSpeed : localPlayback.speed;
  const setSpeed = parentSetSpeed !== undefined ? parentSetSpeed : localPlayback.setSpeed;

  // Push operation
  const push = () => {
    if (stackLimit && stack.length >= stackLimit) {
      setMessage("Stack is full! Cannot push more items.");
      return;
    }
    if (!inputValue.trim()) {
      setMessage('Please enter a value');
      return;
    }
    setIsAnimating(true);
    setOperation(`Pushing "${inputValue}"...`);
    
    setTimeout(() => {
      setStack(prev => [inputValue, ...prev]);
      setOperation(null);
      setMessage(`"${inputValue}" pushed to stack`);
      setInputValue('');
      setIsAnimating(false);
    }, 1000 / speed);
  };

  // Pop operation
  const pop = () => {
    if (stack.length === 0) {
      setMessage('Stack is empty!');
      return;
    }
    setIsAnimating(true);
    const poppedValue = stack[0];
    setOperation(`Popping "${poppedValue}"...`);
    
    setTimeout(() => {
      setStack(prev => prev.slice(1));
      setOperation(null);
      setMessage(`"${poppedValue}" popped from stack`);
      setIsAnimating(false);
    }, 1000 / speed);
  };

  // Peek operation
  const peek = () => {
    if (stack.length === 0) {
      setMessage('Stack is empty!');
      return;
    }
    setIsAnimating(true);
    setOperation(`Peeking at "${stack[0]}"`);
    
    setTimeout(() => {
      setOperation(null);
      setMessage(`Top element is "${stack[0]}"`);
      setIsAnimating(false);
    }, 1000 / speed);
  };

  return (
    <LinearMemoryControls
      inputValue={inputValue}
      setInputValue={setInputValue}
      isAnimating={isAnimating}
      operation={operation}
      message={message}
      speed={speed}
      onSpeedChange={setSpeed}
      actions={[
        { label: "Push", onClick: push, variant: "primary", needsInput: true, disabled: stackLimit && stack.length >= stackLimit },
        { label: "Pop", onClick: pop, disabled: stack.length === 0, variant: "secondary" },
        { label: "Peek", onClick: peek, disabled: stack.length === 0, variant: "secondary" },
        { label: "Reset", onClick: () => setStack([]), variant: "outline" },
        ...(extraActions || [])
      ]}
    />
  );
};

export default PushPop;