
export default function routesList () {
    return [
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
            to: '/movimento',
            label: 'Movimento',
            icon: 'i-heroicons-clipboard-document-list',
        },
        {
            to: '/config',
            label: 'Configurações',
            icon: 'i-heroicons-wrench-screwdriver',
        },

    ]
}