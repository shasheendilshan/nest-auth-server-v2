import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from 'src/user/entities/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    // get roles from meta data
    const requireRole = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('roles', requireRole);

    const [req] = context.getArgs();

    console.log('req user', req?.user);

    if (req?.user && requireRole.includes(req?.user.type)) {
      return true;
    }

    return false;
  }
}
