import React from 'react';

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-300 dark:border-gray-600 border-t-primary`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export function LoadingSkeleton({ className = '', height = 'h-4', width = 'w-full' }) {
  return (
    <div
      className={`${height} ${width} bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}
      role="status"
      aria-label="Loading content"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function LessonLoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-6">
        <LoadingSkeleton height="h-4" width="w-48" />
      </div>

      {/* Header skeleton */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <LoadingSkeleton height="h-10" width="w-96" className="mb-4" />
          <LoadingSkeleton height="h-8" width="w-8" className="rounded-full" />
        </div>
        <div className="flex items-center gap-4 mb-2">
          <LoadingSkeleton height="h-5" width="w-20" />
          <LoadingSkeleton height="h-5" width="w-24" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        <LoadingSkeleton height="h-8" width="w-64" />
        <LoadingSkeleton height="h-4" width="w-full" />
        <LoadingSkeleton height="h-4" width="w-11/12" />
        <LoadingSkeleton height="h-4" width="w-full" />
        <LoadingSkeleton height="h-4" width="w-4/5" />
        
        <div className="pt-6">
          <LoadingSkeleton height="h-32" width="w-full" className="mb-4" />
        </div>

        <LoadingSkeleton height="h-4" width="w-full" />
        <LoadingSkeleton height="h-4" width="w-10/12" />
        <LoadingSkeleton height="h-4" width="w-full" />
      </div>

      {/* Navigation buttons skeleton */}
      <div className="mt-8 flex items-center justify-between">
        <LoadingSkeleton height="h-10" width="w-32" />
        <LoadingSkeleton height="h-10" width="w-40" />
        <LoadingSkeleton height="h-10" width="w-32" />
      </div>
    </div>
  );
}

export function CommandsLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="mb-6">
        <LoadingSkeleton height="h-10" width="w-64" className="mb-4" />
        <LoadingSkeleton height="h-4" width="w-96" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <LoadingSkeleton height="h-6" width="w-32" className="mb-3" />
            <LoadingSkeleton height="h-4" width="w-full" className="mb-2" />
            <LoadingSkeleton height="h-4" width="w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExamplesLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="mb-6">
        <LoadingSkeleton height="h-10" width="w-64" className="mb-4" />
        <LoadingSkeleton height="h-4" width="w-96" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <LoadingSkeleton height="h-6" width="w-48" className="mb-4" />
            <LoadingSkeleton height="h-32" width="w-full" className="mb-4" />
            <div className="flex gap-2">
              <LoadingSkeleton height="h-6" width="w-20" />
              <LoadingSkeleton height="h-6" width="w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardLoadingSkeleton({ count = 3 }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
        >
          <LoadingSkeleton height="h-6" width="w-3/4" className="mb-4" />
          <LoadingSkeleton height="h-4" width="w-full" className="mb-2" />
          <LoadingSkeleton height="h-4" width="w-5/6" />
        </div>
      ))}
    </>
  );
}
