import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ThemeService } from '../../services/theme.service';
import { MenuModule } from 'primeng/menu';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    HttpClientModule,
    MessageModule,
    ToastModule,
    RouterModule,
    MenuModule
  ],
  providers: [MessageService],

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  errorMsg: string | null = null;
  themeMenuItems: MenuItem[] = [];


  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private messageService: MessageService, private themeService: ThemeService) { }

  changeTheme(themeName: string) {
    localStorage.setItem('selected-theme', themeName);
    this.themeService.changeTheme(themeName);
  }

  ngOnInit(): void {
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
      },
      {
        label: 'Viva Oscuro',
        icon: 'pi pi-star',
        command: () => this.changeTheme('viva-dark')
      }
    ];

    const stored = localStorage.getItem('selected-theme');
    if (stored) {
      this.themeService.changeTheme(stored);
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const loginData = this.form.value;

    this.http.post<{ token: string }>(`${environment.apiUrl}/auth/login`, loginData)
      .subscribe({
        next: (response) => {
          localStorage.setItem('authToken', response.token);
          this.messageService.add({
            severity: 'success',
            summary: 'Inicio de sesión exitoso',
            detail: 'Bienvenido',
            life: 3000
          })
          setTimeout(() => {
            this.router.navigate(['/personas']);
          }, 1500);
        },
        error: err => {
          const errorMsg = err.error?.mensaje || 'Credenciales inválidas';
          this.messageService.add({
            severity: 'error',
            summary: 'Error de inicio de sesión',
            detail: errorMsg,
            life: 3000
          });
        }
      });
  }
}
