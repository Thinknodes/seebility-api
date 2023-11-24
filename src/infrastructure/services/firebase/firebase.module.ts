import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseProvider } from './firebase.provider';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';

@Module({
  imports: [EnvironmentConfigModule],
  providers: [FirebaseProvider, FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
