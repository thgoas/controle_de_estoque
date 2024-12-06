import { useCookie } from "#app";

export default defineNuxtRouteMiddleware((to, from) => {

  const token = useCookie("auth_token").value;

  // Rotas públicas (que não exigem autenticação)
  const publicRoutes = ["/auth/login", "/register"];

  if (!token && !publicRoutes.includes(to.path)) {
    // Redirecionar para a página de login
    return navigateTo("/auth/login");
  }

  // Se o usuário já está autenticado e tenta acessar a página de login
  if (token && to.path === "/auth/login") {
    // Redirecionar para a página inicial
    return navigateTo("/");
  }
});
