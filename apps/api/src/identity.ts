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
  findOrCreateByExternalIdentity(context: AuthenticatedRequestContext): Promise<TasteAppUserDto>;
};

export class InMemoryTasteAppUserRepository implements TasteAppUserRepository {
  private readonly users = new Map<string, StoredTasteAppUser>();

  findOrCreateByExternalIdentity(context: AuthenticatedRequestContext): Promise<TasteAppUserDto> {
    const key = externalIdentityKey(context.provider, context.providerSubject);
    const existingUser = this.users.get(key);

    if (existingUser) {
      if (context.displayName !== null) {
        existingUser.displayName = context.displayName;
      }

      if (context.email !== null) {
        existingUser.primaryEmail = context.email;
      }

      return Promise.resolve(toDto(existingUser));
    }

    const user: StoredTasteAppUser = {
      displayName: context.displayName,
      id: `00000000-0000-4000-8000-${String(this.users.size + 1).padStart(12, "0")}`,
      primaryEmail: context.email,
      provider: context.provider,
      providerSubject: context.providerSubject
    };

    this.users.set(key, user);
    return Promise.resolve(toDto(user));
  }
}

export async function resolveCurrentTasteAppUser(
  context: AuthenticatedRequestContext,
  repository: TasteAppUserRepository
): Promise<TasteAppUserDto> {
  return repository.findOrCreateByExternalIdentity(context);
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
