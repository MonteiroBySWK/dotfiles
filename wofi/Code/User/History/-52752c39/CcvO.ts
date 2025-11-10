import { toast } from 'sonner';
import { animations } from './use-gsap';

interface ToastOptions {
  duration?: number;
  position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
}

export const useAnimatedToast = () => {
  const success = (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      className: 'animated-toast-success',
      style: {
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
      },
    });
  };

  const error = (message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: options?.duration || 5000,
      position: options?.position || 'top-right',
      className: 'animated-toast-error',
      style: {
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
      },
    });
  };

  const info = (message: string, options?: ToastOptions) => {
    toast.info(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      className: 'animated-toast-info',
      style: {
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
      },
    });
  };

  const loading = (message: string) => {
    return toast.loading(message, {
      className: 'animated-toast-loading',
      style: {
        backgroundColor: '#6b7280',
        color: 'white',
        border: 'none',
      },
    });
  };

  const promise = <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading?: string;
      success?: string | ((data: T) => string);
      error?: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading: loading || 'Carregando...',
      success: success || 'Sucesso!',
      error: error || 'Erro!',
      className: 'animated-toast-promise',
    });
  };

  return {
    success,
    error,
    info,
    loading,
    promise,
  };
};

export default useAnimatedToast;