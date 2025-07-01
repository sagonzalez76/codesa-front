import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
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
