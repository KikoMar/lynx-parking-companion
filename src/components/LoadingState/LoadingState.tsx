import React from 'react';
import { Skeleton } from 'antd';

interface LoadingStateProps {
  rows?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ rows = 4 }) => (
  <div className="state-wrap" data-testid="loading-state">
    <Skeleton active paragraph={{ rows }} />
  </div>
);

export default LoadingState;
