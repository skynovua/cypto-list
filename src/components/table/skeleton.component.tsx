import React from "react";

interface SkeletonProps {
  width: string;
  height: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width, height }) => {
  return (
    <div
      style={{ width, height }}
      className="animate-pulse bg-gray-200 rounded-md"
    ></div>
  );
};
