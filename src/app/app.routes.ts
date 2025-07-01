import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { AuthGuard } from './auth/auth.guard';
import { LoggedInGuard } from './auth/logged-in.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        canActivate: [LoggedInGuard],
        loadComponent: () =>
          import('./auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        canActivate: [LoggedInGuard],
        loadComponent: () =>
          import('./auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]

  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'personas',
        pathMatch: 'full'
      },
      {
        path: 'personas',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./person/person.routes').then(m => m.PERSON_ROUTES)
      },
      {
        path: 'estudiantes',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./student/student.routes').then(m => m.STUDENT_ROUTES)
      },
      {
        path: 'profesores',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./teacher/teacher.routes').then(m => m.TEACHER_ROUTES)
      },
      {
        path: 'administrativos',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./administrative/administrative.routes').then(m => m.ADMINISTRATIVO_ROUTES)
      },
      {
        path: 'cursos',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./course/course.routes').then(m => m.COURSE_ROUTES)
      },
      {
        path: 'inscripciones',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./enrollment/enrollment.routes').then(m => m.enrollmentRoutes)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
