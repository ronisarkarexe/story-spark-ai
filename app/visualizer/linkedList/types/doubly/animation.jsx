'use client';
import React, { useState, useRef, useEffect } from 'react';
import Footer from '@/app/components/footer';
import ResetButton from '@/app/components/ui/resetButton';
import ExploreOther from '@/app/components/ui/exploreOther';
import Content from "@/app/visualizer/linkedList/types/doubly/content";
import Quiz from '@/app/visualizer/linkedList/types/doubly/quiz';
import CodeBlock from "@/app/visualizer/linkedList/types/doubly/codeBlock";
import BackToTop from '@/app/components/ui/backtotop';
import GoBackButton from "@/app/components/ui/goback";

const DoublyLinkedListVisualizer = () => {
  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const nodeIdCounter = useRef(1);
  const animationRef = useRef(null);

  const PointerBridge = ({ direction, label, color, reversed = false }) => {
    const laneClass = direction === 'next'
      ? 'text-primary dark:text-[#c27cf7]'
      : 'text-purple-600 dark:text-purple-400';

    const markerId = `${direction}-bridge-arrow`;

    return (
      <div className={`flex flex-col items-center justify-center ${laneClass}`}>
        <svg viewBox="0 0 40 72" className="h-16 w-10 overflow-visible">
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L10,5 L0,10 z" fill={color} />
            </marker>
          </defs>
          <path
            d={reversed ? 'M 20 66 V 12' : 'M 20 6 V 60'}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd={`url(#${markerId})`}
          />
        </svg>
        <span className="-mt-1 text-[11px] font-semibold tracking-wide uppercase">
          {label}
        </span>
      </div>
    );
  };

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
    <div className="min-h-screen max-h-auto bg-gray-100 dark:bg-zinc-950 text-gray-800 dark:text-gray-200">
      <main className="container mx-auto px-6 pt-16 pb-4">
        {/* go back block here */}
        <div className="mt-10 sm:mt-10">
          <GoBackButton />
        </div>

        {/* main logic here */}
        <h1 className="text-4xl md:text-4xl mt-6 ml-10 font-bold text-left text-gray-900 dark:text-white mb-0">
          <span className="text-black dark:text-white">Doubly Linked List</span>
        </h1>
        <div className="bg-black border border-none dark:bg-gray-600 w-100 h-[2px] rounded-xl mt-2 mb-5"></div>
        <Content />
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
          Visualize Singly Linked List Operations
        </p>
          
          {/* Input Form */}
          <div className="bg-white mx-auto dark:bg-gray-800 max-w-4xl p-4 rounded-lg shadow-md mb-4 border border-gray-200 dark:border-gray-700">
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
          </div>

          {/* Linked List Visualization */}
          <div className="bg-white max-w-4xl mx-auto dark:bg-gray-800 px-4 pt-4 pb-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-visible">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Doubly Linked List Representation
            </h2>

            <div className="mb-3 flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-2 text-primary dark:text-[#c27cf7]">
                <span className="h-2.5 w-6 rounded-full bg-primary" />
                <span>next pointer</span>
              </div>
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <span className="h-2.5 w-6 rounded-full bg-purple-500" />
                <span>prev pointer</span>
              </div>
            </div>
            
            {list.length === 0 ? (
              <div className="text-center py-6 rounded-md bg-gray-50 dark:bg-gray-700/50 border border-dashed border-gray-300 dark:border-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No nodes in the list yet. Add your first node!</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                {list.map((node, index) => (
                  <React.Fragment key={node.id}>
                    <div className="w-full max-w-xs relative group z-10">
                    <div className={`relative flex flex-col rounded-lg p-3 bg-white dark:bg-gray-700 border ${index === 0 ? 'border-green-500' : 'border-primary'} shadow-sm transition-all duration-200 overflow-hidden`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                          {node.address}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${index === 0 ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' : 'bg-blue-100 dark:bg-blue-900/50 text-primary-dark dark:text-blue-200'}`}>
                          {index === 0 ? 'HEAD' : index === list.length - 1 ? 'TAIL' : `Node ${index}`}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-1">
                        <div data-port="prev" className="border-r border-gray-200 dark:border-gray-600 pr-2 relative z-10">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Prev</div>
                          <div className="font-mono text-xs">
                            {node.prev || <span className="text-red-500">NULL</span>}
                          </div>
                        </div>

                        <div className="border-r border-gray-200 dark:border-gray-600 pr-2">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Data</div>
                          <div className="font-medium text-sm truncate">{node.value}</div>
                        </div>

                        <div data-port="next" className="relative z-10">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Next</div>
                          <div className="font-mono text-xs">
                            {node.next || <span className="text-red-500">NULL</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                    {index < list.length - 1 && (
                      <div className="w-full max-w-xs py-2">
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/80 px-4 py-3 dark:border-gray-600 dark:bg-gray-700/30">
                          <div className="mb-2 flex items-center justify-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                            <span>node {index} to node {index + 1}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <PointerBridge direction="next" label="next" color="#3b82f6" />
                            <div className="flex-1 px-1">
                              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
                            </div>
                            <PointerBridge direction="prev" label="prev" color="#a855f7" reversed />
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
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
            { text: "Circular Linked List", url: "./circular" },
          ]}
        />
      </main>
      <div>
        <div className="bg-gray-700 z-10 h-[1px]"></div>
      </div>
      <div className="bg-gray-700 z-10 h-[1px]"></div>
      <BackToTop />
      <Footer />
    </div>
  );
};

export default DoublyLinkedListVisualizer;