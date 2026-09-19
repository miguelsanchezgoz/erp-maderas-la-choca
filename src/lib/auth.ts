import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo Electrónico", type: "email", placeholder: "usuario@maderaslachoca.com" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Por favor ingresa correo y contraseña.");
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user || !user.password) {
          throw new Error("Credenciales inválidas.");
        }

        if (!user.isActive) {
          throw new Error("Esta cuenta ha sido desactivada por el administrador.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Credenciales inválidas.");
        }

        // Obtener IP del cliente
        const forwardedFor = req?.headers?.["x-forwarded-for"];
        const ipAddress = typeof forwardedFor === "string"
          ? forwardedFor.split(",")[0].trim()
          : "127.0.0.1";

        // Registro de Auditoría: LOGIN_SUCCESS
        try {
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              userEmail: user.email,
              role: user.role,
              action: "LOGIN_SUCCESS",
              module: "AUTH",
              details: `Inicio de sesión exitoso para ${user.name} (${user.role})`,
              ipAddress,
            },
          });
        } catch (auditError) {
          console.error("Error al registrar AuditLog de inicio de sesión:", auditError);
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "maderas-la-choca-super-secret-key-villahermosa-2026",
};
