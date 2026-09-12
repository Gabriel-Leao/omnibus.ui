import {
  Component,
  effect,
  type ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';

import { I18nService } from '@/app/core/i18n/i18n.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
})
export class Modal {
  protected readonly i18n = inject(I18nService);

  readonly open = input(false);
  readonly title = input('');
  readonly closed = output<void>();

  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');

  constructor() {
    // Move keyboard focus into the dialog whenever it opens, so Escape and
    // Tab work immediately without the person needing to click first.
    effect(() => {
      if (this.open()) {
        queueMicrotask(() => this.dialog()?.nativeElement.focus());
      }
    });
  }

  protected close(): void {
    this.closed.emit();
  }
}
