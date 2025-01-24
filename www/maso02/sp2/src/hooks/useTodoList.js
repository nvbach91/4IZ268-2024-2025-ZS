import useSWR from 'swr';
import { APIs, fetcher, putter } from '../utils.js';
import { auth } from "../firebase.js";

export function useTodoList(currentList) {
  const { data, mutate } = useSWR(
    () => currentList && { url: APIs.TodoList, id: currentList },
    fetcher
  );

  return {
    data,
    async newItem(newItemName) {
      const newItemsData = {
        name: newItemName,
        checked: false,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser?.displayName || "Anonymous",
        createdByEmail: auth.currentUser?.email || "Unknown",
        listId: currentList,
      };
      
      return await mutate(
        await putter({
          url: APIs.TodoList,
          listId: currentList,
          ...newItemsData,
        }),
        {
          populateCache: false,
          optimisticData: (oldData) => {
            const updatedItems = oldData?.items
              ? [...oldData.items, newItemsData]
              : [newItemsData];
            return {
              ...oldData,
              items: updatedItems,
            };
          },
        }
      );
    },
    async deleteItem(itemToDelete) {
      return await mutate(
        await putter({
          url: APIs.TodoListDelete,
          id: itemToDelete,
        }),
        {
          populateCache: false,
          optimisticData: oldData => ({
            ...oldData,
            items: oldData.items.filter(({ id }) => id !== itemToDelete),
          }),
        }
      );
    },
    async toggleChecked(itemToToggle) {
      const item = data.items.find(({ id }) => id === itemToToggle);
      return await mutate(
        await putter({
          url: APIs.TodoListUpdate,
          id: itemToToggle,
          checked: !item.checked,
        }),
        {
          populateCache: false,
          optimisticData: oldData => {
            const oldItem = oldData.items.find(({ id }) => id === itemToToggle);
            return {
              ...oldData,
              items: [
                ...oldData.items.slice(
                  0,
                  oldData.items.findIndex(({ id }) => id === itemToToggle)
                ),
                { ...oldItem, checked: !oldItem.checked },
                ...oldData.items.slice(
                  oldData.items.findIndex(({ id }) => id === itemToToggle) + 1
                ),
              ],
            };
          },
        }
      );
    },
    async updateItem(itemToUpdate, newItemName) {
      return await mutate(
        await putter({
          url: APIs.TodoListUpdate,
          id: itemToUpdate,
          name: newItemName,
        }),
        {
          populateCache: false,
          optimisticData: oldData => {
            const oldItem = oldData.items.find(({ id }) => id === itemToUpdate);
            return {
              ...oldData,
              items: [
                ...oldData.items.slice(
                  0,
                  oldData.items.findIndex(({ id }) => id === itemToUpdate)
                ),
                { ...oldItem, name: newItemName },
                ...oldData.items.slice(
                  oldData.items.findIndex(({ id }) => id === itemToUpdate) + 1
                ),
              ],
            };
          },
        }
      );
    },
  };
}