import { initializeApp } from '@firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  connectFirestoreEmulator,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
  addDoc,
} from '@firebase/firestore';
import { getAuth, signInAnonymously } from '@firebase/auth';
import ShortUniqueId from 'short-unique-id';
import { Member } from './apiHooks';

const config = {
  apiKey: 'AIzaSyBLWgnEjIn6Rg6ZFEj4lP0bdYJsVs_VW24',
  authDomain: 'scrum-poker-98227.firebaseapp.com',
  databaseURL: 'https://scrum-poker-98227.firebaseio.com',
  projectId: 'scrum-poker-98227',
  storageBucket: 'scrum-poker-98227.appspot.com',
  messagingSenderId: '450465622076',
  appId: '1:450465622076:web:7f1a3cad81b66d12f7fb39',
  measurementId: 'G-XKVM3913F8',
};

initializeApp(config);
const db = getFirestore();
export default db;

if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Point to the RTDB emulator running on localhost.
  console.log('emulator on');
  connectFirestoreEmulator(db, 'localhost', 3006);
}

const auth = getAuth();
signInAnonymously(auth);

export type Round = {
  resolvedAt: Timestamp;
  members: Member[];
};

/**
 * check if member exists,
 * return the member if it exists to let the user log in as this member
 */
const doesMemberExistsInTeam = async (teamId: string, memberName: string) => {
  const membersCollection = collection(db, 'teams', teamId, 'members');

  const q = query(
    membersCollection,
    where('name_lowercase', '==', memberName.toLocaleLowerCase())
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const existingMember = querySnapshot.docs[0].data() as Member;
    return existingMember;
  }
  return false;
};

const api = {
  getTeam: async (teamId: string) => {
    if (!teamId) return;

    const docRef = doc(db, 'teams', teamId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        error: "Team doesn't exist",
      };
    }

    return docSnap;
  },

  doesTeamExists: async (teamId: string) => {
    const docRef = doc(db, 'teams', teamId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  },

  setTeam: async (teamName: string, cardMode: string) => {
    if (!teamName) return;

    const uid = new ShortUniqueId({ length: 10 });
    const teamId = `${teamName
      .replace(/\s/g, '-') // replace white space characters with '-'
      .toLocaleLowerCase()}-${uid()}`;

    await setDoc(doc(db, 'teams', teamId), {
      name: teamName,
      cardMode,
      created: Timestamp.now(),
    });

    return teamId;
  },

  updateTeam: async (teamId?: string | null, payload?: any) => {
    if (!teamId) return;

    const teamDoc = doc(db, 'teams', teamId);
    const newTeam = {
      updated: Timestamp.now(),
      ...payload,
    };
    return await updateDoc(teamDoc, newTeam);
  },

  getMember: async (teamId: string, memberId: string) => {
    if (!teamId || !memberId) return;

    const docRef = doc(db, 'teams', teamId, 'members', memberId);
    const docSnap = await getDoc(docRef);
    return docSnap;
  },

  addMember: async (teamId: string, memberName: string) => {
    const existingMember = await doesMemberExistsInTeam(teamId, memberName);
    if (existingMember)
      return {
        type: 'EXISTING',
        member: existingMember,
      };

    const uid = new ShortUniqueId({ length: 10 });
    const memberId = `${memberName
      .replace(/\s/g, '-') // replace white space characters with '-'
      .toLocaleLowerCase()}-${uid()}`;

    const memberDoc = doc(db, 'teams', teamId, 'members', memberId);

    const newMember = {
      name: memberName,
      id: memberId,
      name_lowercase: memberName.toLocaleLowerCase(), // to query case insensitive
      state: 'active',
    } as Member;

    // add memberId to be able to remove a specific member
    await setDoc(memberDoc, newMember);

    return { member: newMember, type: 'NEW' };
  },

  updateMember: async (teamId: string, memberId: string, payload?: any) => {
    if (!memberId || !teamId) return;

    const memberDoc = doc(db, 'teams', teamId, 'members', memberId);
    await updateDoc(memberDoc, payload);
  },

  removeMember: async (teamId: string, memberId: string) => {
    if (!memberId) return;
    const docRef = doc(db, 'teams', teamId, 'members', memberId);
    await updateDoc(docRef, { state: 'removed' });
  },

  addRound: async (teamId?: string, round?: Round) => {
    if (!teamId || !round) return;

    const docRef = collection(db, 'teams', teamId, 'rounds');
    await addDoc(docRef, round);
  },
};

export { api };
