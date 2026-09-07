import { Component } from '@angular/core';

import { ComicPanel } from '@/app/shared/ui/comic-panel/comic-panel';

@Component({
  selector: 'app-home-page',
  imports: [ComicPanel],
  templateUrl: './home-page.html',
})
export class HomePage {}
