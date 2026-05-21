import React from 'react';
import { Empty } from 'antd';
import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  description = 'No results',
}) => (
  <div className={styles.stateWrap} data-testid="empty-state">
    <Empty description={description} />
  </div>
);

export default EmptyState;
