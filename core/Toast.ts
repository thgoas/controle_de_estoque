export enum ToastType {
    Error = 'Error',
    Info = 'Info',
    Success = 'Success',    
    Warning = 'Warning',
  }

export interface IToast {
    type: ToastType
    title: string
    description: string
    icon: IconToast
}

export enum IconToast {
    Error = 'i-heroicons-x-circle',
    Info = 'i-heroicons-information-circle',
    Success = 'i-heroicons-check-circle',
    Warning = 'i-heroicons-exclamation-triangle',
}
