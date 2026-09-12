import { Component, inject, input, model, signal } from '@angular/core';

import { I18nService } from '@/app/core/i18n/i18n.service';

let nextId = 0;

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.html',
})
export class InputField {
  protected readonly i18n = inject(I18nService);

  readonly label = input.required<string>();
  readonly type = input<'text' | 'email' | 'password' | 'date' | 'url'>('text');
  readonly placeholder = input('');
  readonly hint = input('');
  readonly error = input<string | null>(null);
  readonly autocomplete = input('off');
  readonly inputmode = input<'text' | 'numeric' | 'email' | 'tel' | undefined>(undefined);

  /**
   * Optional formatter applied to the raw keystroke value before it reaches
   * `value` — e.g. inserting the slashes in a `dd/mm/aaaa` date mask. Keeps
   * that formatting logic with whichever page needs it instead of teaching
   * this generic field about dates specifically.
   */
  readonly mask = input<((raw: string) => string) | null>(null);

  readonly value = model('');

  protected readonly id = `field-${nextId++}`;
  protected readonly passwordVisible = signal(false);

  protected get resolvedType(): string {
    if (this.type() !== 'password') {
      return this.type();
    }
    return this.passwordVisible() ? 'text' : 'password';
  }

  protected togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  protected onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const mask = this.mask();
    this.value.set(mask ? mask(raw) : raw);
  }
}
