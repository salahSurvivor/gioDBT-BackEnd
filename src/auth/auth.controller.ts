import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { authService } from './auth.service';
import { RegisterMemberDto } from './dto/register-member.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';

@Controller('')
export class authController {
  constructor(private readonly authService: authService) {}

  // REGISTER
  @Post('register/entreprise')
  registerEntreprise(@Body() body) {
    return this.authService.registerEntreprise(body);
  }

  @Post('register/member')
  registerMember(@Body() body: RegisterMemberDto) {
    return this.authService.registerMember(body);
  }

  // LOGIN (ONE ROUTE)
  @Post('login')
  login(@Body() body) {
    return this.authService.login(body.email, body.password);
  }

  // PROFILE
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }

  // INVITE
  @UseGuards(JwtAuthGuard)
  @Post('invite-member')
  generateInvite(
    @Req() req,
    @Body() body: { permission?: 'admin' | 'editor' | 'viewer' },
  ) {
    if (req.user.role !== 'entreprise') {
      throw new ForbiddenException('Seule une entreprise peut inviter un membre');
    }

    return this.authService.generateInviteToken(
      req.user.id,
      body?.permission || 'viewer',
    );
  }
}
