import React from "react";

export default function Loading({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="flex items-center justify-center w-full h-full">
      <svg className="spinner" viewBox="0 0 50 50">
        <circle
          className="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="3"
        ></circle>
      </svg>
    </div>
  );
}
