/* eslint-disable prettier/prettier */
import * as admin from 'firebase-admin';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';

const FIREBASE = Symbol('FIREBASE');

interface IServiceAccount {
  type: string;
  projectId: string;
  privateKeyId: string;
  privateKey: string;
  clientEmail: string;
  clientId: string;
  authUri: string;
  tokenUri: string;
  authProviderX509CertUrl: string;
  clientX509CertUrl: string;
  universeDomain: string;
}

export const FirebaseProvider = {
  provide: FIREBASE,
  inject: [EnvironmentConfigService],
  useFactory: (config: EnvironmentConfigService) => {
    const ServiceAccount = config.getFirebaseServiceAccount();
    return admin.initializeApp({
      credential: admin.credential.cert(ServiceAccount),
    });
  },
};
