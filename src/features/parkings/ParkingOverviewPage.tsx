import React, { useMemo, useState } from 'react';
import { Empty, Input, Select, Skeleton, Space, Typography } from 'antd';
import { useParkingsQuery } from './parkingApi';
import styles from './ParkingOverviewPage.module.scss';
import { useParkingStore } from './parkingStore';
import { ParkingSortOption } from './parkingTypes';
import { filterParkingsByName, sortParkings, pinFavoriteFirst } from './parkingUtils';
import ParkingCard from './ParkingCard';
import ErrorState from '../../components/ErrorState/ErrorState';

const sortOptions: { value: ParkingSortOption; label: string }[] = [
  { value: 'name-asc', label: 'Name (A → Z)' },
  { value: 'name-desc', label: 'Name (Z → A)' },
  { value: 'spaces-desc', label: 'Available spaces (high → low)' },
  { value: 'spaces-asc', label: 'Available spaces (low → high)' },
];

const ParkingOverviewPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<ParkingSortOption>('name-asc');

  const { data, isLoading, isError, refetch } = useParkingsQuery();
  const favoriteId = useParkingStore((s) => s.favoriteParkingId);
  const toggleFavorite = useParkingStore((s) => s.toggleFavorite);

  const parkings = useMemo(() => {
    const filtered = filterParkingsByName(data ?? [], search);
    const sorted = sortParkings(filtered, sort);
    return pinFavoriteFirst(sorted, favoriteId);
  }, [data, search, sort, favoriteId]);

  return (
    <div data-testid="parking-overview">
      <div className={styles.pageHeader}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Ghent parkings
        </Typography.Title>
      </div>
      <div className={styles.filters}>
        <Input.Search
          allowClear
          placeholder="Search by parking name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search parkings"
        />
        <Select<ParkingSortOption>
          value={sort}
          onChange={setSort}
          options={sortOptions}
          aria-label="Sort parkings"
        />
      </div>

      {isLoading && <Skeleton active paragraph={{ rows: 6 }} />}
      {isError && (
        <ErrorState
          message="Could not load parkings"
          description="There was a problem reaching the Ghent open data API."
          onRetry={() => refetch()}
        />
      )}
      {!isLoading && !isError && parkings.length === 0 && (
        <Empty description="No parkings match your search" />
      )}

      {!isLoading && !isError && parkings.length > 0 && (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {parkings.map((p) => (
            <ParkingCard
              key={p.id}
              parking={p}
              isFavorite={favoriteId === p.id}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </Space>
      )}
    </div>
  );
};

export default ParkingOverviewPage;

