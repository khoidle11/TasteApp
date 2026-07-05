import { PrismaClient } from "@prisma/client";

import type { TasteAppUserDto } from "@tasteapp/contracts";

import type {
  AuthProvider,
  AuthenticatedRequestContext,
  TasteAppUserRepository
} from "./identity.js";

export class PrismaTasteAppUserRepository implements TasteAppUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByExternalIdentity(
    provider: AuthProvider,
    providerSubject: string
  ): Promise<TasteAppUserDto | null> {
    const identity = await this.prisma.externalAuthIdentity.findUnique({
      include: {
        tasteAppUser: true
      },
      where: {
        provider_providerSubject: {
          provider,
          providerSubject
        }
      }
    });

    if (!identity) {
      return null;
    }

    return toDto(identity.tasteAppUser);
  }

  async createForExternalIdentity(context: AuthenticatedRequestContext): Promise<TasteAppUserDto> {
    const user = await this.prisma.tasteAppUser.create({
      data: {
        displayName: context.displayName,
        externalIdentities: {
          create: {
            email: context.email,
            provider: context.provider,
            providerSubject: context.providerSubject
          }
        },
        primaryEmail: context.email
      }
    });

    return toDto(user);
  }
}

const prisma = new PrismaClient();

export const prismaTasteAppUserRepository = new PrismaTasteAppUserRepository(prisma);

function toDto(user: {
  displayName: string | null;
  id: string;
  primaryEmail: string | null;
}): TasteAppUserDto {
  return {
    displayName: user.displayName,
    id: user.id,
    primaryEmail: user.primaryEmail
  };
}
