'use client';
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Footer from '@/app/components/footer';
import ResetButton from '@/app/components/ui/resetButton';
import ExploreOther from '@/app/components/ui/exploreOther';
import Content from "@/app/visualizer/linkedList/types/circular/content";
import Quiz from '@/app/visualizer/linkedList/types/circular/quiz';
import CodeBlock from "@/app/visualizer/linkedList/types/circular/codeBlock";
import BackToTop from '@/app/components/ui/backtotop';
import GoBackButton from "@/app/components/ui/goback";

const CircularLinkedListVisualizer = () => {
  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [diagramSize, setDiagramSize] = useState({ width: 0, height: 0 });
  const nodeIdCounter = useRef(1);
  const stageRef = useRef(null);

  // Generate random memory addresses
  const generateMemoryAddress = () => {
    return '0x' + Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0');
  };

  const addNode = () => {
    if (!inputValue || isAnimating) return;
    setIsAnimating(true);

    const newNode = {
      value: inputValue,
      id: nodeIdCounter.current++,
      address: generateMemoryAddress(),
    };

    setList(prev => {
      if (prev.length === 0) {
        newNode.next = newNode.address;
        return [newNode];
      } else {
        const updatedList = [...prev];
        newNode.next = updatedList[0].address;
        updatedList[updatedList.length - 1].next = newNode.address;
        return [...updatedList, newNode];
      }
    });

    setInputValue('');
    setIsAnimating(false);
  };

  const animateNodeAddition = (nodeId) => {
    const newNodeElement = document.querySelector(`[data-node-id="${nodeId}"]`);
    const arrows = document.querySelectorAll('.connection-arrow');

    if (!newNodeElement) return;

    // Node entry animation
    gsap.from(newNodeElement, {
      opacity: 0,
      scale: 0.5,
      duration: 0.5,
      ease: 'back.out(1.7)'
    });

    // Arrow animations
    if (arrows.length > 0) {
      gsap.from(arrows, {
        opacity: 0,
        duration: 0.3,
        stagger: 0.1
      });
    }
  };

  const resetList = () => {
    // Animate nodes out
    const nodes = document.querySelectorAll('[data-node-id]');
    gsap.to(nodes, {
      opacity: 0,
      scale: 0.5,
      duration: 0.3,
      stagger: 0.05,
      onComplete: () => {
        setList([]);
        nodeIdCounter.current = 1;
      }
    });
  };

  useEffect(() => {
    if (list.length > 0) {
      animateNodeAddition(list[list.length - 1].id);
    }
  }, [list]);

  useEffect(() => {
    const updateDiagramSize = () => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
      setDiagramSize({ width: rect.width, height: rect.height });
    };

    const rafId = window.requestAnimationFrame(updateDiagramSize);

    window.addEventListener('resize', updateDiagramSize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateDiagramSize);
    };
  }, [list]);

  return (
    <div className="min-h-screen max-h-auto bg-gray-100 dark:bg-zinc-950 text-gray-800 dark:text-gray-200">
      <main className="container mx-auto px-6 pt-16 pb-4">
        {/* go back block here */}
        <div className="mt-10 sm:mt-10">
          <GoBackButton />
        </div>

        {/* main logic here */}
        <h1 className="text-4xl md:text-4xl mt-6 ml-10 font-bold text-left text-gray-900 dark:text-white mb-0">
          <span className="text-black dark:text-white">Circular Linked List</span>
        </h1>
        <div className="bg-black border border-none dark:bg-gray-600 w-100 h-[2px] rounded-xl mt-2 mb-5"></div>
        <Content />
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
          Visualize Circular Linked List Operations
        </p>
        
        {/* Input Form */}
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
              Node Value
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter value"
              disabled={isAnimating}
              onKeyDown={(e) => e.key === 'Enter' && addNode()}
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={addNode}
              className={`flex-1 py-3 rounded-lg transition-all ${isAnimating || !inputValue ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
              disabled={isAnimating || !inputValue}
            >
              Add Node
            </button>
            <ResetButton onReset={resetList} isAnimating={isAnimating} />
          </div>
        </div>

        {/* Visualization Area */}
          <div className="relative max-w-4xl mx-auto">
          {list.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
              <div className="inline-block p-6 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Empty List</h3>
              <p className="text-gray-500 dark:text-gray-400">Add nodes to visualize the circular linked list</p>
            </div>
          ) : (
            <div ref={stageRef} className="relative mx-auto" style={{ minHeight: '500px' }}>
              {/* Circular arrangement of nodes */}
              <div className="relative mx-auto" style={{ minHeight: '500px' }}>
                {list.length > 1 && diagramSize.width > 0 && diagramSize.height > 0 && (
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                    style={{ zIndex: 0 }}
                    viewBox={`0 0 ${diagramSize.width} ${diagramSize.height}`}
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <marker
                        id="circular-arrowhead"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                        markerUnits="strokeWidth"
                      >
                        <path d="M0,0 L10,5 L0,10 z" fill="#3b82f6" />
                      </marker>
                    </defs>

                    {list.map((node, index) => {
                      const step = (Math.PI * 2) / list.length;
                      const startAngle = index * step;
                      const nextAngle = ((index + 1) % list.length) * step;
                      const adjustedNextAngle = nextAngle <= startAngle ? nextAngle + Math.PI * 2 : nextAngle;
                      const arcRadius = Math.min(125, 95 + list.length * 8) + 72;
                      const centerX = diagramSize.width / 2;
                      const centerY = diagramSize.height / 2;

                      const startX = centerX + arcRadius * Math.cos(startAngle);
                      const startY = centerY + arcRadius * Math.sin(startAngle);
                      const endX = centerX + arcRadius * Math.cos(adjustedNextAngle);
                      const endY = centerY + arcRadius * Math.sin(adjustedNextAngle);
                      const largeArcFlag = adjustedNextAngle - startAngle > Math.PI ? 1 : 0;

                      return (
                        <path
                          key={`connection-${node.id}`}
                          className="connection-arrow"
                          d={`M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          markerEnd="url(#circular-arrowhead)"
                          opacity="0.9"
                        />
                      );
                    })}
                  </svg>
                )}

                {list.map((node, index) => {
                  const angle = (index * (360 / list.length)) * (Math.PI / 180);
                  const radius = Math.min(125, 95 + list.length * 8);
                  const centerX = 0;
                  const centerY = 0;
                  const nodeX = centerX + radius * Math.cos(angle);
                  const nodeY = centerY + radius * Math.sin(angle);
                  
                  return (
                    <div
                      key={node.id}
                      data-node-id={node.id}
                      className="absolute transition-all duration-300 z-10"
                      style={{
                        left: `calc(50% + ${nodeX}px)`,
                        top: `calc(50% + ${nodeY}px)`,
                        transform: 'translate(-50%, -50%)',
                        width: '160px',
                      }}
                    >
                      <div className={`flex flex-col border-2 ${index === 0 ? 'border-green-500' : 'border-primary'} rounded-xl p-4 bg-white dark:bg-gray-700 shadow-md`}>
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-mono text-xs text-gray-600 dark:text-gray-300">
                            {node.address}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${index === 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-blue-100 text-primary-dark dark:bg-blue-900 dark:text-blue-200'}`}>
                            {index === 0 ? 'HEAD' : `Node ${index}`}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-2">
                          <div className="bg-gray-50 dark:bg-gray-600 p-2 rounded">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Data</div>
                            <div className="font-bold text-center text-lg">{node.value}</div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-600 p-2 rounded">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Next</div>
                            <div className="font-mono text-xs text-center truncate">
                              {node.next === node.address ? 'self' : node.next}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>
          )}
        </div>

        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mt-8 mb-8">
          Test Your Knowledge before moving forward!
        </p>
        <Quiz />

        <CodeBlock/>

        <ExploreOther
          title="Explore Other Types"
          links={[
            { text: "Singly Linked List", url: "./singly" },
            { text: "Doubly Linked List", url: "./doubly" },
          ]}
        />

      </main>
      <BackToTop/>
      <Footer />
    </div>
  );
};

export default CircularLinkedListVisualizer;