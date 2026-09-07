import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  readonly code = input.required<string>();
  readonly title = input.required<string>();
  readonly message = input.required<string>();
}
