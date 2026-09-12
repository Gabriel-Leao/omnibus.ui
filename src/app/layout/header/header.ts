import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageSwitcher } from '@/app/shared/ui/language-switcher/language-switcher';
import { ThemeToggle } from '@/app/shared/ui/theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ThemeToggle, LanguageSwitcher],
  templateUrl: './header.html',
})
export class Header {}
