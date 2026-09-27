import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Logo],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly navItems = [
    { path: '/dashboard', label: 'Início', icon: '⌂' },
    { path: '/extrato', label: 'Extrato', icon: '≡' },
    { path: '/pix', label: 'Pix', icon: '⇄' },
    { path: '/boletos', label: 'Boletos', icon: '▤' },
    { path: '/compras', label: 'Carnê digital', icon: '▦' },
    { path: '/cashback', label: 'Cashback', icon: '★' },
  ];

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
