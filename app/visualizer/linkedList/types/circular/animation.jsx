'use client';
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import ResetButton from '@/app/components/ui/resetButton';
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";

const CircularLinkedListVisualizer = () => {
  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const nodeIdCounter = useRef(1);
  const containerRef = useRef(null);

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
    gsap.from(arrows, {
      opacity: 0,
      duration: 0.3,
      stagger: 0.1
    });
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

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
          Visualize Circular Linked List Operations
      </p>

      <VisualizerCard className="mx-auto w-full max-w-md">
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
              className={`flex-1 py-3 rounded-lg transition-all ${isAnimating || !inputValue ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={isAnimating || !inputValue}
            >
              Add Node
            </button>
            <ResetButton onReset={resetList} isAnimating={isAnimating} />
          </div>
      </VisualizerCard>

      <VisualizerCard className="relative">
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
            <div className="relative" ref={containerRef}>
              {/* Circular arrangement of nodes */}
              <div className="relative mx-auto" style={{ minHeight: '500px' }}>
                {list.map((node, index) => {
                  const angle = (index * (360 / list.length)) * (Math.PI / 180);
                  const radius = Math.min(200, 150 + list.length * 15);
                  const centerX = 0;
                  const centerY = 0;
                  const nodeX = centerX + radius * Math.cos(angle);
                  const nodeY = centerY + radius * Math.sin(angle);
                  
                  return (
                    <div
                      key={node.id}
                      data-node-id={node.id}
                      className="absolute transition-all duration-300"
                      style={{
                        left: `calc(50% + ${nodeX}px)`,
                        top: `calc(50% + ${nodeY}px)`,
                        transform: 'translate(-50%, -50%)',
                        width: '160px',
                      }}
                    >
                      <div className={`flex flex-col border-2 ${index === 0 ? 'border-green-500' : 'border-blue-500'} rounded-xl p-4 bg-white dark:bg-gray-700 shadow-md`}>
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-mono text-xs text-gray-600 dark:text-gray-300">
                            {node.address}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${index === 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
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

                {/* Arrow connections */}
                {list.length > 0 && (
                  <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 1 }}>
                    {list.map((node, index) => {
                      const nextIndex = (index + 1) % list.length;
                      const angle1 = (index * (360 / list.length)) * (Math.PI / 180);
                      const angle2 = (nextIndex * (360 / list.length)) * (Math.PI / 180);
                      const radius = Math.min(200, 150 + list.length * 15);
                      const startX = 50 + (radius * Math.cos(angle1)) / 5;
                      const startY = 50 + (radius * Math.sin(angle1)) / 5;
                      const endX = 50 + (radius * Math.cos(angle2)) / 5;
                      const endY = 50 + (radius * Math.sin(angle2)) / 5;
                      
                      // Calculate control points for curved arrows
                      const controlX = 50;
                      const controlY = 50;
                      
                      return (
                        <g key={`connection-${node.id}`} className="connection-arrow">
                          {/* Curved path */}
                          <path
                            d={`M ${startX}% ${startY}% Q ${controlX}% ${controlY}%, ${endX}% ${endY}%`}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeDasharray={index === list.length - 1 ? "5,5" : "0"}
                          />
                          
                          {/* Arrowhead */}
                          <marker 
                            id={`arrowhead-${node.id}`} 
                            markerWidth="10" 
                            markerHeight="7" 
                            refX="9" 
                            refY="3.5" 
                            orient="auto"
                          >
                            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                          </marker>
                          
                          {/* Arrow line with arrowhead */}
                          <path
                            d={`M ${startX}% ${startY}% Q ${controlX}% ${controlY}%, ${endX}% ${endY}%`}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            markerEnd={`url(#arrowhead-${node.id})`}
                            opacity="0.7"
                          />
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>
            </div>
          )}
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
};

export default CircularLinkedListVisualizer;
