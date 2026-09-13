import React, { useState, useEffect } from 'react';
import { X, Delete, Calculator, Check, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/format';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResult?: (value: number) => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({
  isOpen,
  onClose,
  onApplyResult
}) => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (/\d/.test(e.key)) {
        inputDigit(e.key);
      } else if (e.key === '.') {
        inputDot();
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        performOperation(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        performEquals();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!isOpen) return null;

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handleBackspace = () => {
    if (waitingForOperand) return;
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performOperation = (nextOp: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const current = prevValue;
      let newValue = current;
      switch (operation) {
        case '+':
          newValue = current + inputValue;
          break;
        case '-':
          newValue = current - inputValue;
          break;
        case '*':
          newValue = current * inputValue;
          break;
        case '/':
          newValue = inputValue !== 0 ? current / inputValue : 0;
          break;
      }
      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
  };

  const performEquals = () => {
    if (!operation || prevValue === null) return;
    const inputValue = parseFloat(display);
    let newValue = prevValue;
    switch (operation) {
      case '+':
        newValue = prevValue + inputValue;
        break;
      case '-':
        newValue = prevValue - inputValue;
        break;
      case '*':
        newValue = prevValue * inputValue;
        break;
      case '/':
        newValue = inputValue !== 0 ? prevValue / inputValue : 0;
        break;
    }
    setDisplay(String(newValue));
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const handlePercentage = () => {
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  const currentNumber = parseFloat(display) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xs bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary-600 flex items-center justify-center text-white">
              <Calculator className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold tracking-tight">Máy tính thu ngân (POS)</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Display Screen */}
        <div className="p-4 bg-slate-950 text-right">
          <div className="text-[11px] text-slate-400 font-mono h-4">
            {prevValue !== null ? `${prevValue} ${operation || ''}` : ''}
          </div>
          <div className="text-2xl font-bold font-mono text-primary-400 truncate tracking-tight">
            {display}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            ≈ {formatCurrency(currentNumber)}
          </div>
        </div>

        {/* Keypad */}
        <div className="p-3 bg-slate-50 grid grid-cols-4 gap-2 text-sm font-semibold">
          <button
            onClick={clearAll}
            className="col-span-1 p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition active:scale-95"
          >
            C
          </button>
          <button
            onClick={handleBackspace}
            className="p-2.5 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition active:scale-95 flex items-center justify-center"
          >
            <Delete className="w-4 h-4" />
          </button>
          <button
            onClick={handlePercentage}
            className="p-2.5 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition active:scale-95"
          >
            %
          </button>
          <button
            onClick={() => performOperation('/')}
            className="p-2.5 rounded-xl bg-primary-100 text-primary-800 hover:bg-primary-200 transition active:scale-95"
          >
            ÷
          </button>

          {/* Row 2 */}
          <button onClick={() => inputDigit('7')} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 transition active:scale-95">7</button>
          <button onClick={() => inputDigit('8')} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 transition active:scale-95">8</button>
          <button onClick={() => inputDigit('9')} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 transition active:scale-95">9</button>
          <button
            onClick={() => performOperation('*')}
            className="p-2.5 rounded-xl bg-primary-100 text-primary-800 hover:bg-primary-200 transition active:scale-95"
          >
            ×
          </button>

          {/* Row 3 */}
          <button onClick={() => inputDigit('4')} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 transition active:scale-95">4</button>
          <button onClick={() => inputDigit('5')} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 transition active:scale-95">5</button>
          <button onClick={() => inputDigit('6')} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 transition active:scale-95">6</button>
          <button
            onClick={() => performOperation('-')}
            className="p-2.5 rounded-xl bg-primary-100 text-primary-800 hover:bg-primary-200 transition active:scale-95"
          >
            −
          </button>

          {/* Row 4 */}
          <button onClick={() => inputDigit('1')} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 transition active:scale-95">1</button>
          <button onClick={() => inputDigit('2')} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 transition active:scale-95">2</button>
          <button onClick={() => inputDigit('3')} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 transition active:scale-95">3</button>
          <button
            onClick={() => performOperation('+')}
            className="p-2.5 rounded-xl bg-primary-100 text-primary-800 hover:bg-primary-200 transition active:scale-95"
          >
            +
          </button>

          {/* Row 5 */}
          <button onClick={() => inputDigit('0')} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 transition active:scale-95">0</button>
          <button onClick={() => inputDigit('000')} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 transition active:scale-95 text-xs font-mono">000</button>
          <button onClick={inputDot} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 transition active:scale-95">.</button>
          <button
            onClick={performEquals}
            className="p-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition active:scale-95 font-bold"
          >
            =
          </button>
        </div>

        {/* Footer Actions */}
        {onApplyResult && (
          <div className="p-3 bg-white border-t border-slate-200">
            <button
              onClick={() => {
                onApplyResult(currentNumber);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Check className="w-4 h-4" />
              <span>Sử dụng kết quả ({formatCurrency(currentNumber)})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
