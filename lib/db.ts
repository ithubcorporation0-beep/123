import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

function getPrismaClient(): PrismaClient | null {
  try {
    if (!globalThis.prisma) {
      globalThis.prisma = new PrismaClient();
    }
    return globalThis.prisma;
  } catch (error) {
    console.warn("[PRISMA_INIT_WARN] Could not initialize PrismaClient:", error);
    return null;
  }
}

function createModelFallback() {
  return new Proxy(
    {},
    {
      get() {
        return async () => {
          return null;
        };
      },
    }
  );
}

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const client = getPrismaClient();
    if (!client) {
      if (prop === "courseCategory") {
        return {
          findMany: async () => [],
          findUnique: async () => null,
          count: async () => 0,
        };
      }
      if (prop === "course") {
        return {
          findMany: async () => [],
          findFirst: async () => null,
          findUnique: async () => null,
          count: async () => 0,
        };
      }
      if (prop === "profile" || prop === "chapter" || prop === "enrollment" || prop === "certificate") {
        return {
          findMany: async () => [],
          findUnique: async () => null,
          findFirst: async () => null,
          count: async () => 0,
        };
      }
      return createModelFallback();
    }

    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
