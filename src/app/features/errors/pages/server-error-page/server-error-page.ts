import { Component } from '@angular/core';

import { ErrorPage } from '@/app/features/errors/error-page/error-page';

@Component({
  selector: 'app-server-error-page',
  imports: [ErrorPage],
  template: `
    <app-error-page
      code="500"
      title="A gráfica travou nessa página"
      message="Algo deu errado do nosso lado. Já chamamos a equipe de arte-final; tenta de novo em alguns instantes."
    />
  `,
})
export class ServerErrorPage {}
