import React, { useMemo, useState } from 'react';
import { Space, Typography } from 'antd';
import { useParkingsQuery } from './parkingApi';
import styles from './ParkingOverviewPage.module.scss';
import { useParkingStore } from './parkingStore';
import { ParkingSortOption } from './parkingTypes';
import { preparedParkingList } from './parkingUtils';
import ParkingCard from './ParkingCard';
import ParkingFilters from './ParkingFilters';
import LoadingState from '../../components/LoadingState/LoadingState';
import ErrorState from '../../components/ErrorState/ErrorState';
import EmptyState from '../../components/EmptyState/EmptyState';

const ParkingOverviewPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<ParkingSortOption>('name-asc');

  const { data, isLoading, isError, refetch } = useParkingsQuery();
  const favoriteId = useParkingStore((s) => s.favoriteParkingId);
  const toggleFavorite = useParkingStore((s) => s.toggleFavorite);

  const parkings = useMemo(
    () => preparedParkingList(data ?? [], search, sort, favoriteId),
    [data, search, sort, favoriteId]
  );

  return (
    <div data-testid="parking-overview">
      <div className={styles.pageHeader}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Ghent parkings
        </Typography.Title>
      </div>
      <ParkingFilters
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
      />

      {isLoading && <LoadingState rows={6} />}
      {isError && (
        <ErrorState
          message="Could not load parkings"
          description="There was a problem reaching the Ghent open data API."
          onRetry={() => refetch()}
        />
      )}
      {!isLoading && !isError && parkings.length === 0 && (
        <EmptyState description="No parkings match your search" />
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
