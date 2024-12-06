

export default defineNuxtRouteMiddleware((to, from) => {
   
   const {user} = useLogin()
  
  // Rotas públicas (que não exigem autenticação)
  const publicRoutes = ["/auth/login", "/register"];

  if(user.value?.role !== 'admin') {
    
    return navigateTo("/");
  }

});
