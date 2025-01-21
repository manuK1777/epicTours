import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'EpicTours';

  constructor(private titleService: Title, private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let route = this.router.routerState.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        const title = route.snapshot.data['title'];
        console.log('Current Route Title:', title);
        if (title) {
          console.log('Current Route Title:', title);
          this.titleService.setTitle(title);
        }
      }
    });
  }
}
