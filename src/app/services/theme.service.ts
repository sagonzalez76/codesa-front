// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class ThemeService {
//   private readonly themeStorageKey = 'selected-theme';
//   private readonly themeBaseUrl = 'assets/themes/';

//   constructor() { }

//   changeTheme(themeName: string): void {
//     const themeHref = `${this.themeBaseUrl}${themeName}/theme.css`;

//     let themeLink = document.getElementById('theme-css') as HTMLLinkElement;

//     if (themeLink) {
//       themeLink.href = themeHref;
//     } else {
//       themeLink = document.createElement('link');
//       themeLink.id = 'theme-css';
//       themeLink.rel = 'stylesheet';
//       themeLink.href = themeHref;
//       document.head.appendChild(themeLink);
//     }

//     localStorage.setItem(this.themeStorageKey, themeName);
//   }

//   loadStoredTheme(): void {
//     const storedTheme = localStorage.getItem(this.themeStorageKey);
//     if (storedTheme) {
//       this.changeTheme(storedTheme);
//     }
//   }
// }

// src/app/services/theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // 👈 Esto lo registra automáticamente como un singleton
})
export class ThemeService {
  private themeLinkId = 'theme-css';

  changeTheme(themeName: string): void {
    const themeUrl = `assets/themes/${themeName}/theme.css`;
    let linkElement = document.getElementById(this.themeLinkId) as HTMLLinkElement;

    if (linkElement) {
      linkElement.href = themeUrl;
    } else {
      linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.id = this.themeLinkId;
      linkElement.href = themeUrl;
      document.head.appendChild(linkElement);
    }

    localStorage.setItem('selected-theme', themeName);
  }

  loadStoredTheme(): void {
    const storedTheme = localStorage.getItem('selected-theme') || 'lara-light-blue';
    this.changeTheme(storedTheme);
  }
}
