import React from 'react';
import { Button, Form, Input, Space } from 'antd';
import { UserProfile } from './profileTypes';

interface ProfileFormProps {
  initialValues?: UserProfile | null;
  submitLabel?: string;
  onSubmit: (values: UserProfile) => void;
  extraActions?: React.ReactNode;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialValues,
  submitLabel = 'Save',
  onSubmit,
  extraActions,
}) => {
  const [form] = Form.useForm<UserProfile>();

  return (
    <Form<UserProfile>
      form={form}
      layout="vertical"
      initialValues={initialValues ?? undefined}
      onFinish={onSubmit}
      requiredMark
    >
      <Form.Item
        label="First name"
        name="firstName"
        rules={[{ required: true, message: 'First name is required' }]}
      >
        <Input placeholder="Jane" />
      </Form.Item>
      <Form.Item
        label="Last name"
        name="lastName"
        rules={[{ required: true, message: 'Last name is required' }]}
      >
        <Input placeholder="Doe" />
      </Form.Item>
      <Form.Item
        label="License plate"
        name="licensePlate"
        rules={[{ required: true, message: 'License plate is required' }]}
      >
        <Input placeholder="1-ABC-123" />
      </Form.Item>
      <Form.Item
        label="Car make"
        name="carMake"
        rules={[{ required: true, message: 'Car make is required' }]}
      >
        <Input placeholder="Volkswagen" />
      </Form.Item>
      <Form.Item
        label="Car model"
        name="carModel"
        rules={[{ required: true, message: 'Car model is required' }]}
      >
        <Input placeholder="Golf" />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {submitLabel}
          </Button>
          {extraActions}
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ProfileForm;
