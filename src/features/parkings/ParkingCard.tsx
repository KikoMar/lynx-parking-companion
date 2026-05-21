import React from 'react';
import { Card, Space, Tag, Typography } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ParkingStructure } from './parkingTypes';

interface ParkingCardProps {
  parking: ParkingStructure;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const spacesClass = (parking: ParkingStructure): string => {
  if (parking.totalCapacity > 0) {
    const ratio = parking.availableSpaces / parking.totalCapacity;
    if (ratio === 0) return 'parking-card__spaces parking-card__spaces--full';
    if (ratio < 0.1) return 'parking-card__spaces parking-card__spaces--low';
  }
  return 'parking-card__spaces';
};

const ParkingCard: React.FC<ParkingCardProps> = ({
  parking,
  isFavorite,
  onToggleFavorite,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/parkings/${encodeURIComponent(parking.id)}`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(parking.id);
  };

  return (
    <Card
      className="parking-card"
      onClick={handleClick}
      data-testid={`parking-card-${parking.id}`}
      hoverable
    >
      <div className="parking-card__row">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="parking-card__title-wrap">
            <button
              type="button"
              className="parking-card__favorite"
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
          <div className="parking-card__address">{parking.address}</div>
        </div>
        <div>
          <div
            className={spacesClass(parking)}
            data-testid={`spaces-${parking.id}`}
          >
            {parking.availableSpaces}
          </div>
          <div className="parking-card__spaces-label">
            of {parking.totalCapacity} free
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ParkingCard;
