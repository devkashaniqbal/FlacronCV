/**
 * One-time script to create the super admin user.
 * Run with: node scripts/seed-admin.mjs
 */
import admin from 'firebase-admin';

const ADMIN_EMAIL = 'admin@flacroncv.com';
const ADMIN_PASSWORD = 'admin0900';
const ADMIN_NAME = 'Super Admin';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'flacron-cv',
    clientEmail: 'firebase-adminsdk-fbsvc@flacron-cv.iam.gserviceaccount.com',
    privateKey: `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDEa2ASxbwVZ/qt\nR9tPpv9bC1+msXfEnQJ46z0rrLB1su3O9Bib7l8lCgjqTZI3NbM5n0568FogIO4U\nL20ngAuy7+p1zxO2mYFN/7i9EbdfijhznsXQbPCP74YKL+fu/aNuWet1ym3bsd4p\nefSpZIbH5lBwfndwFvRcKrxI1wJMtNVWakCmxdJreRud8jUqffS52N1+s/UHTW+v\nexy2Oi/I7QGFo2uNlZ38f7JicLL+pCvU3vPof3UUttgUHv1fhfm8TBnlmCvpJCxw\nNFdAyCE1HpVnmPlnXIPICxXFnmXXvgqwH8JD7RtuVmmktaHl0Xla7vG7ameTdBUU\nozaujxedAgMBAAECggEAAg7o/RFe4O+LwCyYVvuWQe86052Y9nG5wKggZjiDSdxz\n4v8KUfn7u8Dg6omhDlyM8f3iHeYuX5dQv1vm3irYlImwkIb4uyldIkLbffm1TPY/\nFLEVfBNkKvH02t75JHc6cvHUxpF2OL7ip9ccEflYczhN3/vnRwCqk1usSOwd3U1k\nEiDKAtZS/gkwMcK3mRE7q9BseHyQHdXU3QtSlE8f48bnD97K0v72rxSv9RCWDPBP\nZ4qVo0KL/i4d06xM7bKRByfs/ZmZNTRSmzU0I2eq6Uo9hcNMV0K8ygKYpOqF8bwZ\nfeHKV2ljeHbe/UYoXXi0hS7XLdQ9DajACInKE/xCIQKBgQD82mS4bZReOjSBj5wO\nB+Li9mh5Ch+hb72WhXqXSFbt/R5jJNlMbINk9Aqvcv1hf379zUic78eENAzeoSqk\ngtxHbpjqkmB7zSo/wE4zCSmHXnreKchZRf1s825qX9Rs2+jCBN8EiD+EPmoLEwt1\nmexCNR2BoX1L65JLl+e0sM9WfQKBgQDG3S40lSR4cDLnDVgpo3X7qMAm+1LGEglM\nHektUC0thFAHrVrez+LoN/Cp74cIPO/unu+lCB6jWZZO5FKG5ltUp73BEZOlvsW2\nz3gLku1qyr9e5MooE4y8J7B2RfKoFu+Sq7T2UaHkZ84BgjuwHaVJ0/QoL8OWhZEy\naGOtUQfvoQKBgEsVexU9DPLSK+dRQtDzzI8DBtDyjaP9r3m0F0w3IgE3yb89IP3N\nt1LSGR4yckVye75YKDjaBxAd+LhfeW8yoMDhea0mXFpG+UXHEDGdheR5zNiN5b2E\nyBWDUAVsgYL15m8+zQ7mep4Ffq3dMOjyFTMv3Jwy3ScfQ+kIqbiBTIBtAoGAZp9l\nZMVCWNStsAZ25KXyELh40KUJhiVwntMgrb2eUsrg8dVH+4uUMPoNO+Tb7ihkOOPU\nD3otNWbZ5kR1QiBGKV2W0rdbVkEojrpp3K8pzd5q+3Fd0WilS8O/kIlwO8X6Q9pQ\nPHzL6q6W5LhsTOo/jeXPLZ3YdSjgUP8F0T7rtYECgYBjO3fvoDLU4WiEVEGTnILn\nKNvD1QIw//zWRIC9rI5Yjlb59TrlyfKqnosjsTDDs84TAzLIikXrtK0Y6QxmkHHJ\nufVJ2Rn6cTF//eEpdhU7RrUt/AS1XPR8c4+RAl9XW8TMIO5zeJR61YQ5rUB+eznT\ni3RDr/VmCWyM5rZi+Q7C0g==\n-----END PRIVATE KEY-----\n`,
  }),
});

const auth = admin.auth();
const db = admin.firestore();

async function run() {
  let uid;

  // Create or fetch the Firebase Auth user
  try {
    const existing = await auth.getUserByEmail(ADMIN_EMAIL);
    uid = existing.uid;
    console.log(`User already exists: ${uid} — updating password & role`);
    await auth.updateUser(uid, { password: ADMIN_PASSWORD, displayName: ADMIN_NAME, emailVerified: true });
  } catch (e) {
    if (e.code === 'auth/user-not-found') {
      const created = await auth.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        displayName: ADMIN_NAME,
        emailVerified: true,
      });
      uid = created.uid;
      console.log(`Created Firebase Auth user: ${uid}`);
    } else {
      throw e;
    }
  }

  // Set custom claims
  await auth.setCustomUserClaims(uid, { role: 'super_admin' });
  console.log('Custom claims set: super_admin');

  // Upsert Firestore user document
  const now = new Date();
  await db.collection('users').doc(uid).set({
    uid,
    email: ADMIN_EMAIL,
    displayName: ADMIN_NAME,
    photoURL: null,
    phoneNumber: null,
    role: 'super_admin',
    isActive: true,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
    welcomeEmailSent: true,
    profile: { firstName: 'Super', lastName: 'Admin', headline: '', bio: '', location: '', website: '', linkedin: '', github: '' },
    preferences: { language: 'en', theme: 'system', emailNotifications: true, marketingEmails: false, defaultCVTemplate: '' },
    subscription: { plan: 'enterprise', status: 'active', stripeCustomerId: null, stripeSubscriptionId: null, currentPeriodEnd: null, cancelAtPeriodEnd: false },
    usage: { cvsCreated: 0, coverLettersCreated: 0, aiCreditsUsed: 0, aiCreditsLimit: 999, exportsThisMonth: 0, lastExportReset: now },
  }, { merge: true });
  console.log('Firestore user document upserted');

  console.log('\n✅ Done!');
  console.log(`   Email:    ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`   Role:     super_admin`);
  process.exit(0);
}

run().catch((err) => { console.error(err); process.exit(1); });
