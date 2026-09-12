import { Component, inject } from '@angular/core';

import { I18nService } from '@/app/core/i18n/i18n.service';
import { ThemeService } from '@/app/core/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.html',
})
export class ThemeToggle {
  protected readonly themeService = inject(ThemeService);
  protected readonly i18n = inject(I18nService);
}
