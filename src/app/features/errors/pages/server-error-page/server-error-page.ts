import { Component, inject } from '@angular/core';

import { I18nService } from '@/app/core/i18n/i18n.service';
import { ErrorPage } from '@/app/features/errors/error-page/error-page';

@Component({
  selector: 'app-server-error-page',
  imports: [ErrorPage],
  template: `
    <app-error-page
      code="500"
      [title]="i18n.dict().serverError.title"
      [message]="i18n.dict().serverError.message"
    />
  `,
})
export class ServerErrorPage {
  protected readonly i18n = inject(I18nService);
}
