import * as admin from 'firebase-admin';

export interface IFirebaseService {
  verifyIdToken(
    idToken: string,
    checkRevoked?: boolean,
  ): Promise<admin.auth.DecodedIdToken>;
}
