import { initializeApp } from '@firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  connectFirestoreEmulator,
  getDoc,
  updateDoc,
} from '@firebase/firestore';
import { getAuth, signInAnonymously } from '@firebase/auth';
import ShortUniqueId from 'short-unique-id';

const config = {
  apiKey: 'AIzaSyBLWgnEjIn6Rg6ZFEj4lP0bdYJsVs_VW24',
  authDomain: 'scrum-poker-98227.firebaseapp.com',
  databaseURL: 'https://scrum-poker-98227.firebaseio.com',
  projectId: 'scrum-poker-98227',
  storageBucket: 'scrum-poker-98227.appspot.com',
  messagingSenderId: '450465622076',
};

initializeApp(config);
const db = getFirestore();
export default db;

if (location.hostname === 'localhost') {
  // Point to the RTDB emulator running on localhost.
  console.log('emulator on');
  connectFirestoreEmulator(db, 'localhost', 3006);
}

const auth = getAuth();
signInAnonymously(auth)
  .then((u) => console.log('signed in'))
  .catch((error) => console.log(error));

const teamsRef = collection(db, 'teams');

const api = {
  getTeam: async (teamName: string) => {
    if (!teamName) {
      console.error('getTeam(): team is not defined');
    }
    const docRef = doc(db, 'teams', teamName);
    const docSnap = await getDoc(docRef);
    return docSnap;
  },

  setTeam: async (teamName: string, cardMode: string) => {
    if (!teamName) console.error('setTeam()', 'team is not defined');

    const uid = new ShortUniqueId({ length: 10 });
    const teamId = `${teamName
      .replace(/\s/g, '-') // replace white space characters with '-'
      .toLocaleLowerCase()}-${uid()}`;

    await setDoc(doc(db, 'teams', teamId), {
      name: teamName,
      cardMode,
    });

    return teamId;
  },

  updateTeam: async (teamId?: string | null, payload?: any) => {
    if (!teamId) {
      console.error('updateTeam()', 'team is not defined');
      return;
    }

    const teamDoc = doc(db, 'teams', teamId);
    return await updateDoc(teamDoc, payload);
  },

  getMember: async (teamName: string, member: string) => {
    if (!teamName || !member) {
      console.error('getMember(): team or member is not defined');
    }
    const docRef = doc(db, 'teams', teamName, 'members', member);
    const docSnap = await getDoc(docRef);
    return docSnap;
  },

  setMember: async (teamName: string, member: string) => {
    // check if member exists
    const memberRef = doc(db, 'teams', teamName, 'members', member);
    const memberSnap = await getDoc(memberRef);

    if (memberSnap.data()) {
      return { error: 'Member already exists' };
    }

    const membersDoc = doc(db, 'teams', teamName, 'members', member);
    setDoc(membersDoc, { name: member });
  },

  updateMember: async (teamId?: string, member?: string, payload?: any) => {
    if (!member || !teamId) {
      console.error('updateMember()', 'member is not defined');
      return;
    }

    const memberDoc = doc(db, 'teams', teamId, 'members', member);
    await updateDoc(memberDoc, payload);
  },

  removeMember: (teamName: string, memberName: string) => {
    if (!memberName) console.error('removeMember()', 'member is not defined');
  },
};

export { api };
