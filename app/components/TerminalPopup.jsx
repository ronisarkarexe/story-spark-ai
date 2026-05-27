import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TerminalPopup = ({ isOpen, onClose, email }) => {
  const [lines, setLines] = useState([]);
  const [showCursor, setShowCursor] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const terminalSequence = [
    { text: `$ algobuddy subscribe ${email}`, type: 'command' },
    { text: '[1/3] Validating email...', type: 'process' },
    { text: '✓ Email verified', type: 'success' },
    { text: '[2/3] Enabling weekly updates...', type: 'process' },
    { text: '✓ Updates enabled', type: 'success' },
    { text: '✓ Subscribed — Welcome 🚀', type: 'success' },
  ];

  useEffect(() => {
    if (!isOpen) {
      setLines([]);
      setShowCursor(false);
      setIsComplete(false);
      return;
    }

    let currentIndex = 0;
    let charTimeout = null;
    let lineTimeout = null;
    let cursorInterval = null;
    let autoCloseTimeout = null;

    const startCursor = () => {
      if (!cursorInterval) {
        cursorInterval = setInterval(() => setShowCursor(prev => !prev), 500);
      }
    };

    const stopCursor = () => {
      if (cursorInterval) {
        clearInterval(cursorInterval);
        cursorInterval = null;
      }
      setShowCursor(false);
    };

    const typeLine = (line) => {
      // append an empty line object first
      setLines(prev => [...prev, { text: '', type: line.type }]);
      startCursor();

      let charIndex = 0;
      const charDelay = line.type === 'command' ? 25 : line.type === 'process' ? 20 : 20;

      const doChar = () => {
        if (charIndex < line.text.length) {
          setLines(prev => {
            const copy = [...prev];
            const last = { ...(copy[copy.length - 1]) };
            last.text = (last.text || '') + line.text.charAt(charIndex);
            copy[copy.length - 1] = last;
            return copy;
          });
          charIndex++;
          charTimeout = setTimeout(doChar, charDelay);
        } else {
          // after finishing typing this line, small pause before next
          const postDelay = line.type === 'process' ? 320 : 180;
          lineTimeout = setTimeout(() => {
            currentIndex++;
            displayNext();
          }, postDelay);
        }
      };

      // start typing chars
      doChar();
    };

    const displayNext = () => {
      if (currentIndex >= terminalSequence.length) {
        setIsComplete(true);
        startCursor();
        // auto-close shortly after complete
        autoCloseTimeout = setTimeout(() => {
          try { onClose(); } catch (e) {}
        }, 2800);
        return;
      }

      const line = terminalSequence[currentIndex];

      if (!line || !line.text) {
        // empty/break line
        setLines(prev => [...prev, { text: '', type: 'break' }]);
        currentIndex++;
        lineTimeout = setTimeout(displayNext, 100);
        return;
      }

      // For success lines we still type them but slightly faster
      typeLine(line);
    };

    // kick off
    const initialDelay = setTimeout(() => displayNext(), 150);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(charTimeout);
      clearTimeout(lineTimeout);
      if (cursorInterval) clearInterval(cursorInterval);
      clearTimeout(autoCloseTimeout);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <style jsx>{`
        @keyframes greenGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(34, 197, 94, 0.5), 0 0 20px rgba(34, 197, 94, 0.3); }
          50% { text-shadow: 0 0 15px rgba(34, 197, 94, 0.7), 0 0 25px rgba(34, 197, 94, 0.5); }
        }
        .terminal-text {
          animation: greenGlow 2s ease-in-out infinite;
        }
      `}</style>
      
      <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Terminal Window */}
        <div className="bg-black text-white rounded-lg overflow-hidden shadow-2xl border border-green-700/30">
          {/* Terminal Header */}
          <div className="bg-gray-900 px-4 py-3 flex justify-between items-center border-b border-green-700/20">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <p className="text-sm text-green-400 font-mono">~ algobuddy-cli</p>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Terminal Content */}
          <div className="bg-black p-6 font-mono text-sm min-h-64 max-h-96 overflow-auto">
            <div className="space-y-0.5 leading-relaxed">
              {lines.map((line, idx) => {
                const isLast = idx === lines.length - 1;
                const baseClass = line.type === 'command'
                  ? 'text-white'
                  : line.type === 'success'
                  ? 'text-green-400 terminal-text'
                  : line.type === 'process'
                  ? 'text-yellow-400'
                  : '';

                const cursorColorClass = line.type === 'success' ? 'text-green-400' : line.type === 'process' ? 'text-yellow-400' : 'text-white';

                return (
                  <div key={idx} className={baseClass}>
                    <span>{line.text}</span>
                    {isLast && (
                      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 ml-1 ${cursorColorClass}`}>
                        ▋
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Terminal Footer */}
          <div className="bg-gray-900 px-6 py-3 border-t border-green-700/20 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium text-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalPopup;
