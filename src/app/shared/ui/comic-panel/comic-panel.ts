import { Component, input } from '@angular/core';

@Component({
  selector: 'app-comic-panel',
  templateUrl: './comic-panel.html',
})
export class ComicPanel {
  /** Small caption-box label, comic-style, overlapping the panel's top edge. */
  readonly caption = input<string | null>(null);
}
