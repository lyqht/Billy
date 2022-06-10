import {
  IndexPath,
  Select,
  SelectGroup,
  SelectItem,
} from '@ui-kitten/components';
import React from 'react';
import {defaultCategories} from '../../constants/PayeeOptions';

export const categoriesForMultiSelect = {
  'Default Categories': defaultCategories,
};

export const getDisplayValueFromIndexPath = (
  index: IndexPath,
  dict: Record<string, string[]>,
) => {
  const groupTitle = Object.keys(dict)[index.section!];
  return dict[groupTitle][index.row];
};

export const getAllValuesFromIndexPaths = (
  indexPaths: IndexPath[],
  dict: Record<string, string[]>,
) =>
  indexPaths.map(index => {
    return getDisplayValueFromIndexPath(index, dict);
  });

interface Props {
  selectedIndexes: IndexPath[];
  onSelect: (indexPath: IndexPath | IndexPath[]) => void;
  items: Record<string, string[]>;
  value: React.ReactText;
  label?: string;
}

export const CustomMultiSelect: React.FC<Props> = ({
  selectedIndexes: selectedIndex,
  onSelect,
  items,
  value,
  label = 'Label',
}) => {
  return (
    <Select
      multiSelect={true}
      selectedIndex={selectedIndex}
      onSelect={onSelect}
      value={value}
      label={label}
      status={'primary'}
      accessibilityLabel={label}
    >
      {Object.entries(items).map(([group, groupItems]) => (
        <SelectGroup key={`category-group-option-${group}`} title={group}>
          {groupItems.map(item => (
            <SelectItem key={`category-option-${item}`} title={item} />
          ))}
        </SelectGroup>
      ))}
    </Select>
  );
};
