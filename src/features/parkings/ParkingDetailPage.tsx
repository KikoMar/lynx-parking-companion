import React from 'react';
import { Button, Card, Empty, Skeleton, Space, Tag, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styles from './ParkingDetailPage.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useParkingsQuery } from './parkingApi';
import ErrorState from '../../components/ErrorState/ErrorState';
import { AppRoute } from '../../constants';

const ParkingDetailPage: React.FC = () => {
  const { parkingId } = useParams<{ parkingId: string }>();
  const decodedId = parkingId ? decodeURIComponent(parkingId) : '';
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useParkingsQuery();

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;
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
          onClick={() => navigate(AppRoute.parkings)}
          style={{ marginBottom: 16 }}
        >
          Back to parkings
        </Button>
        <Empty description="Parking not found" />
      </>
    );
  }

  const mapsUrl =
    parking.latitude != null && parking.longitude != null
      ? `https://www.google.com/maps?q=${parking.latitude},${parking.longitude}&z=16&output=embed`
      : null;

  // TODO: show lastUpdate somewhere on this page

  return (
    <div data-testid="parking-detail">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(AppRoute.parkings)}
        style={{ marginBottom: 16 }}
      >
        Back to parkings
      </Button>
      <Card>
        <div className={styles.parkingDetailHeader}>
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

        <div className={styles.parkingDetailGrid}>
          <div>
            <div className={styles.parkingDetailItemLabel}>Available spaces</div>
            <div className={styles.parkingDetailItemValue}>
              <strong style={{ fontSize: 20, color: '#1677ff' }}>
                {parking.availableSpaces} / {parking.totalCapacity}
              </strong>
            </div>
          </div>
          <div>
            <div className={styles.parkingDetailItemLabel}>Address</div>
            <div className={styles.parkingDetailItemValue}>{parking.address || '—'}</div>
          </div>
          <div>
            <div className={styles.parkingDetailItemLabel}>Opening hours</div>
            <div className={styles.parkingDetailItemValue}>{parking.openingHours || '—'}</div>
          </div>
          <div>
            <div className={styles.parkingDetailItemLabel}>Operator</div>
            <div className={styles.parkingDetailItemValue}>{parking.operator || '—'}</div>
          </div>
          <div>
            <div className={styles.parkingDetailItemLabel}>Category</div>
            <div className={styles.parkingDetailItemValue}>{parking.category || '—'}</div>
          </div>
          <div>
            <div className={styles.parkingDetailItemLabel}>Parking type</div>
            <div className={styles.parkingDetailItemValue}>{parking.type || '—'}</div>
          </div>
          <div>
            <div className={styles.parkingDetailItemLabel}>Website</div>
            <div className={styles.parkingDetailItemValue}>
              {parking.website ? (
                <a href={parking.website} target="_blank" rel="noopener noreferrer">
                  Visit website
                </a>
              ) : (
                '—'
              )}
            </div>
          </div>
          {parking.extraInfo && (
            <div>
              <div className={styles.parkingDetailItemLabel}>Notice</div>
              <div className={styles.parkingDetailItemValue}>{parking.extraInfo}</div>
            </div>
          )}
        </div>

        {mapsUrl && (
          <iframe
            title={`Map of ${parking.name}`}
            className={styles.parkingDetailMap}
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

