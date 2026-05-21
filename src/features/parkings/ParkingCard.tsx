import React from 'react';
import { Card, Space, Tag, Typography } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ParkingStructure } from './parkingTypes';
import styles from './ParkingCard.module.scss';
import { AppRoute } from '../../constants';

interface ParkingCardProps {
  parking: ParkingStructure;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const spacesClass = (parking: ParkingStructure): string => {
  const base = styles.parkingCardSpaces;
  if (parking.totalCapacity > 0) {
    const ratio = parking.availableSpaces / parking.totalCapacity;
    if (ratio === 0) return `${base} ${styles.parkingCardSpacesFull}`;
    if (ratio < 0.1) return `${base} ${styles.parkingCardSpacesLow}`;
  }
  return base;
};

const ParkingCard: React.FC<ParkingCardProps> = ({
  parking,
  isFavorite,
  onToggleFavorite,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${AppRoute.parkings}/${encodeURIComponent(parking.id)}`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(parking.id);
  };

  return (
    <Card
      className={styles.parkingCard}
      onClick={handleClick}
      data-testid={`parking-card-${parking.id}`}
      hoverable
    >
      <div className={styles.parkingCardRow}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className={styles.parkingCardTitleWrap}>
            <button
              type="button"
              className={styles.parkingCardFavorite}
              onClick={handleFavorite}
              aria-label={
                isFavorite
                  ? `Unmark ${parking.name} as favorite`
                  : `Mark ${parking.name} as favorite`
              }
              data-testid={`favorite-${parking.id}`}
            >
              {isFavorite ? <StarFilled /> : <StarOutlined />}
            </button>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {parking.name}
            </Typography.Title>
            <Space size={4}>
              {parking.isOpen ? (
                <Tag color="green">Open</Tag>
              ) : (
                <Tag color="red">Closed</Tag>
              )}
              {parking.category && (
                <Tag color="blue">{parking.category}</Tag>
              )}
            </Space>
          </div>
          <div className={styles.parkingCardAddress}>{parking.address}</div>
        </div>
        <div>
          <div
            className={spacesClass(parking)}
            data-testid={`spaces-${parking.id}`}
          >
            {parking.availableSpaces}
          </div>
          <div className={styles.parkingCardSpacesLabel}>
            of {parking.totalCapacity} free
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ParkingCard;
