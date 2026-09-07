import { Component, inject } from '@angular/core';

import { ThemeService } from '@/app/core/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.html',
})
export class ThemeToggle {
  protected readonly themeService = inject(ThemeService);
}
