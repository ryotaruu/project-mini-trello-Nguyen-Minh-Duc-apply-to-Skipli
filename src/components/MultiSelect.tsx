import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Search, Check, CheckSquare, Square } from 'lucide-react';
import type { MultiSelectProps } from '../types/type-select';

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search options...",
  className = "",
  disabled = false,
  maxHeight = "200px",
  showSelectAll = true,
  emptyMessage = "No options found"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = options.filter(option => value.includes(option.value));
  const isAllSelected = filteredOptions.length > 0 && 
    filteredOptions.every(option => value.includes(option.value) || option.disabled);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm("");
      setFocusedIndex(-1);
    }
  };

  const handleOptionClick = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleSelectAll = () => {
    const availableOptions = filteredOptions.filter(option => !option.disabled);
    const allSelected = availableOptions.every(option => value.includes(option.value));
    
    if (allSelected) {
      const valuesToRemove = availableOptions.map(option => option.value);
      onChange(value.filter(v => !valuesToRemove.includes(v)));
    } else {
      const newValues = [...value];
      availableOptions.forEach(option => {
        if (!newValues.includes(option.value)) {
          newValues.push(option.value);
        }
      });
      onChange(newValues);
    }
  };

  const handleRemoveOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          const option = filteredOptions[focusedIndex];
          if (!option.disabled) {
            handleOptionClick(option.value);
          }
        }
        break;
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className={`
          flex items-center min-h-[44px] px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer
          transition-all duration-200 ease-in-out
          ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200'}
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-200' : ''}
        `}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {selectedOptions.length === 0 ? (
            <span className="text-gray-500 select-none">{placeholder}</span>
          ) : (
            selectedOptions.map(option => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md border border-blue-200"
              >
                <span className="max-w-[120px] truncate">{option.label}</span>
                {!disabled && (
                  <button
                    onClick={(e) => handleRemoveOption(option.value, e)}
                    className="flex-shrink-0 hover:bg-blue-200 rounded-full p-0.5 transition-colors duration-150"
                    type="button"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))
          )}
        </div>
        
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </div>

      {isOpen && (
        <div className="w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95 duration-100 z-[9999] relative">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div 
            className="py-1 overflow-y-auto"
            style={{ maxHeight }}
            role="listbox"
          >
            {showSelectAll && filteredOptions.length > 0 && (
              <div
                className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100"
                onClick={handleSelectAll}
              >
                {isAllSelected ? (
                  <CheckSquare className="w-4 h-4 text-blue-600 mr-2" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400 mr-2" />
                )}
                <span className="font-medium text-gray-700">Select All</span>
              </div>
            )}

            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={`
                    flex items-center px-3 py-2 text-sm cursor-pointer transition-colors duration-150
                    ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                    ${focusedIndex === index ? 'bg-blue-50' : ''}
                  `}
                  onClick={() => !option.disabled && handleOptionClick(option.value)}
                  role="option"
                  aria-selected={value.includes(option.value)}
                >
                  <div className="flex items-center justify-center w-4 h-4 mr-2">
                    {value.includes(option.value) && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <span className={`flex-1 ${option.disabled ? 'text-gray-400' : 'text-gray-700'}`}>
                    {option.label}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;