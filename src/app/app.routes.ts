import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.LoginPage),
  },
  {
    path: '',
    loadComponent: () => import('./shared/layout/layout').then((m) => m.Layout),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.DashboardPage),
      },
      {
        path: 'extrato',
        loadComponent: () => import('./features/extrato/extrato').then((m) => m.ExtratoPage),
      },
      {
        path: 'pix',
        loadComponent: () => import('./features/pix/pix').then((m) => m.PixPage),
      },
      {
        path: 'boletos',
        loadComponent: () => import('./features/boletos/boletos').then((m) => m.BoletosPage),
      },
      {
        path: 'compras',
        loadComponent: () => import('./features/compras/compras').then((m) => m.ComprasPage),
      },
      {
        path: 'cashback',
        loadComponent: () => import('./features/cashback/cashback').then((m) => m.CashbackPage),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
