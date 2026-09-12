import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { I18nService } from '@/app/core/i18n/i18n.service';
import { ThemeToggle } from '@/app/shared/ui/theme-toggle/theme-toggle';

/**
 * Shared shell for themed error states (404, 500, ...). Takes the code and
 * copy as inputs so each concrete page only supplies its own story.
 */
@Component({
  selector: 'app-error-page',
  imports: [RouterLink, ThemeToggle],
  templateUrl: './error-page.html',
})
export class ErrorPage {
  protected readonly i18n = inject(I18nService);

  readonly code = input.required<string>();
  readonly title = input.required<string>();
  readonly message = input.required<string>();
}
