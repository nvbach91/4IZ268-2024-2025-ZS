import useSWR from 'swr';
import { APIs, fetcher, putter } from '../utils.js';

export function useTodoLists() {
  const { data = [], mutate } = useSWR({ url: APIs.TodoLists }, fetcher);

  return {
    data,
    async newList(newListName, icon) {
      const newListData = {
        name: newListName,
        icon: icon || 'List',
      };

      return await mutate(
        await putter({
          url: APIs.TodoLists,
          ...newListData,
        }),
        {
          populateCache: false,
          revalidate: true,
          optimisticData: (oldData) => [
            ...oldData,
            { id: crypto.randomUUID(), ...newListData },
          ],
        }
      );
    },
    async updateList(listToUpdate, newListName) {
      return await mutate(
        await putter({
          url: APIs.TodoListsUpdate,
          listId: listToUpdate,
          name: newListName,
        }),
        {
          populateCache: false,
          optimisticData: (oldData) =>
            oldData.map((d) => {
              if (d.id === listToUpdate) {
                return { ...d, name: newListName };
              }
              return d;
            }),
        }
      );
    },
    // FIX - deleting list
    async deleteList(listToDelete) {
      return await mutate(
        await putter({
          url: APIs.TodoListsDelete,
          listId: listToDelete,
        }),
        {
          populateCache: false,
          optimisticData: (oldData) => 
            oldData.filter(({ id }) => id !== listToDelete)
        }
      );
    },
  };
}