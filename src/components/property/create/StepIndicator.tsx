'use client';

import React from 'react';
import { STEPS } from './constants';

interface StepIndicatorProps {
  currentStep: number;
  /** A step that currently has validation errors — flagged for attention. */
  errorStep?: number | null;
  /** Defaults to the self-serve listing steps */
  steps?: ReadonlyArray<{ id: number; label: string }>;
}

export function StepIndicator({ currentStep, errorStep, steps = STEPS }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full">
      {steps.map((s, i) => {
        const isError = errorStep != null && s.id === errorStep && s.id === currentStep;
        return (
        <div key={s.id} className="flex items-center">
          {/* Circle */}
          <div className="flex flex-col items-center">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                isError
                  ? 'bg-red-500 text-white animate-attention'
                  : s.id === currentStep
                  ? 'bg-brand-600 text-white ring-2 ring-brand-200'
                  : s.id < currentStep
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {s.id < currentStep ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                s.id
              )}
            </span>
            <span
              className={`mt-1 text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                isError
                  ? 'text-red-500'
                  : s.id === currentStep
                  ? 'text-brand-600 dark:text-brand-400'
                  : s.id < currentStep
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {s.label}
            </span>
          </div>
          {/* Connector line */}
          {i < steps.length - 1 && (
            <div
              className={`w-8 sm:w-14 h-0.5 mx-1 sm:mx-2 rounded mb-5 transition-colors duration-500 ${
                s.id < currentStep ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          )}
        </div>
        );
      })}
    </div>
  );
}
