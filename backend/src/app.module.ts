import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { BlogModule } from './blog/blog.module';
import { SkillsModule } from './skills/skills.module';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ProfileModule } from './profile/profile.module';
import { UploadModule } from './upload/upload.module';
import { MailModule } from './mail/mail.module';
import { ExperienceModule } from './experience/experience.module';
import { AcademicsModule } from './academics/academic.module';
import { CertificationModule } from './certifications/certification.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('DATABASE_URL');
        const nodeEnv = configService.get<string>('NODE_ENV');
        
        if (url) {
          console.log('Database connection: Using DATABASE_URL');
          return {
            type: 'postgres',
            url,
            autoLoadEntities: true,
            synchronize: true, // Enable for initial deployment to create tables
            ssl: nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
          };
        }

        console.log('Database connection: Using individual fields');
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          autoLoadEntities: true,
          synchronize: true, // Enable for initial deployment
        };
      },
    }),
    ProjectsModule,
    BlogModule,
    SkillsModule,
    MessagesModule,
    AuthModule,
    ProfileModule,
    UploadModule,
    MailModule,
    ExperienceModule,
    AcademicsModule,
    CertificationModule,
    CommentsModule,
  ],
})
export class AppModule {}
