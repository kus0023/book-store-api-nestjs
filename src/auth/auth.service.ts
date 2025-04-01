import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { compareSync, hashSync } from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if (user && compareSync(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        return {
            access_token: this.jwtService.sign(user),
        };
    }


    async signup(createAuthDto: CreateAuthDto) {

        createAuthDto.password = hashSync(createAuthDto.password, 10)

        return this.usersService.create(createAuthDto);
    }

}
