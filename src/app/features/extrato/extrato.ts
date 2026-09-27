import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { Transaction, TransactionKind } from '../../core/models/wallet.model';
import { NotificationService } from '../../core/services/notification.service';
import { WalletService } from '../../core/services/wallet.service';

type Filter = 'ALL' | TransactionKind;

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './extrato.html',
  styleUrl: './extrato.scss',
})
export class ExtratoPage implements OnInit {
  private readonly walletService = inject(WalletService);
  private readonly notifications = inject(NotificationService);

  readonly transactions = signal<Transaction[]>([]);
  readonly loading = signal(true);
  readonly filter = signal<Filter>('ALL');

  readonly filtered = computed(() => {
    const filter = this.filter();
    const all = this.transactions();
    return filter === 'ALL' ? all : all.filter((tx) => tx.kind === filter);
  });

  ngOnInit(): void {
    this.walletService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions.set(transactions);
        this.loading.set(false);
      },
      error: () => {
        this.notifications.error('Não foi possível carregar o extrato.');
        this.loading.set(false);
      },
    });
  }

  setFilter(filter: Filter): void {
    this.filter.set(filter);
  }
}
