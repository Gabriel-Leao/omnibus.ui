import type { Translations } from './translations';

export const ES: Translations = {
  header: {
    brand: 'OMNIBUS',
  },

  themeToggle: {
    ariaSwitchToLight: 'Activar modo claro',
    ariaSwitchToDark: 'Activar modo oscuro',
    titleLight: 'Modo claro',
    titleDark: 'Modo oscuro',
  },

  languageSwitcher: {
    ariaLabel: 'Seleccionar idioma',
    title: 'Idioma',
  },

  modal: {
    close: 'Cerrar',
  },

  inputField: {
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
  },

  otpInput: {
    digitAria: (position) => `Dígito ${position} del código`,
  },

  home: {
    caption: 'En construcción',
    title: 'La tienda todavía está en boceto',
    body: 'El catálogo, el carrito y los pedidos se siguen dibujando en las próximas páginas. Mientras tanto, tu cuenta ya está lista y esperando su primer número.',
  },

  errorPage: {
    backToCover: 'Volver a la portada',
  },

  notFound: {
    title: 'Ese número no existe en este universo',
    message:
      'La página que buscas fue cancelada, nunca se publicó o cambió de editorial. Revisa la dirección o vuelve a la portada.',
  },

  serverError: {
    title: 'La imprenta se atascó en esta página',
    message:
      'Algo salió mal de nuestro lado. Ya avisamos al equipo de arte final; inténtalo de nuevo en unos instantes.',
  },

  resendModal: {
    title: '¡Revisa tu bandeja de entrada!',
    body: 'Si ese correo tiene una cuenta, el código ya fue enviado. ¿No llegó en unos minutos? Échale un ojo a la carpeta de spam — el cartero a veces se pierde en el camino.',
    exhausted: 'Ya usaste los códigos disponibles en las últimas 24 horas. Inténtalo más tarde.',
    waitSeconds: (seconds) => `Espera ${seconds}s`,
    resendNow: 'Reenviar ahora',
    resent: (remaining) => `¡Reenviado! (${remaining} reenvío(s) restante(s))`,
  },

  auth: {
    login: {
      caption: 'Capítulo 1 — Iniciar sesión',
      title: 'Bienvenido de vuelta',
      subtitle: 'Inicia sesión para seguir con tu colección.',
      passwordResetNotice: '¡Contraseña actualizada! Ya puedes iniciar sesión con la nueva.',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'tu@correo.com',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: '••••••••',
      forgotLink: 'Olvidé mi contraseña',
      submit: 'Iniciar sesión',
      noAccount: '¿Todavía no tienes cuenta?',
      createAccountLink: 'Crear cuenta',
      invalidEmail: 'Escribe un correo electrónico válido.',
      emptyPassword: 'Escribe tu contraseña.',
      fallbackError: 'Correo o contraseña incorrectos. Inténtalo de nuevo, héroe.',
    },

    register: {
      caption: 'Origen — Crear cuenta',
      title: 'Empieza tu colección',
      subtitle: 'Toma menos de un minuto.',
      nameLabel: 'Nombre',
      namePlaceholder: 'Tu nombre completo',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'tu@correo.com',
      birthDateLabel: 'Fecha de nacimiento',
      birthDateHint: 'Hay que tener 18 años o más.',
      birthDatePlaceholder: 'dd/mm/aaaa',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'Mínimo 8 caracteres',
      confirmPasswordLabel: 'Confirmar contraseña',
      confirmPasswordPlaceholder: 'Repite la contraseña',
      submit: 'Crear cuenta',
      hasAccount: '¿Ya tienes cuenta?',
      loginLink: 'Iniciar sesión',
      nameTooShort: 'Cuéntanos tu nombre (mínimo 3 caracteres).',
      invalidEmail: 'Escribe un correo electrónico válido.',
      invalidPassword: 'La contraseña debe tener entre 8 y 72 caracteres.',
      passwordMismatch: 'Las contraseñas no coinciden.',
      underage: 'Hay que tener 18 años o más para registrarte.',
      fallbackError: 'No se pudo completar el registro ahora. Inténtalo de nuevo en un momento.',
    },

    forgotPassword: {
      caption: 'Recuperar contraseña',
      title: '¿Olvidaste tu contraseña?',
      subtitle: 'Escribe tu correo y te enviamos un código de verificación.',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'tu@correo.com',
      submit: 'Enviar código',
      rememberedPassword: '¿Recordaste tu contraseña?',
      backToLoginLink: 'Volver a iniciar sesión',
      invalidEmail: 'Escribe un correo electrónico válido.',
      fallbackError: 'No se pudo enviar el código ahora. Inténtalo de nuevo en un momento.',
    },

    verifyResetCode: {
      caption: 'Recuperar contraseña — Código',
      title: 'Escribe el código',
      subtitleBeforeEmail: 'Enviamos 6 dígitos a',
      subtitleEmailFallback: 'tu correo',
      submit: 'Confirmar código',
      resendButton: 'Reenviar código',
      backToLoginLink: '← Volver a iniciar sesión',
      invalidOtp: 'Escribe los 6 dígitos del código.',
      fallbackError: 'Código inválido o vencido. Revisa los dígitos o pide uno nuevo.',
      resendErrorFallback: 'No se pudo reenviar ahora.',
    },

    resetPassword: {
      caption: 'Capítulo final — Nueva contraseña',
      title: 'Define una nueva contraseña',
      subtitle: 'Elige algo fuerte — y nuevo, por favor.',
      newPasswordLabel: 'Nueva contraseña',
      newPasswordPlaceholder: 'Mínimo 8 caracteres',
      confirmPasswordLabel: 'Confirmar nueva contraseña',
      confirmPasswordPlaceholder: 'Repite la contraseña',
      submit: 'Guardar nueva contraseña',
      invalidPassword: 'La contraseña debe tener entre 8 y 72 caracteres.',
      passwordMismatch: 'Las contraseñas no coinciden.',
      expiredSession: 'Tu sesión de recuperación venció. Pide un nuevo código.',
      fallbackError:
        'No se pudo actualizar la contraseña. Pide un nuevo código e inténtalo de nuevo.',
    },

    activateAccount: {
      caption: 'Capítulo 2 — Activar cuenta',
      title: 'Confirma tu correo',
      subtitleBeforeEmail: 'Enviamos un código de 6 dígitos a',
      subtitleEmailFallback: 'tu correo',
      submit: 'Activar cuenta',
      resendButton: 'Reenviar código',
      backToLoginLink: '← Volver a iniciar sesión',
      invalidOtp: 'Escribe los 6 dígitos del código.',
      fallbackError: 'Código inválido o vencido. Revisa los dígitos o pide uno nuevo.',
      resendErrorFallback: 'No se pudo reenviar ahora.',
      activatedModalTitle: '¡Cuenta activada!',
      activatedModalBody:
        'Tu cuenta ya está activa y lista para la colección. La tienda todavía está en construcción, pero ya puedes echar un vistazo.',
      activatedModalButton: 'Ir a la tienda',
    },
  },

  apiErrors: {
    validationFailed:
      'Algunos datos enviados no son válidos. Revisa el formulario e inténtalo de nuevo.',
    malformedBody: 'No se pudo procesar la solicitud. Inténtalo de nuevo.',
    invalidCredentials: 'Correo o contraseña incorrectos. Inténtalo de nuevo, héroe.',
    tooManyCodes: 'Ya usaste los códigos disponibles en las últimas 24 horas. Inténtalo más tarde.',
    resendCooldown: 'Ya se envió un código hace poco. Espera antes de pedir otro.',
    invalidOrExpiredCode: 'Código inválido o vencido. Revisa los dígitos o pide uno nuevo.',
    maxAttemptsExceeded: 'Se superó el número máximo de intentos. Pide un nuevo código.',
    customerNotFound: 'No pudimos encontrar tu cuenta. Pide un nuevo código de recuperación.',
    requestInProgress: 'Solicitud ya en curso; inténtalo de nuevo.',
    unexpected: 'Ocurrió un error inesperado. Inténtalo de nuevo en un momento.',
  },
};
