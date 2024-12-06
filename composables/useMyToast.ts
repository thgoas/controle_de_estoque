import type { IToast } from "~/core/Toast"

export function useMyToast() {
    const toast = useToast()

   

    const addToast = (data: IToast) => {
        toast.add({
          id: data.type,
          title: data.type,
          description: data.description,
          icon: data.icon,
          timeout: 5000
        })

    }

    return {
        addToast
    }

}


