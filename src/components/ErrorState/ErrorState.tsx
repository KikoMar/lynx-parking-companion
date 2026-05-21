import React from 'react';
import { Alert, Button, Space } from 'antd';

interface ErrorStateProps {
  message?: string;
  description?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong',
  description = 'We could not load the data. Please try again.',
  onRetry,
}) => (
  <div className="state-wrap" data-testid="error-state">
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Alert
        type="error"
        showIcon
        message={message}
        description={description}
      />
      {onRetry && (
        <Button type="primary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Space>
  </div>
);

export default ErrorState;
