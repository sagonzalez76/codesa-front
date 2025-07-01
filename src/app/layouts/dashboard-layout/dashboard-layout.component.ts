import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'],
  imports: [
    CommonModule,
    RouterOutlet,
    PanelMenuModule,
    ButtonModule,
    MenuModule // ✅ nuevo
  ]
})
export class DashboardLayoutComponent implements OnInit {
  menuItems: MenuItem[] = [];
  mobileSidebarActive = false;
  selectedTheme = 'lara-light-blue';

  themeMenuItems: MenuItem[] = [];

  constructor(private router: Router, private themeService: ThemeService) { }

  ngOnInit(): void {
    this.setMenuItems();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.setMenuItems());

    this.themeService.loadStoredTheme();
    this.selectedTheme = localStorage.getItem('selected-theme') || 'lara-light-blue';

    // ✅ Definimos las opciones del menú contextual
    this.themeMenuItems = [
      {
        label: 'Lara Claro',
        icon: 'pi pi-sun',
        command: () => this.changeTheme('lara-light-blue')
      },
      {
        label: 'Lara Oscuro',
        icon: 'pi pi-moon',
        command: () => this.changeTheme('lara-dark-blue')
      },
      {
        label: 'Vela Oscuro',
        icon: 'pi pi-palette',
        command: () => this.changeTheme('vela-blue')
      }
    ];
  }

  setMenuItems(): void {
    this.menuItems = [
      {
        label: 'Personas',
        icon: 'pi pi-users',
        routerLink: ['/personas'],
        styleClass: this.isActiveRoute('/personas') ? 'active-link' : '',
        command: () => this.mobileSidebarActive = false // 👈 cerrar sidebar
      },
      {
        label: 'Cursos',
        icon: 'pi pi-book',
        routerLink: ['/cursos'],
        styleClass: this.isActiveRoute('/cursos') ? 'active-link' : '',
        command: () => this.mobileSidebarActive = false
      },
      {
        label: 'Estudiantes',
        icon: 'pi pi-user',
        routerLink: ['/estudiantes'],
        styleClass: this.isActiveRoute('/estudiantes') ? 'active-link' : '',
        command: () => this.mobileSidebarActive = false
      },
      {
        label: 'Profesores',
        icon: 'pi pi-user-edit',
        routerLink: ['/profesores'],
        styleClass: this.isActiveRoute('/profesores') ? 'active-link' : '',
        command: () => this.mobileSidebarActive = false
      },
      {
        label: 'Administrativos',
        icon: 'pi pi-user-plus',
        routerLink: ['/administrativos'],
        styleClass: this.isActiveRoute('/administrativos') ? 'active-link' : '',
        command: () => this.mobileSidebarActive = false
      },
      {
        label: 'Inscripciones',
        icon: 'pi pi-id-card',
        routerLink: ['/inscripciones'],
        styleClass: this.isActiveRoute('/inscripciones') ? 'active-link' : '',
        command: () => this.mobileSidebarActive = false
      }
    ];
  }


  isActiveRoute(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  toggleMobileSidebar() {
    this.mobileSidebarActive = !this.mobileSidebarActive;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  changeTheme(themeName: string) {
    this.selectedTheme = themeName;
    this.themeService.changeTheme(themeName);
  }
}
