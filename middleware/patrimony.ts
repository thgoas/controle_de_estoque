import { IconToast, ToastType } from "~/core/Toast";


export default defineNuxtRouteMiddleware((to, from) => {
   
   const {user} = useLogin()
  
  // Rotas públicas (que não exigem autenticação)
  const publicRoutes = ["/auth/login", "/register"];

  if(!user.value?.patrimony) {
    const {addToast} = useMyToast()

    addToast({
        type: ToastType.Error,
        title: 'Error',
        description: 'Você não tem permissão para acessar esta rota',
        icon: IconToast.Error
    })
    return navigateTo("/");
  }

});
