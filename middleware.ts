import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string;

    // 1. /usuarios, /configuracion: Exclusivo DUENO
    if (
      (path.startsWith("/usuarios") || path.startsWith("/configuracion")) &&
      role !== "DUENO"
    ) {
      const url = new URL("/dashboard", req.url);
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    // 2. /finanzas, /cuentas-cobrar, /cuentas-pagar, /facturacion: Exclusivo DUENO y CXC_CXP
    if (
      (path.startsWith("/finanzas") ||
        path.startsWith("/cuentas-cobrar") ||
        path.startsWith("/cuentas-pagar") ||
        path.startsWith("/facturacion")) &&
      !["DUENO", "CXC_CXP"].includes(role)
    ) {
      const url = new URL("/dashboard", req.url);
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    // 3. /crm, /clientes, /cotizaciones: DUENO, CXC_CXP y ENCARGADO_PISO
    if (
      (path.startsWith("/crm") ||
        path.startsWith("/clientes") ||
        path.startsWith("/cotizaciones")) &&
      !["DUENO", "CXC_CXP", "ENCARGADO_PISO"].includes(role)
    ) {
      const url = new URL("/dashboard", req.url);
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    // 4. /inventario, /patio, /taller, /cubicaje: DUENO, ENCARGADO_PISO y OPERATIVO
    if (
      (path.startsWith("/inventario") ||
        path.startsWith("/patio") ||
        path.startsWith("/taller") ||
        path.startsWith("/cubicaje")) &&
      !["DUENO", "ENCARGADO_PISO", "OPERATIVO"].includes(role)
    ) {
      const url = new URL("/dashboard", req.url);
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Si no hay token, withAuth redirige automáticamente a pages.signIn (/login)
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/usuarios/:path*",
    "/configuracion/:path*",
    "/finanzas/:path*",
    "/cuentas-cobrar/:path*",
    "/cuentas-pagar/:path*",
    "/facturacion/:path*",
    "/crm/:path*",
    "/clientes/:path*",
    "/cotizaciones/:path*",
    "/inventario/:path*",
    "/patio/:path*",
    "/taller/:path*",
    "/cubicaje/:path*",
  ],
};
