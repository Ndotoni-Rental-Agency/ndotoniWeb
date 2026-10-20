'use client';

import React from 'react';
import { STEPS } from './constants';
import design from '@/components/design/Brand.module.css';

interface StepIndicatorProps {
  currentStep: number;
  errorStep?: number | null;
  steps?: ReadonlyArray<{ id: number; label: string }>;
}

export function StepIndicator({ currentStep, errorStep, steps = STEPS }: StepIndicatorProps) {
  return (
    <ol className={design.stepper} style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
      {steps.map((step) => {
        const isError = errorStep === step.id && step.id === currentStep;
        const current = step.id === currentStep;
        const complete = step.id < currentStep;
        return (
          <li key={step.id} aria-current={current ? 'step' : undefined} className={design.stepItem}>
            <span className={`${design.stepNumber} ${isError ? 'bg-red-500 text-white animate-attention' : current ? 'bg-brand-700 text-white ring-4 ring-brand-100 dark:ring-brand-900' : complete ? 'bg-brand-700 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
              {complete ? <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : step.id}
            </span>
            <span className={`${design.stepLabel} ${isError ? 'text-red-600' : current || complete ? 'text-brand-700 dark:text-brand-300' : 'text-gray-500 dark:text-gray-400'}`}>{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
