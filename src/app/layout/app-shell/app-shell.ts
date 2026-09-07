import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from '@/app/layout/header/header';

/**
 * Root visual shell: a header (brand + theme toggle, always available) with
 * the routed page centered below it. Auth and account pages render as a
 * single centered form here — no split hero panel.
 */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Header],
  templateUrl: './app-shell.html',
})
export class AppShell {}
