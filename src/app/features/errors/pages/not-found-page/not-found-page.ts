import { Component } from '@angular/core';

import { ErrorPage } from '@/app/features/errors/error-page/error-page';

@Component({
  selector: 'app-not-found-page',
  imports: [ErrorPage],
  template: `
    <app-error-page
      code="404"
      title="Essa edição não existe nesse universo"
      message="A página que você procura foi cancelada, nunca foi publicada ou mudou de editora. Confere o endereço ou volta para a capa."
    />
  `,
})
export class NotFoundPage {}
