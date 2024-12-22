import React from "react";

type LoaderProps = {
  loading: boolean;
  fallback: React.ReactNode;
  children: React.ReactNode;
};

export const CustomLoader: React.FC<LoaderProps> = ({ loading, fallback, children }) => {
  return <>{loading ? fallback : children}</>;
};
