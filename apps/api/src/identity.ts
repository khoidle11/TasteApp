import type { TasteAppUserDto } from "@tasteapp/contracts";

export type AuthProvider = "clerk";

export type AuthenticatedRequestContext = {
  displayName: string | null;
  email: string | null;
  provider: AuthProvider;
  providerSubject: string;
};

type StoredTasteAppUser = TasteAppUserDto & {
  provider: AuthProvider;
  providerSubject: string;
};

export type TasteAppUserRepository = {
  findByExternalIdentity(
    provider: AuthProvider,
    providerSubject: string
  ): Promise<TasteAppUserDto | null>;
  createForExternalIdentity(context: AuthenticatedRequestContext): Promise<TasteAppUserDto>;
};

export class InMemoryTasteAppUserRepository implements TasteAppUserRepository {
  private readonly users = new Map<string, StoredTasteAppUser>();

  findByExternalIdentity(
    provider: AuthProvider,
    providerSubject: string
  ): Promise<TasteAppUserDto | null> {
    const user = this.users.get(externalIdentityKey(provider, providerSubject));

    if (!user) {
      return Promise.resolve(null);
    }

    return Promise.resolve(toDto(user));
  }

  createForExternalIdentity(context: AuthenticatedRequestContext): Promise<TasteAppUserDto> {
    const user: StoredTasteAppUser = {
      displayName: context.displayName,
      id: `00000000-0000-4000-8000-${String(this.users.size + 1).padStart(12, "0")}`,
      primaryEmail: context.email,
      provider: context.provider,
      providerSubject: context.providerSubject
    };

    this.users.set(externalIdentityKey(context.provider, context.providerSubject), user);

    return Promise.resolve(toDto(user));
  }
}

export async function resolveCurrentTasteAppUser(
  context: AuthenticatedRequestContext,
  repository: TasteAppUserRepository
): Promise<TasteAppUserDto> {
  const existingUser = await repository.findByExternalIdentity(
    context.provider,
    context.providerSubject
  );

  if (existingUser) {
    return existingUser;
  }

  return repository.createForExternalIdentity(context);
}

function externalIdentityKey(provider: AuthProvider, providerSubject: string): string {
  return `${provider}:${providerSubject}`;
}

function toDto(user: StoredTasteAppUser): TasteAppUserDto {
  return {
    displayName: user.displayName,
    id: user.id,
    primaryEmail: user.primaryEmail
  };
}
