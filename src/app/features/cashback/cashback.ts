import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

import { CashbackCredit, CashbackRule } from '../../core/models/cashback.model';
import { CashbackService } from '../../core/services/cashback.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-cashback',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './cashback.html',
  styleUrl: './cashback.scss',
})
export class CashbackPage implements OnInit {
  private readonly cashback = inject(CashbackService);
  private readonly notifications = inject(NotificationService);

  readonly rules = signal<CashbackRule[]>([]);
  readonly credits = signal<CashbackCredit[]>([]);
  readonly loading = signal(true);

  readonly totalCredited = () => this.credits().reduce((sum, c) => sum + Number(c.amount), 0);

  ngOnInit(): void {
    this.cashback.getRules().subscribe({
      next: (rules) => this.rules.set(rules),
      error: () => this.notifications.error('Não foi possível carregar as regras de cashback.'),
    });

    this.cashback.getCredits().subscribe({
      next: (credits) => {
        this.credits.set(credits);
        this.loading.set(false);
      },
      error: () => {
        this.notifications.error('Não foi possível carregar os créditos de cashback.');
        this.loading.set(false);
      },
    });
  }
}
