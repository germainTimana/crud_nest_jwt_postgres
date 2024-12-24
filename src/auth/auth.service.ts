import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async register({ name, email, password }: RegisterDto) {
        const user = await this.userService.findOneByEmail(email);
        if (user) {
            throw new BadRequestException('Usuario ya existe en la base de datos');
        }
        await this.userService.create({
            name,
            email,
            password: await bcryptjs.hash(password, 10),
        });
        return { name, email }
    }

    async login({ email, password }: LoginDto) {
        const user = await this.userService.findOneByEmailWithPassword(email);
        if (!user) {
            throw new UnauthorizedException('Credenciales invalidas de ingreso');
        }
        const isPassValid = await bcryptjs.compare(password, user.password);
        if (!isPassValid) {
            throw new UnauthorizedException('Credenciales invalidas de ingreso');
        }
        const payload = {
            email: user.email,
            role : user.role,
        };
        const token = await this.jwtService.signAsync(payload);
        console.log('token', token);
        return { token, email };
    }

    async profile({ email, role }: { email: string; role: string }) {
        return await this.userService.findOneByEmail(email);
      }
}