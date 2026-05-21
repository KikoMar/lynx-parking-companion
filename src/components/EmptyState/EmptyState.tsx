import React from 'react';
import { Empty } from 'antd';

interface EmptyStateProps {
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  description = 'No results',
}) => (
  <div className="state-wrap" data-testid="empty-state">
    <Empty description={description} />
  </div>
);

export default EmptyState;
