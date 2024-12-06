import { IconToast, ToastType } from "~/core/Toast"
import type { IUserLogged } from "~/core/Users"
interface Body {
    email: string
    password: string
}

const user = ref<IUserLogged | null>(null)
const loading = ref<boolean>(false)
const error = ref<string | null>(null)

export function useLogin() {
    const {addRoute} = useMyRoutes()
    const {addToast} = useMyToast()
    const router = useRouter()

    const tokenCookie = useCookie("auth_token", { expires: new Date(Date.now() + 1000 * 60 * 60 * 24)})


    const login = async (data: Body) => {
        loading.value = true;
        try {
            const response = await $fetch<IUserLogged>('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            tokenCookie.value = response.token            
            user.value = response
            router.push('/')
        } catch (e) {
            error.value = (e as Error).message;
            if((e as any).statusMessage) {
                addToast({
                    type: ToastType.Error,
                    title: 'Error',
                    description: (e as any).statusMessage,
                    icon: IconToast.Error
                })

            } else {
                addToast({
                    type: ToastType.Error,
                    title: 'Error',
                    description: (e as any).message,
                    icon: IconToast.Error
                })
            }
        } finally {
            loading.value = false;
        }
    };

    const logout = () => {
        tokenCookie.value = null
        user.value = null
        router.push('/auth/login')
    }

    const getUser = async () => {
        loading.value = true
        
            try {
                const response = await $fetch<IUserLogged>('/api/auth/loading', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${useCookie('auth_token').value}`,
                    },
                })
                user.value = response 
                if (response) {
                    addRoute(response.role)
                }
            } catch (e) {
                error.value = (e as Error).message
                addToast({
                    type: ToastType.Error,
                    title: 'Error',
                    description: (e as any).message,
                    icon: IconToast.Error,
                })
            } finally {
                loading.value = false
            }
        
    }
        
        
    

    onMounted(async () => {
        if(!tokenCookie.value) {
            return
        }   
       await getUser()
       
    })

    return {
        loading,
        user,
        error,
        login,
        logout
    };
}