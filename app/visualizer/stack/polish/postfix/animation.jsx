"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import usePlayback from "@/app/hooks/usePlayback";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

/* ----------  tiny reusable animated bits  ---------- */
const AnimatedStackItem = ({ char, isTop }) => (
  <motion.div
    initial={{ y: -30, opacity: 0, scale: 0.8 }}
    animate={{ y: 0, opacity: 1, scale: 1 }}
    exit={{ y: 30, opacity: 0, scale: 0.8 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`p-3 border-2 rounded text-center font-medium
      ${isTop ? "bg-blue-100 dark:bg-blue-900 border-[#c27cf7]" : "bg-white dark:bg-gray-700 border-gray-200"}`}
  >
    {char}
    {isTop && <div className="text-xs mt-1 text-gray-500">(Top)</div>}
  </motion.div>
);

const AnimatedOutputToken = ({ char }) => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
    className="w-10 h-10 flex items-center justify-center rounded-md
               bg-green-100 dark:bg-green-500 border border-white
               text-green-800 dark:text-black font-mono font-bold"
  >
    {char}
  </motion.div>
);

/* ----------  main component  ---------- */
const InfixToPostfixVisualizer = () => {
  /* =======  your existing state – nothing changed  ======= */
  const [infix, setInfix] = useState("(A+B)*C");
  const [postfix, setPostfix] = useState("");
  const [stack, setStack] = useState([]);
  const [output, setOutput] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [operation, setOperation] = useState(null);
  const [message, setMessage] = useState("Enter an infix expression and click Convert");
  const [isPlaying, setIsPlaying] = useState(false);
  const { speed, setSpeed } = usePlayback(1);

  const precedence = { "^": 4, "*": 3, "/": 3, "+": 2, "-": 2 };

  /* ............  your existing logic  ............ */
  const reset = () => {
    setStack([]); setOutput([]); setPostfix(""); setCurrentStep(0); setSteps([]);
    setMessage("Enter an infix expression and click Convert"); setOperation(null); setIsPlaying(false);
  };

  const convertInfixToPostfix = () => {
    if (!infix.trim()) { setMessage("Please enter an infix expression"); return; }
    setIsProcessing(true); reset();
    const conversionSteps = []; let tempStack = []; let tempOutput = [];
    conversionSteps.push({ stack:[],output:[],char:"",action:"Initialize",description:"Starting conversion process" });
    for (let i = 0; i < infix.length; i++) {
      const char = infix[i];
      if (/[a-zA-Z0-9]/.test(char)) {
        tempOutput.push(char);
        conversionSteps.push({ stack:[...tempStack],output:[...tempOutput],char,action:"Add operand",description:`Added operand "${char}" to output` });
      } else if (char === "(") {
        tempStack.push(char);
        conversionSteps.push({ stack:[...tempStack],output:[...tempOutput],char,action:"Push to stack",description:`Pushed "(" to stack` });
      } else if (char === ")") {
        while (tempStack.length && tempStack[tempStack.length - 1] !== "(") {
          const popped = tempStack.pop(); tempOutput.push(popped);
          conversionSteps.push({ stack:[...tempStack],output:[...tempOutput],char:popped,action:"Pop from stack",description:`Popped operator "${popped}" from stack` });
        }
        tempStack.pop();
        conversionSteps.push({ stack:[...tempStack],output:[...tempOutput],char:"(",action:"Remove from stack",description:'Removed "(" from stack' });
      } else {
        while (tempStack.length && tempStack[tempStack.length - 1] !== "(" && precedence[char] <= precedence[tempStack[tempStack.length - 1]]) {
          const popped = tempStack.pop(); tempOutput.push(popped);
          conversionSteps.push({ stack:[...tempStack],output:[...tempOutput],char:popped,action:"Pop higher precedence",description:`Popped higher precedence operator "${popped}"` });
        }
        tempStack.push(char);
        conversionSteps.push({ stack:[...tempStack],output:[...tempOutput],char,action:"Push operator",description:`Pushed operator "${char}" to stack` });
      }
    }
    while (tempStack.length) { const popped = tempStack.pop(); tempOutput.push(popped);
      conversionSteps.push({ stack:[...tempStack],output:[...tempOutput],char:popped,action:"Pop remaining",description:`Popped remaining operator "${popped}"` });
    }
    setSteps(conversionSteps); setPostfix(tempOutput.join(" ")); setIsProcessing(false); setIsPlaying(true);
  };

  const playNextStep = useCallback(() => {
    setCurrentStep((s) => s + 1);
  }, []);
  const playPrevStep = useCallback(() => {
    setCurrentStep((s) => (s > 0 ? s - 1 : s));
  }, []);
  const togglePlayPause = useCallback(() => setIsPlaying((p) => !p), []);
  const jumpToStep = useCallback((idx) => {
    setCurrentStep(idx);
    if (idx === steps.length - 1) setIsPlaying(false);
  }, [steps.length]);

  useEffect(() => {
    let t;
    if (isPlaying && currentStep < steps.length - 1) t = setTimeout(playNextStep, 1000 / speed);
    else if (currentStep >= steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(t);
  }, [isPlaying, currentStep, steps.length, speed, playNextStep]);

  /* =======  NEW: tiny GSAP flash on step change  ======= */
  const statusRef = useRef();
  useEffect(() => {
    if (statusRef.current) gsap.fromTo(statusRef.current, { scale: 0.95, opacity: 0.7 }, { scale: 1, opacity: 1, duration: 0.3 });
  }, [message]);

  useVisualizerKeyboard({
    onStart: undefined, // Space toggles play/pause, but only if sorting=true (or start if we add it)
    onReset: reset,
    onSpeedChange: setSpeed,
    onTogglePlayPause: togglePlayPause,
    speed: speed,
    sorting: steps.length > 0 && currentStep < steps.length - 1,
    sorted: currentStep === steps.length - 1 && steps.length > 0,
    enabled: true,
  });

  useEffect(() => { if (steps.length && currentStep < steps.length) { setIsAnimating(true); const s = steps[currentStep]; setStack(s.stack); setOutput(s.output); setOperation(s.action); setMessage(s.description); const t = setTimeout(() => setIsAnimating(false), 500 / speed); return () => clearTimeout(t); } }, [currentStep, steps, speed]);

  /* ----------  UI  ---------- */
  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">Visualize the conversion from infix to postfix notation</p>
      <div className="max-w-4xl mx-auto">
        {/* Input & Controls */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Infix Expression
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={infix}
                onChange={e => setInfix(e.target.value)}
                placeholder="Enter infix expression (e.g., (A+B)*C)"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300"
                disabled={isProcessing}
              />
              <button
                onClick={convertInfixToPostfix}
                disabled={isProcessing}
                className="px-6 py-2 font-bold bg-[#a435f0] text-white rounded-lg hover:bg-[#8f2cd6] transition-all duration-200"
              >
                {isProcessing ? "Converting..." : "Convert"}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={reset}
              className="flex-1 border-2 border-[#1a1a1a] dark:border-[#f7f9fa] text-[#1a1a1a] dark:text-[#f7f9fa] font-bold py-[10px] rounded-lg hover:bg-[#1a1a1a] hover:text-white dark:hover:bg-white dark:hover:text-[#1a1a1a] disabled:opacity-50 transition-all duration-200"
            >
              Reset
            </button>
          </div>

          {steps.length > 0 && (
            <div className="mt-6">
              <PlaybackControls
                isPaused={!isPlaying}
                onTogglePlayPause={togglePlayPause}
                speed={speed}
                onSpeedChange={setSpeed}
                onIncreaseSpeed={() => setSpeed(Math.min(speed + 0.5, 5))}
                onDecreaseSpeed={() => setSpeed(Math.max(speed - 0.5, 0.5))}
                disabled={isAnimating && !isPlaying}
                showShortcuts={true}
                onStepForward={currentStep < steps.length - 1 ? playNextStep : undefined}
                onStepBackward={currentStep > 0 ? playPrevStep : undefined}
                onReset={reset}
                progressText={`Step ${currentStep + 1} of ${steps.length}`}
              />
            </div>
          )}
        </div>

        {/* Status panel with GSAP flash */}
        <div ref={statusRef} className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4">Conversion Status</h2>
          {operation && (
            <div className="mb-4 p-3 rounded-lg bg-[#a435f0]/10 dark:bg-[#a435f0]/20 text-[#a435f0] border border-[#a435f0]/20">
              <span className="font-semibold uppercase text-xs tracking-wider mr-2">Status:</span>
              {operation}
            </div>
          )}
          {message && (
            <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900 text-primary-dark dark:text-blue-200">
              <p className="font-medium text-center">{message}</p>
            </div>
          )}
          {postfix && currentStep === steps.length - 1 && (
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 200 }} className="mt-4 p-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800 text-center">
              <div className="font-bold uppercase text-xs tracking-widest mb-1">Final Postfix Result</div>
              <div className="text-3xl font-bold font-mono">{postfix}</div>
            </motion.div>
          )}
        </div>

        {/* Visualisations – now with motion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Stack */}
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Stack (Operators)
            </h2>
            <div className="flex flex-col items-center min-h-[300px]">
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">{stack.length > 0 ? "↑ Top" : ""}</div>
              <div className="w-32 relative">
                <AnimatePresence>
                  {stack.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-xl italic">
                      Stack is empty
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {stack.map((item, i) => (
                        <AnimatedStackItem key={`${i}-${item}`} char={item} isTop={i === stack.length - 1} />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">{stack.length > 0 ? "↓ Bottom" : ""}</div>
            </div>
          </div>

          {/* Output */}
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
              Output
            </h2>
            <div className="min-h-[300px] p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col">
              <div className="flex flex-wrap gap-3 justify-center">
                <AnimatePresence>
                  {output.length === 0 ? (
                    <div className="text-gray-400 italic w-full text-center py-12">Output will appear here</div>
                  ) : (
                    output.map((c, i) => <AnimatedOutputToken key={`${i}-${c}`} char={c} />)
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Step table – same as before, just with framer hover */}
        {steps.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
            <h2 className="text-xl font-semibold mb-4">Conversion Steps</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-neutral-950"><tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Step</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Character</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                </tr></thead>
                <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {steps.map((step, idx) => (
                    <motion.tr key={idx} onClick={() => jumpToStep(idx)} className={`cursor-pointer ${currentStep === idx ? "bg-blue-50 dark:bg-neutral-950" : "hover:bg-gray-50 dark:hover:bg-neutral-950"}`}
                               whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{idx + 1}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{step.action}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-mono">{step.char || "-"}</td>
                      <td className="px-4 py-2 text-sm">{step.description}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default InfixToPostfixVisualizer;
