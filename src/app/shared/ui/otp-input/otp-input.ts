import { Component, type ElementRef, model, viewChildren } from '@angular/core';

const DIGIT_COUNT = 6;

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.html',
})
export class OtpInput {
  readonly value = model('');

  protected readonly digitIndexes = Array.from({ length: DIGIT_COUNT }, (_, i) => i);
  private readonly cells = viewChildren<ElementRef<HTMLInputElement>>('cell');

  protected digitAt(index: number): string {
    return this.value().charAt(index) ?? '';
  }

  protected onDigitInput(index: number, event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const digit = raw.replace(/\D/g, '').slice(-1);

    const digits = this.value().padEnd(DIGIT_COUNT, ' ').split('');
    digits[index] = digit || ' ';
    this.value.set(digits.join('').trimEnd());

    if (digit && index < DIGIT_COUNT - 1) {
      this.focusCell(index + 1);
    }
  }

  protected onKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.digitAt(index) && index > 0) {
      this.focusCell(index - 1);
    }
  }

  protected onPaste(event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, DIGIT_COUNT);
    if (!pasted) {
      return;
    }
    event.preventDefault();
    this.value.set(pasted);
    this.focusCell(Math.min(pasted.length, DIGIT_COUNT - 1));
  }

  private focusCell(index: number): void {
    queueMicrotask(() => this.cells()[index]?.nativeElement.focus());
  }
}
