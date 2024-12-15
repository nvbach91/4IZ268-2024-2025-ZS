import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

// Add a new group
async function addGroup(groupName, members) {
  try {
    const docRef = await addDoc(collection(db, "groups"), {
      name: groupName,
      members: members,
      createdAt: new Date(),
    });
    console.log("Group added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding group:", error.message);
  }
}

// Fetch all groups
async function getGroups() {
  try {
    const querySnapshot = await getDocs(collection(db, "groups"));
    const groups = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Groups fetched:", groups);
    return groups;
  } catch (error) {
    console.error("Error fetching groups:", error.message);
  }
}

// Add or update an event
async function addEvent(groupId, eventData) {
  try {
    const groupRef = doc(db, "groups", groupId);
    await setDoc(groupRef, { events: eventData }, { merge: true });
    console.log("Event added/updated for group:", groupId);
  } catch (error) {
    console.error("Error adding event:", error.message);
  }
}

export { addGroup, getGroups, addEvent };
