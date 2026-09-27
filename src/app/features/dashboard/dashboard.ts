import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Transaction, Wallet } from '../../core/models/wallet.model';
import { NotificationService } from '../../core/services/notification.service';
import { WalletService } from '../../core/services/wallet.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardPage implements OnInit {
  private readonly walletService = inject(WalletService);
  private readonly notifications = inject(NotificationService);

  readonly wallet = signal<Wallet | null>(null);
  readonly transactions = signal<Transaction[]>([]);
  readonly loading = signal(true);

  readonly shortcuts = [
    { path: '/pix', label: 'Pix', hint: 'Cobrar ou transferir', icon: '⇄' },
    { path: '/boletos', label: 'Boletos', hint: 'Emitir ou pagar', icon: '▤' },
    { path: '/compras', label: 'Carnê digital', hint: 'Comprar parcelado', icon: '▦' },
    { path: '/cashback', label: 'Cashback', hint: 'Regras e créditos', icon: '★' },
  ];

  ngOnInit(): void {
    this.walletService.getMyWallet().subscribe({
      next: (wallet) => this.wallet.set(wallet),
      error: () => this.notifications.error('Não foi possível carregar a carteira.'),
    });

    this.walletService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions.set(transactions.slice(0, 6));
        this.loading.set(false);
      },
      error: () => {
        this.notifications.error('Não foi possível carregar o extrato.');
        this.loading.set(false);
      },
    });
  }
}
