import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
  autorisationsOuvert = false;
  menuActif: string | null = null;
  menuOpen: any;
  showSubMenu: any;

  constructor(private router: Router) { }
  toggleMenu(menu: string) {
    this.menuActif = this.menuActif === menu ? null : menu;
  }

  logout() {
    console.log("Logout cliqué");
    localStorage.clear();
    this.router.navigate(['/login']);
  }


}
