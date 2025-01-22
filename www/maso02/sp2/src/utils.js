import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

export const APIs = {
  TodoLists: "todo-lists",
  TodoListsUpdate: "todo-lists-update",
  TodoList: "todo-list",
  TodoListDelete: "todo-list-delete",
  TodoListUpdate: "todo-list-update",
};

export async function fetcher({ url, ...variables }) {
  switch (url) {
    case APIs.TodoLists:
      const listsSnapshot = await getDocs(collection(db, "lists"));
      return listsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    case APIs.TodoList:
      if (!variables.id) {
        throw new Error("Missing listId for fetching TodoList.");
      }
      const listDoc = await getDoc(doc(db, "lists", variables.id));
      const itemsQuery = query(
        collection(db, "listItems"),
        where("listId", "==", variables.id)
      );
      const itemsSnapshot = await getDocs(itemsQuery);
      return {
        ...listDoc.data(),
        id: listDoc.id,
        items: itemsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      };

    default:
      throw new Error(`Unknown API ${url}`);
  }
}

export async function putter({ url, listId, id, ...variables }) {
  switch (url) {
    case APIs.TodoLists:
      return await addDoc(collection(db, "lists"), {
        name: variables.name,
        icon: variables.icon || "List",
      });
    case APIs.TodoListsUpdate:
      if (!listId) {
        throw new Error("Missing listId for updating TodoList.");
      }
      return await updateDoc(doc(db, "lists", listId), { name: variables.name });

    case APIs.TodoList:
      return await addDoc(collection(db, "listItems"), {
        listId,
        name: variables.name,
        checked: variables.checked ?? false,
        createdAt: variables.createdAt || new Date().toISOString(),
        createdBy: variables.createdBy || "Anonymous",
        createdByEmail: variables.createdByEmail || "Unknown",
      });

    case APIs.TodoListDelete:
      if (!id) {
        throw new Error("Missing item id for deletion.");
      }
      return await deleteDoc(doc(db, "listItems", id));

    case APIs.TodoListUpdate:
      if (!id) {
        throw new Error("Missing item id for updating.");
      }
      return await updateDoc(doc(db, "listItems", id), variables);

    default:
      throw new Error(`Unknown API ${url}`);
  }
}
