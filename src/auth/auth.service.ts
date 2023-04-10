import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,) { }

  async signup(body: CreateUserDto) {
    const { password, email, ...userData } = body;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser)
      throw new BadRequestException('Already created User');

    const user = this.userRepository.create({
      ...userData,
      email,
      password: bcrypt.hashSync(password, 10)
    });

    await this.userRepository.save(user)
    delete user.password;

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  async signin(body: CreateUserDto) {
    const { password, email } = body;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid');
    delete user.password

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;

  }
}
