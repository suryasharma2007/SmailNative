const mailList = [
  {
    id: 1,
    subject: 'Hello, World!',
    sender: 'john.doe@example.com',
    body: 'This is a simple email.',
  },
  {
    id: 20,
    subject: 'Hello, World!',
    sender: 'john.doe@example.com',
    body: 'This is a simple email.',
  },
];

export default mailList;

// firebase

import { initializeApp } from 'firebase/app';

// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   setPersistence,
//   browserLocalPersistence,
//   updatePassword,
//   EmailAuthProvider,
//   reauthenticateWithCredential,
//   signOut ,
//   sendPasswordResetEmail
// } from "firebase/auth";

import ReactNativeBiometrics from 'react-native-biometrics';

import uuid from 'react-native-uuid';

import {
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  initializeFirestore,
  persistentLocalCache,
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  addDoc,
  getDoc,
  limit,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: 'AIzaSyB0Fn4NJN0jsiA4rt9fwp70cABpHFfLThU',
  authDomain: 'smail-6.firebaseapp.com',
  projectId: 'smail-6',
  storageBucket: 'smail-6.firebasestorage.app',
  messagingSenderId: '817477407437',
  appId: '1:817477407437:web:35e4fe351b548e2e7ccf84',
  measurementId: 'G-HC5RNXE4DB',
};

//INIT

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({}),
});

export { app, auth, db };

const biometric = new ReactNativeBiometrics();

export const loginUserToFirebase = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);

    return {
      success: true,
      uid: result.user.uid,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const registerUserToFirebase = async userData => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.smail,
      userData.password,
    );

    const user = userCredential.user;

    const smailLower = userData.smail.toLowerCase();

    await setDoc(doc(db, 'users', user.uid), {
      surName: userData.surName,
      nickName: userData.nickName,
      gender: userData.gender,
      usage: userData.purpose,
      name: userData.name,
      dOB: userData.dob
        ? new Date(userData.dob).toLocaleDateString('en-IN')
        : 'Not Selected',
      smail: smailLower,
      password: userData.password,
      verified: null,
      uid: user.uid,
      deletedMails: [],
    });

    await setDoc(doc(db, 'public_profiles', user.uid), {
      smail: smailLower,
      uid: user.uid,
    });

    return {
      success: true,
      uid: user.uid,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// ==============================
// AUTH
// ==============================
export const observeAuthState = callback => {
  let unsubscribeSession = null;

  const unsubscribeAuth = onAuthStateChanged(auth, async user => {
    try {
      if (unsubscribeSession) {
        unsubscribeSession();
        unsubscribeSession = null;
      }

      if (user) {
        const sessionId = localStorage.getItem('smail_session');

        if (sessionId) {
          unsubscribeSession = onSnapshot(
            doc(db, 'users', user.uid, 'sessions', sessionId),

            async snap => {
              if (!snap.exists()) {
                localStorage.removeItem('smail_session');

                try {
                  await signOut(auth);
                } catch {}
              }
            },

            error => {
              console.error(
                'SESSION LISTENER ERROR:',
                error.code,
                error.message,
              );
            },
          );
        }

        callback({
          loggedIn: true,
          uid: user.uid,
        });
      } else {
        callback({
          loggedIn: false,
        });
      }
    } catch (error) {
      console.error('AUTH OBSERVER ERROR:', error);
    }
  });

  return () => {
    if (unsubscribeSession) {
      unsubscribeSession();
    }

    unsubscribeAuth();
  };
};
// ==============================
// USER
// ==============================

export const getUserDetails = async uid => {
  try {
    const docSnap = await getDoc(doc(db, 'users', uid));

    if (docSnap.exists()) {
      return {
        success: true,
        data: docSnap.data(),
      };
    }
    return {
      success: false,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const updateUserProfile = async (uid, data) => {
  try {
    const userRef = doc(db, 'users', uid);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    const userData = userSnap.data();

    // if (data.password) {
    //   const user = auth.currentUser;

    //   if (user) {
    //     await updatePassword(user, data.password);
    //   }

    //   const currentPassword = userData.password || '';

    //   const oldHistory = userData.passwordHistory || [];

    //   const passwordHistory = [
    //     {
    //       password: currentPassword,
    //       changedAt: new Date().toISOString(),
    //     },
    //     ...oldHistory,
    //   ].slice(0, 2);

    //   data.passwordHistory = passwordHistory;
    // }

    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const verifyUserPassword = async password => {
  try {
    const user = auth.currentUser;

    if (!user) {
      return {
        success: false,
      };
    }

    const credential = EmailAuthProvider.credential(user.email, password);

    await reauthenticateWithCredential(user, credential);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Incorrect Password',
    };
  }
};

// ==============================
// SEARCH USERS
// ==============================

export const searchUsers = async searchText => {
  try {
    if (!searchText) return [];
    const searchLower = searchText.toLowerCase().trim();

    const q = query(
      collection(db, 'public_profiles'),
      where('smail', '>=', searchLower),
      where('smail', '<=', searchLower + '\uf8ff'),
      limit(10),
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => doc.data());
  } catch {
    return [];
  }
};

// ============================== // SEND MAIL
// ==============================

export const sendSmail = async (
  toSmail,
  fromSmail,
  subject,
  message,
  senderName,
  customTime = null,
) => {
  try {
    // ==========================================
    // 1. CURRENT USER
    // ==========================================

    const currentUser = auth.currentUser;

    if (!currentUser?.uid) {
      return {
        success: false,
        error: 'User is not logged in',
      };
    }

    const senderUid = currentUser.uid;

    // ==========================================
    // 2. RECIPIENT
    // ==========================================

    const rSmail = (toSmail || '').toLowerCase().trim();

    if (!rSmail) {
      return {
        success: false,
        error: 'Recipient Smail is empty',
      };
    }

    // ==========================================
    // 3. GET SENDER USER DATA
    // ==========================================

    const senderRef = doc(db, 'users', senderUid);

    const senderSnap = await getDoc(senderRef);

    if (!senderSnap.exists()) {
      return {
        success: false,
        error: 'Sender user document not found',
      };
    }

    const senderData = senderSnap.data();

    // ==========================================
    // 4. SENDER SMAIL
    // ==========================================

    const firebaseSmail = senderData.smail || '';

    const sSmail = (firebaseSmail || fromSmail || '').toLowerCase().trim();

    if (!sSmail) {
      return {
        success: false,
        error: 'Sender Smail not found',
      };
    }

    // ==========================================
    // 5. SENDER NAME
    // ==========================================

    const finalSenderName =
      senderData.name || senderData.nickName || senderName || 'Smail User';

    // ==========================================
    // 6. SENDER PROFILE PICTURE
    // ==========================================

    const senderProfilePic = senderData.profilePic || null;

    // ==========================================
    // 7. VERIFIED
    // ==========================================

    const senderVerified = senderData.verified === true;

    // ==========================================
    // 8. CREATE MAIL DATA
    // ==========================================

    const mailData = {
      // Sender identity
      senderUid: senderUid,

      senderName: finalSenderName,

      name: finalSenderName,

      from: sSmail,

      profilePic: senderProfilePic,

      // Receiver
      to: rSmail,

      // Mail content
      subject: subject?.trim() || '(No Subject)',

      body: message || '',

      // Verification
      verified: senderVerified,

      // Time
      time: customTime ? new Date(customTime) : serverTimestamp(),

      // Status
      isRead: false,

      // Unique mail ID
      mailUID: uuid.v4(),
    };

    // ==========================================
    // 9. GROUP MAIL
    // ==========================================

    if (rSmail.endsWith('-group@smails.in')) {
      const groupRef = doc(db, 'groups', rSmail);

      const groupSnap = await getDoc(groupRef);

      if (!groupSnap.exists()) {
        return {
          success: false,
          error: 'Group not found',
        };
      }

      const groupData = groupSnap.data();

      const members = Array.isArray(groupData.members) ? groupData.members : [];

      if (members.length === 0) {
        return {
          success: false,
          error: 'Group has no members',
        };
      }

      // ========================================
      // SEND TO EVERY GROUP MEMBER
      // ========================================

      await Promise.all(
        members.map(async memberUid => {
          if (!memberUid) {
            return;
          }

          const receiverMailRef = collection(db, 'users', memberUid, 'inbox');

          await addDoc(receiverMailRef, {
            ...mailData,

            // Force sender information
            senderUid: senderUid,

            senderName: finalSenderName,

            name: finalSenderName,

            from: sSmail,

            profilePic: senderProfilePic,

            isGroupMail: true,

            viaGroup: rSmail,
          });
        }),
      );

      // ========================================
      // SAVE GROUP MAIL IN SENT
      // ========================================

      await addDoc(collection(db, 'users', senderUid, 'sent'), {
        ...mailData,

        senderUid: senderUid,

        senderName: finalSenderName,

        name: finalSenderName,

        from: sSmail,

        profilePic: senderProfilePic,

        isGroupMail: true,

        viaGroup: rSmail,
      });

      return {
        success: true,
      };
    }

    // ==========================================
    // 10. NORMAL MAIL
    // ==========================================

    const recipientQuery = query(
      collection(db, 'public_profiles'),
      where('smail', '==', rSmail),
      limit(1),
    );

    const recipientSnapshot = await getDocs(recipientQuery);

    if (recipientSnapshot.empty) {
      return {
        success: false,
        error: 'Recipient not found',
      };
    }

    // ==========================================
    // 11. RECEIVER UID
    // ==========================================

    const receiverUid = recipientSnapshot.docs[0].id;

    if (!receiverUid) {
      return {
        success: false,
        error: 'Receiver UID not found',
      };
    }

    // ==========================================
    // 12. SAVE IN RECEIVER INBOX
    // ==========================================

    await addDoc(collection(db, 'users', receiverUid, 'inbox'), {
      ...mailData,

      senderUid: senderUid,

      senderName: finalSenderName,

      name: finalSenderName,

      from: sSmail,

      profilePic: senderProfilePic,
    });

    // ==========================================
    // 13. SAVE IN SENDER SENT
    // ==========================================

    await addDoc(collection(db, 'users', senderUid, 'sent'), {
      ...mailData,

      senderUid: senderUid,

      senderName: finalSenderName,

      name: finalSenderName,

      from: sSmail,

      profilePic: senderProfilePic,
    });

    // ==========================================
    // 14. SUCCESS
    // ==========================================

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Failed to send Smail',
    };
  }
};

// ==============================
// MAIL LISTENERS
// ==============================
/*
 export const  getMessages = (
  uid,
  callback
) => {

  const q = query(
    collection(db, "users", uid, "inbox"),
    orderBy("time", "desc")
  );

  return onSnapshot(q, (snapshot) => {

    callback(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
    );                                                             
  });

};
               */

export const getMessages = (uid, callback) => {
  console.log('getMessages UID:', uid, 'AUTH UID:', auth.currentUser?.uid);

  const q = query(
    collection(db, 'users', uid, 'inbox'),
    orderBy('time', 'desc'),
  );

  return onSnapshot(
    q,
    snapshot => {
      callback(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    },
    error => {
      console.error('GETMESSAGES ERROR:', error.code, error.message);
    },
  );
};

export const getSentMessages = (uid, callback) => {
  const q = query(
    collection(db, 'users', uid, 'sent'),
    orderBy('time', 'desc'),
  );

  return onSnapshot(
    q,
    snapshot => {
      callback(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    },
    error => {
      console.error('SENT ERROR:', error.code, error.message);
    },
  );
};

export const markAsRead = async (uid, messageId) => {
  try {
    await updateDoc(doc(db, 'users', uid, 'inbox', messageId), {
      isRead: true,
    });

    return { success: true };
  } catch {
    return {
      success: false,
    };
  }
};
// ==============================
// TEMP SAFE FUNCTIONS
// ==============================

export const moveToBin = async (userUid, mailId, mailData) => {
  try {
    await addDoc(collection(db, 'users', userUid, 'bin'), {
      ...mailData,
      deletedAt: serverTimestamp(),
    });

    await deleteDoc(doc(db, 'users', userUid, 'inbox', mailId));

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getBinMessages = (uid, callback) => {
  const q = query(
    collection(db, 'users', uid, 'bin'),
    orderBy('deletedAt', 'desc'),
  );

  return onSnapshot(
    q,
    snapshot => {
      callback(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    },
    error => {
      console.error('BIN ERROR:', error.code, error.message);
    },
  );
};

export const deletePermanently = async (uid, mailId) => {
  try {
    await deleteDoc(doc(db, 'users', uid, 'bin', mailId));

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const restoreFromBin = async (uid, messageId, mailData) => {
  try {
    const { deletedAt, id, ...originalMail } = mailData;

    await addDoc(collection(db, 'users', uid, 'inbox'), {
      ...originalMail,
      time: serverTimestamp(),
    });

    await deleteDoc(doc(db, 'users', uid, 'bin', messageId));

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
/*
 export const  listenForRealtimeEmails = (
  smail,
  uid,
  callback
) => {

  const q = query(
    collection(db, "users", uid, "inbox"),
    orderBy("time", "desc"),
    limit(1)
  );

  return onSnapshot(q, (snapshot) => {

    snapshot.docChanges().forEach((change) => {

      if (change.type === "added") {

        callback({
          id: change.doc.id,
          ...change.doc.data()
        });

      }

    });

  } , (error) => {

      console.error(
        "REALTIME ERROR:",
        error.code,
        error.message
      );

    }
    
  );

};

*/

export const listenForRealtimeEmails = (smail, uid, callback) => {
  console.log('REALTIME UID:', uid, 'AUTH UID:', auth.currentUser?.uid);

  if (!auth.currentUser) {
    console.error('REALTIME ERROR: auth.currentUser is null');

    return () => {};
  }

  const q = query(
    collection(db, 'users', uid, 'inbox'),
    orderBy('time', 'desc'),
    limit(1),
  );

  return onSnapshot(
    q,

    snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          callback({
            id: change.doc.id,
            ...change.doc.data(),
          });
        }
      });
    },

    error => {
      console.error('REALTIME ERROR:', error.code, error.message);
    },
  );
};

export const saveFCMToken = async (uid, token) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      fcmToken: token,
    });

    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
};

// ==============================
// GROUPS
// ==============================

export const listenToMyGroups = (uid, callback) => {
  const q = query(
    collection(db, 'groups'),
    where('members', 'array-contains', uid),
  );

  return onSnapshot(
    q,
    snapshot => {
      callback(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    },
    error => {
      console.error('GROUP ERROR:', error.code, error.message);
    },
  );
};

export const createNewGroup = async (groupId, userUid) => {
  try {
    await setDoc(doc(db, 'groups', groupId), {
      adminUid: userUid,
      members: [userUid],
      membersData: [],
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const addMemberToGroup = async (groupId, smail, userUid) => {
  try {
    const q = query(
      collection(db, 'public_profiles'),
      where('smail', '==', smail),
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    const userDoc = snap.docs[0];

    await updateDoc(doc(db, 'groups', groupId), {
      members: arrayUnion(userDoc.id),
      membersData: arrayUnion({
        uid: userDoc.id,
        smail: smail,
      }),
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const removeMemberFromGroup = async (groupId, memberUid) => {
  try {
    await updateDoc(doc(db, 'groups', groupId), {
      members: arrayRemove(memberUid),
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const deleteGroup = async groupId => {
  try {
    await deleteDoc(doc(db, 'groups', groupId));

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const uploadProfilePicture = async (uid, file) => {
  try {
    const formData = new FormData();

    formData.append('image', file);

    const response = await fetch(
      'https://api.imgbb.com/1/upload?key=a70fd19fb5f9a46c289c44fc9263439c',
      {
        method: 'POST',
        body: formData,
      },
    );

    const data = await response.json();

    const imageUrl = data.data.url;

    await updateDoc(doc(db, 'users', uid), {
      profilePic: imageUrl,
    });

    await updateDoc(doc(db, 'public_profiles', uid), {
      profilePic: imageUrl,
    });

    return {
      success: true,
      url: imageUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const forgotPassword = async email => {
  try {
    await sendPasswordResetEmail(auth, email);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const createCustomLabel = async (uid, labelName) => {
  try {
    const labelId = labelName.toLowerCase().replace(/\s+/g, '_');

    await setDoc(doc(db, 'users', uid, 'custom_labels', labelId), {
      name: labelName,
      createdAt: serverTimestamp(),
      labelUID: crypto.randomUUID(),
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getLabelMessages = (uid, labelId, callback) => {
  const q = query(
    collection(db, 'users', uid, 'labels', labelId, 'mails'),
    orderBy('movedAt', 'desc'),
  );

  return onSnapshot(
    q,
    snapshot => {
      callback(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    },
    error => {
      console.error('LABEL MAILS ERROR:', error.code, error.message);
    },
  );
};

export const deleteCustomLabel = async (uid, labelId) => {
  try {
    await deleteDoc(doc(db, 'users', uid, 'custom_labels', labelId));

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const restoreFromLabel = async (uid, messageId, mailData, labelId) => {
  try {
    const { movedAt, id, ...originalMailData } = mailData;

    await addDoc(collection(db, 'users', uid, 'inbox'), {
      ...originalMailData,
      time: serverTimestamp(),
    });
    await deleteDoc(
      doc(db, 'users', uid, 'labels', labelId, 'mails', messageId),
    );

    return {
      success: true,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
export const moveToLabel = async (uid, messageId, mailData, labelId) => {
  try {
    await addDoc(collection(db, 'users', uid, 'labels', labelId, 'mails'), {
      ...mailData,
      movedAt: serverTimestamp(),
    });

    await deleteDoc(doc(db, 'users', uid, 'inbox', messageId));

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getCustomLabels = (uid, callback) => {
  console.log('CUSTOM LABEL UID:', uid, 'AUTH UID:', auth.currentUser?.uid);

  if (!auth.currentUser) {
    console.error('CUSTOM LABELS ERROR: auth.currentUser is null');

    return () => {};
  }

  const q = query(
    collection(db, 'users', uid, 'custom_labels'),
    orderBy('createdAt', 'asc'),
  );

  return onSnapshot(
    q,

    snapshot => {
      callback(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    },

    error => {
      console.error('CUSTOM LABELS ERROR:', error.code, error.message);
    },
  );
};
/*
 export const  getCustomLabels = (
  uid,
  callback
) => {

  const q = query(
    collection(
      db,
      "users",
      uid,
      "custom_labels"
    ),
    orderBy(
      "createdAt",
      "asc"
    )
  );

  return onSnapshot(
    q,
    (snapshot) => {

      callback(
        snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data()
          })
        )
      );

    } , 
    (error) => {

      console.error(
        "CUSTOM LABELS ERROR:",
        error.code,
        error.message
      );

    }
    );

};
*/

export const getPublicProfile = async uid => {
  try {
    const docSnap = await getDoc(doc(db, 'public_profiles', uid));
    if (docSnap.exists()) {
      return {
        success: true,
        data: docSnap.data(),
      };
    }
    return {
      success: false,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getMyDevices = async uid => {
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'sessions'));

    return {
      success: true,

      data: snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const logoutDevice = async (uid, sessionId) => {
  try {
    await deleteDoc(doc(db, 'users', uid, 'sessions', sessionId));

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const isSessionValid = async uid => {
  try {
    const sessionId = localStorage.getItem('smail_session');

    if (!sessionId) {
      return false;
    }

    const snap = await getDoc(doc(db, 'users', uid, 'sessions', sessionId));

    return snap.exists();
  } catch {
    return false;
  }
};

export const logoutAllDevices = async uid => {
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'sessions'));

    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const scheduleSmail = async (uid, mailData, scheduleTime) => {
  try {
    await addDoc(collection(db, 'users', uid, 'scheduled_mails'), {
      ...mailData,
      sendAt: new Date(scheduleTime),
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getscheduledmails = (uid, callback) => {
  const q = query(
    collection(db, 'users', uid, 'scheduled_mails'),
    orderBy('sendAt', 'asc'),
  );

  return onSnapshot(
    q,
    snapshot => {
      callback(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    },
    error => {
      console.error('SCHEDULED ERROR:', error.code, error.message);
    },
  );
};

export const deleteScheduledMail = async (uid, mailId) => {
  try {
    await deleteDoc(doc(db, 'users', uid, 'scheduled_mails', mailId));

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const setUserVerified = async (uid, verified = true) => {
  try {
    if (!uid) {
      return {
        success: false,
        error: 'User UID is required',
      };
    }

    await updateDoc(doc(db, 'users', uid), {
      verified: verified,
    });

    return {
      success: true,
      verified: verified,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// ==============================
// CHANGE USER PASSWORD
// ==============================
export const changeUserPassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;

    if (!user || !user.email) {
      return {
        success: false,
        error: 'User not logged in',
      };
    }

    // Current password unte re-authenticate
    if (currentPassword && currentPassword.trim()) {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );

      await reauthenticateWithCredential(user, credential);
    }

    // Firebase password update
    await updatePassword(user, newPassword);

    return {
      success: true,
    };
  } catch (error) {
    console.log('CHANGE PASSWORD ERROR:', error.code, error.message);

    return {
      success: false,
      code: error.code,
      error: error.message,
    };
  }
};

// ==========================================
// BIOMETRIC SUPPORT
// ==========================================

export const checkBiometricSupport = async () => {
  try {
    const result = await biometric.isSensorAvailable();

    return {
      success: true,
      available: result.available,
      biometryType: result.biometryType,
    };
  } catch (error) {
    return {
      success: false,
      available: false,
      error: error.message,
    };
  }
};

// ==========================================
// CREATE BIOMETRIC KEYS
// ==========================================

export const createBiometricKeys = async () => {
  try {
    const result = await biometric.createKeys();

    return {
      success: true,
      publicKey: result.publicKey,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// ==========================================
// DELETE BIOMETRIC KEYS
// ==========================================

export const deleteBiometricKeys = async () => {
  try {
    await biometric.deleteKeys();

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// ==========================================
// BIOMETRIC AUTHENTICATION
// ==========================================

export const authenticateWithBiometric = async () => {
  try {
    const support = await checkBiometricSupport();

    if (!support.success || !support.available) {
      return {
        success: false,
        error: 'Biometric authentication not available',
      };
    }

    const keys = await biometric.biometricKeysExist();

    if (!keys.keysExist) {
      return {
        success: false,
        error: 'Biometric keys not registered',
      };
    }

    const payload = `smail-auth-${Date.now()}`;

    const signature = await biometric.createSignature({
      promptMessage: 'Verify fingerprint to continue',
      payload,
    });

    if (!signature.success) {
      return {
        success: false,
        error: 'Biometric authentication cancelled or failed',
      };
    }

    return {
      success: true,
      signature: signature.signature,
      payload,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// ==========================================
// ENABLE BIOMETRIC
// ==========================================

export const enableBiometricLock = async () => {
  try {
    const keys = await biometric.biometricKeysExist();

    if (!keys.keysExist) {
      const result = await createBiometricKeys();

      if (!result.success) {
        return result;
      }
    }

    await AsyncStorage.setItem('biometricEnabled', 'true');

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// ==========================================
// DISABLE BIOMETRIC
// ==========================================

export const disableBiometricLock = async () => {
  try {
    await AsyncStorage.setItem('biometricEnabled', 'false');

    await deleteBiometricKeys();

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// ==========================================
// CHECK BIOMETRIC ENABLED
// ==========================================

export const isBiometricLockEnabled = async () => {
  try {
    const value = await AsyncStorage.getItem('biometricEnabled');

    return value === 'true';
  } catch {
    return false;
  }
};
