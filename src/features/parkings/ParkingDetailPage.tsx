import React from 'react';
import { Button, Card, Space, Tag, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useParkingsQuery } from './parkingApi';
import LoadingState from '../../components/LoadingState/LoadingState';
import ErrorState from '../../components/ErrorState/ErrorState';
import EmptyState from '../../components/EmptyState/EmptyState';
import { ParkingStructure } from './parkingTypes';

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <div>
    <div className="parking-detail__item-label">{label}</div>
    <div className="parking-detail__item-value">{value || '—'}</div>
  </div>
);

const buildMapsUrl = (p: ParkingStructure): string | null => {
  if (p.latitude == null || p.longitude == null) return null;
  return `https://www.google.com/maps?q=${p.latitude},${p.longitude}&z=16&output=embed`;
};

const ParkingDetailPage: React.FC = () => {
  const { parkingId } = useParams<{ parkingId: string }>();
  const decodedId = parkingId ? decodeURIComponent(parkingId) : '';
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useParkingsQuery();

  if (isLoading) return <LoadingState rows={6} />;
  if (isError) {
    return (
      <ErrorState
        message="Could not load parking details"
        onRetry={() => refetch()}
      />
    );
  }

  const parking = data?.find((p) => p.id === decodedId);
  if (!parking) {
    return (
      <>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/parkings')}
          style={{ marginBottom: 16 }}
        >
          Back to parkings
        </Button>
        <EmptyState description="Parking not found" />
      </>
    );
  }

  const mapsUrl = buildMapsUrl(parking);

  return (
    <div data-testid="parking-detail">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/parkings')}
        style={{ marginBottom: 16 }}
      >
        Back to parkings
      </Button>
      <Card>
        <div className="parking-detail__header">
          <Space size="small" wrap>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {parking.name}
            </Typography.Title>
            {parking.isOpen ? (
              <Tag color="green">Open</Tag>
            ) : (
              <Tag color="red">Closed</Tag>
            )}
            {parking.temporaryClosed && (
              <Tag color="orange">Temporarily closed</Tag>
            )}
          </Space>
          {parking.description && (
            <Typography.Paragraph
              type="secondary"
              style={{ marginTop: 8, marginBottom: 0 }}
            >
              {parking.description}
            </Typography.Paragraph>
          )}
        </div>

        <div className="parking-detail__grid">
          <DetailItem
            label="Available spaces"
            value={
              <strong style={{ fontSize: 20, color: '#1677ff' }}>
                {parking.availableSpaces} / {parking.totalCapacity}
              </strong>
            }
          />
          <DetailItem label="Address" value={parking.address} />
          <DetailItem label="Opening hours" value={parking.openingHours} />
          <DetailItem label="Operator" value={parking.operator} />
          <DetailItem label="Category" value={parking.category} />
          <DetailItem label="Parking type" value={parking.type} />
          <DetailItem
            label="Website"
            value={
              parking.website ? (
                <a
                  href={parking.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit website
                </a>
              ) : (
                '—'
              )
            }
          />
          {parking.extraInfo && (
            <DetailItem label="Notice" value={parking.extraInfo} />
          )}
        </div>

        {mapsUrl && (
          <iframe
            title={`Map of ${parking.name}`}
            className="parking-detail__map"
            src={mapsUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </Card>
    </div>
  );
};

export default ParkingDetailPage;
