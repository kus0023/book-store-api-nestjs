import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { RolesGuard } from '../guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthenticateGuard } from '../guards/jwt.guard';

export function Auth(...roles: Role[]) {
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(JwtAuthenticateGuard, RolesGuard),
    );
}
