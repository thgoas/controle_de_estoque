interface Route {
    to: string
    label: string
    icon: string
}


const routesList = ref<Route[]> ([
    
])

export default function useMyRoutes () {

    
    const addRoute =  async (role: string, patrimony: boolean) => {
        if(role === 'admin') {
            routesList.value = [
                {
                    to: '/',
                    label: 'Estoque',
                    icon: 'i-heroicons-calendar',
                },
                {
                    to: '/products',
                    label: 'Produtos',
                    icon: 'i-heroicons-shopping-cart',
                },
                {
                    to: '/patrimonios',
                    label: 'Patrimonios',
                    icon: 'i-heroicons-building-storefront',
                },
                {
                    to: '/config',
                    label: 'Configurações',
                    icon: 'i-heroicons-wrench-screwdriver',
                },
            ]

        } else if (patrimony) {
            routesList.value = [
                {
                    to: '/',
                    label: 'Estoque',
                    icon: 'i-heroicons-calendar',
                },
                {
                    to: '/products',
                    label: 'Produtos',
                    icon: 'i-heroicons-shopping-cart',
                },
                {
                    to: '/patrimonios',
                    label: 'Patrimonios',
                    icon: 'i-heroicons-building-storefront',
                },
            ]
        } else {
            routesList.value = [
                {
                    to: '/',
                    label: 'Estoque',
                    icon: 'i-heroicons-calendar',
                },
                {
                    to: '/products',
                    label: 'Produtos',
                    icon: 'i-heroicons-shopping-cart',
                },
            ]   
        }
    }

   
    return {
        routesList,
        addRoute
    }
}