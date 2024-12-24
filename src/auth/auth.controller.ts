import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { Request } from 'express';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guard/roles.guard';
import { Role } from '../common/enum/roles.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ActiveUserInterface } from 'src/common/interface/active-user.interface';

interface RequestWithUser extends Request {
     user : { email: string; role : string }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authServise: AuthService) {}

  @Post('/register')
  register(@Body() registerDto: RegisterDto) {
    return this.authServise.register(registerDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authServise.login(loginDto);
  }

  @Get('profile')
  @Auth(Role.ADMIN)
  profile(@ActiveUser() user: ActiveUserInterface
) {
    //return req.user;
    return this.authServise.profile(user)
  }


 /* se establece en este metodo un decorador c/u  
  @Get('profile')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  profile(@Req() req : RequestWithUser
) {
    return req.user;
    //return this.authServise.profile(req.user)
  } */
}
