import { Component, inject } from '@angular/core';

import { I18nService } from '@/app/core/i18n/i18n.service';
import { ErrorPage } from '@/app/features/errors/error-page/error-page';

@Component({
  selector: 'app-not-found-page',
  imports: [ErrorPage],
  template: `
    <app-error-page
      code="404"
      [title]="i18n.dict().notFound.title"
      [message]="i18n.dict().notFound.message"
    />
  `,
})
export class NotFoundPage {
  protected readonly i18n = inject(I18nService);
}
