import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";

@Module({
    imports: [TypeOrmModule.forFeature([User]), PassportModule],
    controllers: [UserController],
    providers: [UserService, LocalStrategy],
    exports: [UserService]
})
export class UserModule {
}
