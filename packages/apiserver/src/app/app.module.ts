import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from '../ormconfig';
import { MaterialModule } from '../resources/materials/material.module';
import { StatusModule } from '../resources/statuses/status.module';
import { PersonModule } from '../resources/persons/person.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import {DateTimeResolver, DateTimeTypeDefinition} from "graphql-scalars";

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
      TypeOrmModule.forRoot({
        ...typeorm,
      }),
      MaterialModule,
      StatusModule,
      PersonModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      typeDefs: [
        ...DateTimeTypeDefinition
      ],
      resolvers: {
        DateTimeResolver
      },
      definitions: {
        path: join(process.cwd(), './packages/apiserver/src/graphql.ts'),
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
