import { IFirebaseService } from '@domain/adapters/firebase.interface';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';


@Injectable()
export class FirebaseService implements IFirebaseService {
  public verifyIdToken(
    idToken: string,
    checkRevoked?: boolean,
  ): Promise<admin.auth.DecodedIdToken> {
    return admin.auth().verifyIdToken(idToken, checkRevoked);
  }
}
