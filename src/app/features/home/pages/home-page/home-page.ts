import { Component, inject } from '@angular/core';

import { I18nService } from '@/app/core/i18n/i18n.service';
import { ComicPanel } from '@/app/shared/ui/comic-panel/comic-panel';

@Component({
  selector: 'app-home-page',
  imports: [ComicPanel],
  templateUrl: './home-page.html',
})
export class HomePage {
  protected readonly i18n = inject(I18nService);
}
