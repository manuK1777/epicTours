import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding d-flex align-items-center">
      @if(options.theme === 'light') {
      <a [routerLink]="['/']">
        <img
          src="./assets/images/logos/dark-logo.svg"
          class="align-middle"
          alt="logo"
          style="width: 80%, height: 80%"
        />
      </a>
      } @if(options.theme === 'dark') {
      <a [routerLink]="['/']">
        <img
          src="./assets/images/logos/light-logo.svg"
          class="align-middle"
          alt="logo"
        />
      </a>
      }
    </div>
  `,
})
export class BrandingComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService) {}
}