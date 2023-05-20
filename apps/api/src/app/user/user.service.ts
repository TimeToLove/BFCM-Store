import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto, SignInUserDto } from '@superstore/libs';
import { UserDto } from '@superstore/libs';
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService
    ) {
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            console.log(existingUser)
            throw new ConflictException('This email is already taken');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        if (!hashedPassword) {
            throw new ConflictException('Error hashing password');
        }
        createUserDto.password = hashedPassword;

        return this.userRepository.save(createUserDto);
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findOne(id: number) {
        const options: FindOneOptions = {
            where: { id }
        };
        return this.userRepository.findOne(options);
    }

    update(id: number, updateUserDto: UserDto) {
        return this.userRepository.update(id, updateUserDto);
    }

    remove(id: number) {
        return this.userRepository.delete(id);
    }

    signIn(signInUserDto: SignInUserDto) {
        const options: FindOneOptions = {
            where: {
                email: signInUserDto.email,
            }
        };
        return this.userRepository.findOne(options)
            .then(async (user) => {
                if (!user) {
                    throw new ConflictException('Invalid credentials');
                }
                const matchPassword = await bcrypt.compare(signInUserDto.password, user.password);
                if (!matchPassword) {
                    throw new ConflictException('Invalid password');
                }

                delete user.password;
                return {
                    accessToken: await this.jwtService.signAsync({ user }),
                    user
                }
            });
    }

    signInWithAccessToken(accessToken: string) {
        return this.jwtService.verifyAsync(accessToken)
            .then(async (decoded) => {
                const user = await this.userRepository.findOne({
                    where: {
                        id: decoded.user.id
                    }
                });
                if (!user) {
                    throw new ConflictException('Invalid credentials');
                }
                delete user.password;
                return {
                    accessToken: await this.jwtService.signAsync({ user }),
                    user
                }
            })
            .catch(() => {
                throw new ConflictException('Your session has expired. Please sign in again.');
            });
    }
}