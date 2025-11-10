import { 
  Controller, 
  Post, 
  Body, 
  HttpStatus, 
  HttpCode,
  Get,
  UseGuards,
  Request
} from '@nestjs/common';
import { AuthService, ClientService, MemberService } from '../services';
import { 
  RegisterData, 
  LoginData, 
  CreateClientCpfDto,
  CreateClientCnpjDto,
  CreateMemberDto
} from '../types';
import { successResponse } from '../lib';
import { AuthGuard } from '../guards';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly clientService: ClientService,
    private readonly memberService: MemberService
  ) {}

  // ============= REGISTRO =============

  /**
   * Registro de usuário básico (User)
   * Cria usuário no Firebase Auth e salva no banco
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterData) {
    const result = await this.authService.register(body);
    
    return successResponse('User registered successfully', {
      user: {
        id: result.user.id.id,
        email: result.user.email,
        type: result.user.type.type,
      },
      firebaseUid: result.firebaseUid,
      idToken: result.idToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
    });
  }

  /**
   * Registro de cliente CPF
   * Cria User + Client CPF
   */
  @Post('register/client/cpf')
  @HttpCode(HttpStatus.CREATED)
  async registerClientCpf(@Body() body: {
    user: RegisterData;
    client: CreateClientCpfDto;
  }) {
    // 1. Cria o User primeiro
    const userResult = await this.authService.register({
      ...body.user,
      type: 'client' // Força tipo client
    });

    // 2. Cria o Client CPF vinculado ao User
    const clientResult = await this.clientService.createClientCpf(
      body.client,
      userResult.user.id
    );

    return successResponse('Client CPF registered successfully', {
      user: {
        id: userResult.user.id.id,
        email: userResult.user.email,
        type: userResult.user.type.type,
      },
      client: {
        id: clientResult.id,
        cpf: clientResult.client.cpf,
        fullName: clientResult.client.fullName,
        email: clientResult.client.email,
        phone: clientResult.client.phone,
        address: {
          id: clientResult.client.address.id,
          country: clientResult.client.address.country,
          state: clientResult.client.address.state,
          city: clientResult.client.address.city,
          cep: clientResult.client.address.cep,
          complement: clientResult.client.address.complement,
        },
      },
      firebaseUid: userResult.firebaseUid,
      idToken: userResult.idToken,
      refreshToken: userResult.refreshToken,
      expiresIn: userResult.expiresIn,
    });
  }

  /**
   * Registro de cliente CNPJ
   * Cria User + Client CNPJ + Commissary (Client CPF)
   */
  @Post('register/client/cnpj')
  @HttpCode(HttpStatus.CREATED)
  async registerClientCnpj(@Body() body: {
    user: RegisterData;
    client: CreateClientCnpjDto;
  }) {
    // 1. Cria o User primeiro
    const userResult = await this.authService.register({
      ...body.user,
      type: 'client' // Força tipo client
    });

    // 2. Cria o Client CNPJ vinculado ao User
    const clientResult = await this.clientService.createClientCnpj(
      body.client,
      userResult.user.id
    );

    return successResponse('Client CNPJ registered successfully', {
      user: {
        id: userResult.user.id.id,
        email: userResult.user.email,
        type: userResult.user.type.type,
      },
      client: {
        id: clientResult.id,
        cnpj: clientResult.client.cnpj,
        companyName: clientResult.client.companyName,
        fantasyName: clientResult.client.fantasyName,
        email: clientResult.client.email,
        phone: clientResult.client.phone,
        address: {
          id: clientResult.client.address.id,
          country: clientResult.client.address.country,
          state: clientResult.client.address.state,
          city: clientResult.client.address.city,
          cep: clientResult.client.address.cep,
          complement: clientResult.client.address.complement,
        },
      },
      firebaseUid: userResult.firebaseUid,
      idToken: userResult.idToken,
      refreshToken: userResult.refreshToken,
      expiresIn: userResult.expiresIn,
    });
  }

  /**
   * Registro de membro (Member)
   * Cria User + Member
   */
  @Post('register/member')
  @HttpCode(HttpStatus.CREATED)
  async registerMember(@Body() body: {
    user: RegisterData;
    member: Omit<CreateMemberDto, 'userId'>;
  }) {
    // 1. Cria o User primeiro
    const userResult = await this.authService.register({
      ...body.user,
      type: 'member' // Força tipo member
    });

    // 2. Cria o Member vinculado ao User
    const memberResult = await this.memberService.createMember({
      ...body.member,
      userId: userResult.user.id,
    });
    
    return successResponse('Member registered successfully', {
      user: {
        id: userResult.user.id.id,
        email: userResult.user.email,
        type: userResult.user.type.type,
      },
      member: {
        id: memberResult.id,
        registration: memberResult.member.registration,
        fullName: memberResult.member.fullName,
        entryDate: memberResult.member.entryDate,
        specialties: memberResult.member.specialties.map(s => s.id),
      },
      firebaseUid: userResult.firebaseUid,
      idToken: userResult.idToken,
      refreshToken: userResult.refreshToken,
      expiresIn: userResult.expiresIn,
    });
  }

  // ============= AUTENTICAÇÃO =============

  /**
   * Login de usuário
   * Backend faz autenticação no Firebase e retorna tokens
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginData) {
    const result = await this.authService.login(body);

    return successResponse('User logged in successfully', {
      user: {
        id: result.user.id.id,
        email: result.user.email,
        type: result.user.type.type,
      },
      firebaseUid: result.firebaseUid,
      tokenId:      idToken: result.idToken,
      expiresIn: result.expiresIn,
    });
  }

  /**
   * Valida token (para verificar se está válido)
   */
  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() body: { token: string }) {
    const decodedToken = await this.authService.validateToken({ token: body.token });

    return successResponse('Token is valid', {
      uid: decodedToken.uid,
      email: decodedToken.email,
      expiresAt: new Date(decodedToken.exp * 1000),
    });
  }

  /**
   * Obtém usuário atual baseado no token
   */
  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@Request() req: any) {
    const user = req.user;

    return successResponse('User retrieved successfully', {
      user: {
        id: user.id.id,
        email: user.email,
        type: user.type.type,
      },
    });
  }

  // ============= LOGOUT =============

  /**
   * Logout do usuário
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async logout(@Body() body: { firebaseUid: string }) {
    await this.authService.logout(body.firebaseUid);
    return successResponse('User logged out successfully', null);
  }

  // ============= GERENCIAMENTO DE SENHA =============

  /**
   * Trocar senha
   */
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async changePassword(
    @Request() req: any,
    @Body() body: {
      userId: string;
      firebaseUid: string;
      oldPassword: string;
      newPassword: string;
    }
  ) {
    await this.authService.changePassword(
      { id: body.userId } as any,
      body.firebaseUid,
      body.oldPassword,
      body.newPassword
    );

    return successResponse('Password changed successfully', null);
  }

  /**
   * Solicitar reset de senha
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: { email: string }) {
    await this.authService.sendPasswordResetEmail(body.email);
    return successResponse(
      'If the email exists, a password reset link has been sent',
      null
    );
  }

  /**
   * Confirmar reset de senha
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: {
    email: string;
    newPassword: string;
  }) {
    await this.authService.confirmPasswordReset(body.email, body.newPassword);
    return successResponse('Password reset successfully', null);
  }

  // ============= GERENCIAMENTO DE EMAIL =============

  /**
   * Atualizar email
   */
  @Post('update-email')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async updateEmail(
    @Request() req: any,
    @Body() body: {
      userId: string;
      firebaseUid: string;
      newEmail: string;
      password: string;
    }
  ) {
    await this.authService.updateEmail(
      { id: body.userId } as any,
      body.firebaseUid,
      body.newEmail,
      body.password
    );

    return successResponse('Email updated successfully', null);
  }

  // ============= EXCLUSÃO DE CONTA =============

  /**
   * Deletar conta
   */
  @Post('delete-account')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async deleteAccount(
    @Request() req: any,
    @Body() body: {
      userId: string;
      firebaseUid: string;
    }
  ) {
    await this.authService.deleteUser(
      { id: body.userId } as any,
      body.firebaseUid
    );

    return successResponse('Account deleted successfully', null);
  }

  // ============= PERMISSÕES =============

  /**
   * Verifica permissão
   */
  @Post('check-permission')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async checkPermission(
    @Request() req: any,
    @Body() body: {
      userId: string;
      permission: string;
    }
  ) {
    const hasPermission = await this.authService.hasPermission(
      { id: body.userId } as any,
      body.permission
    );

    return successResponse('Permission checked', { hasPermission });
  }
}
