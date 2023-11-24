import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /auth/login', () => {
    it('should login successfully', () => {});
    it('should return 401 if user is not found', () => {});
    it('should return 401 if password is incorrect', () => {});
    it('should return 401 if user is not verified', () => {});
  });

  describe('POST /auth/register', () => {
    it('should register successfully', () => {});
    it('should return 409 if user already exists', () => {});
  });

  describe('POST /auth/refresh', () => {
    it('should refresh access token successfully', () => {});
    it('should return 401 if refresh token is invalid', () => {});
  });

  describe('POST /auth/verify-otp', () => {
    it('should verify otp successfully', () => {});
    it('should return 401 if otp is invalid', () => {});
  });

  describe('POST /auth/resend-otp', () => {
    it('should resend otp successfully', () => {});
    it('should return 401 if user is not found', () => {});
  });

  describe('POST /auth/forgot-password', () => {
    it('should send forgot password email successfully', () => {});
    it('should return 401 if user is not found', () => {});
  });

  describe('POST /auth/forgot-password/verify', () => {
    it('should verify forgot password otp successfully', () => {});
    it('should return 401 if otp is invalid', () => {});
  });

  describe('POST /auth/forgot-password/reset', () => {
    it('should reset password successfully', () => {});
    it('should return 401 if otp is invalid', () => {});
  });
});
