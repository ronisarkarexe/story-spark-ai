'use client';
import React, { useState, useRef, useEffect } from 'react';
import ResetButton from '@/app/components/ui/resetButton';
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";

const DoublyLinkedListVisualizer = () => {
  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const nodeIdCounter = useRef(1);
  const animationRef = useRef(null);

  const generateMemoryAddress = () => {
    return '0x' + Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0');
  };

  const addNode = () => {
    if (!inputValue || isAnimating) return;
    setIsAnimating(true);

    animationRef.current = setTimeout(() => {
      const newNode = {
        value: inputValue,
        id: nodeIdCounter.current++,
        address: generateMemoryAddress(),
        next: null,
        prev: list.length > 0 ? list[list.length - 1].address : null
      };

      setList(prev => {
        if (prev.length > 0) {
          const updatedList = [...prev];
          updatedList[updatedList.length - 1].next = newNode.address;
          return [...updatedList, newNode];
        }
        return [newNode];
      });

      setInputValue('');
      setIsAnimating(false);
    }, 500);
  };

  const resetList = () => {
    clearTimeout(animationRef.current);
    setList([]);
    setInputValue('');
    setIsAnimating(false);
    nodeIdCounter.current = 1;
  };

  useEffect(() => {
    return () => {
      clearTimeout(animationRef.current);
    };
  }, []);

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
        Visualize Doubly Linked List Operations
      </p>

      <VisualizerCard className="mb-0">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Node Value
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full p-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter value"
                  disabled={isAnimating}
                  onKeyDown={(e) => e.key === 'Enter' && addNode()}
                />
                {inputValue && (
                  <button
                    onClick={() => setInputValue('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={addNode}
                className={`flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-1 ${isAnimating ? 'cursor-not-allowed' : ''}`}
                disabled={isAnimating || !inputValue}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Node
              </button>
              <ResetButton onReset={resetList} isAnimating={isAnimating} />
            </div>
      </VisualizerCard>

      <VisualizerCard>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Doubly Linked List Representation
            </h2>
            
            {list.length === 0 ? (
              <div className="text-center py-6 rounded-md bg-gray-50 dark:bg-gray-700/50 border border-dashed border-gray-300 dark:border-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No nodes in the list yet. Add your first node!</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {list.map((node, index) => (
                  <React.Fragment key={node.id}>
                    {/* Previous pointer arrow (only shown if not the first node) */}
                    {index > 0 && (
                      <div className="flex items-center justify-center w-full max-w-xs relative my-1">
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-0.5 bg-gradient-to-t from-purple-500 to-purple-300 dark:from-purple-400 dark:to-purple-600 relative">
                            <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-b-3 border-l-transparent border-r-transparent border-b-purple-500 dark:border-b-purple-400"></div>
                          </div>
                          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">prev</div>
                        </div>
                      </div>
                    )}

                    {/* Node Card */}
                    <div className="w-full max-w-xs relative group my-1">
                      <div className={`relative flex flex-col rounded-lg p-3 bg-white dark:bg-gray-700 border ${index === 0 ? 'border-green-500' : 'border-blue-500'} shadow-sm transition-all duration-200 overflow-hidden`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-mono text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                            {node.address}
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${index === 0 ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200'}`}>
                            {index === 0 ? 'HEAD' : index === list.length - 1 ? 'TAIL' : `Node ${index}`}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-1">
                          <div className="border-r border-gray-200 dark:border-gray-600 pr-2">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Prev</div>
                            <div className="font-mono text-xs">
                              {node.prev || <span className="text-red-500">NULL</span>}
                            </div>
                          </div>
                          
                          <div className="border-r border-gray-200 dark:border-gray-600 pr-2">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Data</div>
                            <div className="font-medium text-sm truncate">{node.value}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Next</div>
                            <div className="font-mono text-xs">
                              {node.next || <span className="text-red-500">NULL</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next pointer arrow (only shown if not the last node) */}
                    {index < list.length - 1 && (
                      <div className="flex items-center justify-center w-full max-w-xs relative my-1">
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-0.5 bg-gradient-to-b from-blue-500 to-blue-300 dark:from-blue-400 dark:to-blue-600 relative">
                            <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-l-transparent border-r-transparent border-t-blue-500 dark:border-t-blue-400"></div>
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">next</div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
};

export default DoublyLinkedListVisualizer;
