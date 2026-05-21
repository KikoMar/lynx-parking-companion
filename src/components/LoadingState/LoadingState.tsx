import React from 'react';
import { Skeleton } from 'antd';
import styles from './LoadingState.module.scss';

interface LoadingStateProps {
  rows?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ rows = 4 }) => (
  <div className={styles.stateWrap} data-testid="loading-state">
    <Skeleton active paragraph={{ rows }} />
  </div>
);

export default LoadingState;
