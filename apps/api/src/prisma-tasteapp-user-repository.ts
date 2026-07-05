import { PrismaClient } from "@prisma/client";

import type { TasteAppUserDto } from "@tasteapp/contracts";

import type { AuthenticatedRequestContext, TasteAppUserRepository } from "./identity.js";

export class PrismaTasteAppUserRepository implements TasteAppUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findOrCreateByExternalIdentity(
    context: AuthenticatedRequestContext
  ): Promise<TasteAppUserDto> {
    const identity = await this.prisma.externalAuthIdentity.upsert({
      create: {
        email: context.email,
        provider: context.provider,
        providerSubject: context.providerSubject,
        tasteAppUser: {
          create: {
            displayName: context.displayName,
            primaryEmail: context.email
          }
        }
      },
      include: {
        tasteAppUser: true
      },
      update: {},
      where: {
        provider_providerSubject: {
          provider: context.provider,
          providerSubject: context.providerSubject
        }
      }
    });

    return toDto(identity.tasteAppUser);
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
