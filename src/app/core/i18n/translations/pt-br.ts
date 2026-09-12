import type { Translations } from './translations';

export const PT_BR: Translations = {
  header: {
    brand: 'OMNIBUS',
  },

  themeToggle: {
    ariaSwitchToLight: 'Ativar modo claro',
    ariaSwitchToDark: 'Ativar modo escuro',
    titleLight: 'Modo claro',
    titleDark: 'Modo escuro',
  },

  languageSwitcher: {
    ariaLabel: 'Selecionar idioma',
    title: 'Idioma',
  },

  modal: {
    close: 'Fechar',
  },

  inputField: {
    showPassword: 'Mostrar senha',
    hidePassword: 'Ocultar senha',
  },

  otpInput: {
    digitAria: (position) => `Dígito ${position} do código`,
  },

  home: {
    caption: 'Em construção',
    title: 'A loja ainda está no rascunho',
    body: 'O catálogo, o carrinho e os pedidos ainda estão sendo desenhados nas próximas pranchas. Por enquanto, sua conta já está pronta e esperando pela primeira edição.',
  },

  errorPage: {
    backToCover: 'Voltar para a capa',
  },

  notFound: {
    title: 'Essa edição não existe nesse universo',
    message:
      'A página que você procura foi cancelada, nunca foi publicada ou mudou de editora. Confere o endereço ou volta para a capa.',
  },

  serverError: {
    title: 'A gráfica travou nessa página',
    message:
      'Algo deu errado do nosso lado. Já chamamos a equipe de arte-final; tenta de novo em alguns instantes.',
  },

  resendModal: {
    title: 'Olha sua caixa de entrada!',
    body: 'Se o e-mail informado tiver uma conta, o código já foi enviado. Não chegou em alguns minutos? Dá uma espiada na caixa de spam — o carteiro às vezes se perde no caminho.',
    exhausted:
      'Você já usou os códigos disponíveis nas últimas 24 horas. Tenta de novo mais tarde.',
    waitSeconds: (seconds) => `Aguarde ${seconds}s`,
    resendNow: 'Reenviar agora',
    resent: (remaining) => `Reenviado! (${remaining} reenvio(s) restante(s))`,
  },

  auth: {
    login: {
      caption: 'Capítulo 1 — Entrar',
      title: 'Bem-vindo de volta',
      subtitle: 'Entre para continuar sua coleção.',
      passwordResetNotice: 'Senha atualizada! Já pode entrar com a nova senha.',
      emailLabel: 'E-mail',
      emailPlaceholder: 'voce@email.com',
      passwordLabel: 'Senha',
      passwordPlaceholder: '••••••••',
      forgotLink: 'Esqueci minha senha',
      submit: 'Entrar',
      noAccount: 'Ainda não tem conta?',
      createAccountLink: 'Criar conta',
      invalidEmail: 'Digite um e-mail válido.',
      emptyPassword: 'Digite sua senha.',
      fallbackError: 'E-mail ou senha incorretos. Tenta de novo, herói.',
    },

    register: {
      caption: 'Origem — Criar conta',
      title: 'Comece sua coleção',
      subtitle: 'Leva menos de um minuto.',
      nameLabel: 'Nome',
      namePlaceholder: 'Seu nome completo',
      emailLabel: 'E-mail',
      emailPlaceholder: 'voce@email.com',
      birthDateLabel: 'Data de nascimento',
      birthDateHint: 'É preciso ter 18 anos ou mais.',
      birthDatePlaceholder: 'dd/mm/aaaa',
      passwordLabel: 'Senha',
      passwordPlaceholder: 'Mínimo de 8 caracteres',
      confirmPasswordLabel: 'Confirmar senha',
      confirmPasswordPlaceholder: 'Repita a senha',
      submit: 'Criar conta',
      hasAccount: 'Já tem conta?',
      loginLink: 'Entrar',
      nameTooShort: 'Conta seu nome pra gente (mínimo 3 caracteres).',
      invalidEmail: 'Digite um e-mail válido.',
      invalidPassword: 'A senha precisa ter entre 8 e 72 caracteres.',
      passwordMismatch: 'As senhas não coincidem.',
      underage: 'É preciso ter 18 anos ou mais para se cadastrar.',
      fallbackError: 'Não deu pra completar o cadastro agora. Tenta de novo em instantes.',
    },

    forgotPassword: {
      caption: 'Recuperar senha',
      title: 'Esqueceu a senha?',
      subtitle: 'Digite seu e-mail e mandamos um código de verificação.',
      emailLabel: 'E-mail',
      emailPlaceholder: 'voce@email.com',
      submit: 'Enviar código',
      rememberedPassword: 'Lembrou a senha?',
      backToLoginLink: 'Voltar para o login',
      invalidEmail: 'Digite um e-mail válido.',
      fallbackError: 'Não deu pra enviar o código agora. Tenta de novo em instantes.',
    },

    verifyResetCode: {
      caption: 'Recuperar senha — Código',
      title: 'Digite o código',
      subtitleBeforeEmail: 'Enviamos 6 dígitos para',
      subtitleEmailFallback: 'seu e-mail',
      submit: 'Confirmar código',
      resendButton: 'Reenviar código',
      backToLoginLink: '← Voltar para o login',
      invalidOtp: 'Digite os 6 dígitos do código.',
      fallbackError: 'Código inválido ou expirado. Confere os dígitos ou peça um novo.',
      resendErrorFallback: 'Não deu pra reenviar agora.',
    },

    resetPassword: {
      caption: 'Capítulo final — Nova senha',
      title: 'Defina uma nova senha',
      subtitle: 'Escolha algo forte — e novo, por favor.',
      newPasswordLabel: 'Nova senha',
      newPasswordPlaceholder: 'Mínimo de 8 caracteres',
      confirmPasswordLabel: 'Confirmar nova senha',
      confirmPasswordPlaceholder: 'Repita a senha',
      submit: 'Salvar nova senha',
      invalidPassword: 'A senha precisa ter entre 8 e 72 caracteres.',
      passwordMismatch: 'As senhas não coincidem.',
      expiredSession: 'Sua sessão de recuperação expirou. Peça um novo código.',
      fallbackError: 'Não deu pra atualizar a senha. Peça um novo código e tente de novo.',
    },

    activateAccount: {
      caption: 'Capítulo 2 — Ativar conta',
      title: 'Confirme seu e-mail',
      subtitleBeforeEmail: 'Mandamos um código de 6 dígitos para',
      subtitleEmailFallback: 'seu e-mail',
      submit: 'Ativar conta',
      resendButton: 'Reenviar código',
      backToLoginLink: '← Voltar para o login',
      invalidOtp: 'Digite os 6 dígitos do código.',
      fallbackError: 'Código inválido ou expirado. Confere os dígitos ou peça um novo.',
      resendErrorFallback: 'Não deu pra reenviar agora.',
      activatedModalTitle: 'Conta ativada!',
      activatedModalBody:
        'Sua conta já está ativa e pronta pra coleção. A loja ainda está em construção, mas você já pode dar uma olhada.',
      activatedModalButton: 'Ir para a loja',
    },
  },

  apiErrors: {
    validationFailed:
      'Alguns dados enviados são inválidos. Confira o formulário e tente novamente.',
    malformedBody: 'Não foi possível processar a solicitação. Tente novamente.',
    invalidCredentials: 'E-mail ou senha incorretos. Tenta de novo, herói.',
    tooManyCodes:
      'Você já usou os códigos disponíveis nas últimas 24 horas. Tenta de novo mais tarde.',
    resendCooldown: 'Um código já foi enviado há pouco. Aguarde antes de pedir outro.',
    invalidOrExpiredCode: 'Código inválido ou expirado. Confere os dígitos ou peça um novo.',
    maxAttemptsExceeded: 'Número máximo de tentativas excedido. Peça um novo código.',
    customerNotFound: 'Não foi possível localizar sua conta. Peça um novo código de recuperação.',
    requestInProgress: 'Solicitação já em andamento; tente novamente.',
    unexpected: 'Ocorreu um erro inesperado. Tente novamente em instantes.',
  },
};
