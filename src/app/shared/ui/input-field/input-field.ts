import { Component, input, model, signal } from '@angular/core';

let nextId = 0;

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.html',
})
export class InputField {
  readonly label = input.required<string>();
  readonly type = input<'text' | 'email' | 'password' | 'date' | 'url'>('text');
  readonly placeholder = input('');
  readonly hint = input('');
  readonly error = input<string | null>(null);
  readonly autocomplete = input('off');

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
    this.value.set((event.target as HTMLInputElement).value);
  }
}
