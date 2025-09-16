import { Options } from './hooks/useSelect';

export const getKey = (table: string, options: Options) => {
  const { filter, props } = options;

  let key = table;

  if (filter) {
    key += `-${JSON.stringify(filter)}`;
  }

  if (props) {
    key += `-${JSON.stringify(props)}`;
  }

  return key;
};

export const handleMutation = <T extends { id: string }>(
  type: 'INSERT' | 'UPDATE' | 'DELETE',
  currentData: T[] | null | undefined,
  newData: T,
  oldData: T
) => {
  let newItems;

  if (type === 'INSERT') {
    newItems = [...(currentData || []), newData];
  } else if (type === 'UPDATE') {
    newItems = currentData?.map((item) => {
      if (item.id === newData.id) {
        return {
          ...item,
          ...newData,
        };
      }
      return item;
    });
  }

  if (type === 'DELETE') {
    newItems = currentData?.filter((item) => {
      return item.id !== oldData.id;
    });
  }

  return newItems;
};
