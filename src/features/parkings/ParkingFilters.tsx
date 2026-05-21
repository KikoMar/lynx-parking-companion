import React from 'react';
import { Input, Select } from 'antd';
import { ParkingSortOption } from './parkingTypes';

interface ParkingFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: ParkingSortOption;
  onSortChange: (value: ParkingSortOption) => void;
}

const sortOptions: { value: ParkingSortOption; label: string }[] = [
  { value: 'name-asc', label: 'Name (A → Z)' },
  { value: 'name-desc', label: 'Name (Z → A)' },
  { value: 'spaces-desc', label: 'Available spaces (high → low)' },
  { value: 'spaces-asc', label: 'Available spaces (low → high)' },
];

const ParkingFilters: React.FC<ParkingFiltersProps> = ({
  search,
  onSearchChange,
  sort,
  onSortChange,
}) => (
  <div className="filters">
    <Input.Search
      allowClear
      placeholder="Search by parking name"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      aria-label="Search parkings"
    />
    <Select<ParkingSortOption>
      value={sort}
      onChange={onSortChange}
      options={sortOptions}
      aria-label="Sort parkings"
    />
  </div>
);

export default ParkingFilters;
