import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";

const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USERNAME,
    POSTGRES_PASSWORD,
    POSTGRES_DATABASE
} = process.env;

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: POSTGRES_HOST,
            port: Number(POSTGRES_PORT),
            username: POSTGRES_USERNAME,
            password: POSTGRES_PASSWORD,
            database: POSTGRES_DATABASE,
            entities: [],
            ssl: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
