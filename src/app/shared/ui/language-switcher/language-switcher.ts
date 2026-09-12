import {
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { I18nService } from '@/app/core/i18n/i18n.service';
import type { Locale } from '@/app/core/i18n/locale';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.html',
})
export class LanguageSwitcher {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  protected readonly i18n = inject(I18nService);
  protected readonly open = signal(false);

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    // Move keyboard focus into the dropdown whenever it opens, so Escape
    // works immediately and the panel is reachable without a mouse — the
    // same pattern Modal uses for its dialog.
    effect(() => {
      if (this.open()) {
        queueMicrotask(() => this.panel()?.nativeElement.focus());
      }
    });
  }

  /**
   * Closes the dropdown on any click outside this component, instead of a
   * full-viewport backdrop element — a clickable backdrop with no keyboard
   * equivalent fails accessibility checks (it's not focusable, so it can
   * never be reached or dismissed via keyboard).
   */
  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  protected toggle(): void {
    this.open.update((value) => !value);
  }

  protected close(): void {
    this.open.set(false);
  }

  protected select(locale: Locale): void {
    this.i18n.setLocale(locale);
    this.close();
  }
}
