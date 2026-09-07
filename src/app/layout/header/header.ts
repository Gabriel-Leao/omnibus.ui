import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ThemeToggle } from '@/app/shared/ui/theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ThemeToggle],
  templateUrl: './header.html',
})
export class Header {}
