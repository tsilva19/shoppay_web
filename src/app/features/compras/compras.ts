import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Installment, Purchase } from '../../core/models/payments.model';
import { NotificationService } from '../../core/services/notification.service';
import { PaymentsService } from '../../core/services/payments.service';
import { StatusBadge } from '../../shared/status-badge/status-badge';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe, StatusBadge],
  templateUrl: './compras.html',
  styleUrl: './compras.scss',
})
export class ComprasPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly payments = inject(PaymentsService);
  private readonly notifications = inject(NotificationService);

  readonly purchases = signal<Purchase[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly payingId = signal<number | null>(null);
  readonly expandedId = signal<number | null>(null);

  readonly form = this.fb.nonNullable.group({
    merchant: ['', Validators.required],
    total_amount: ['', [Validators.required, Validators.min(0.01)]],
    installments_count: [1, [Validators.required, Validators.min(1), Validators.max(24)]],
  });

  ngOnInit(): void {
    this.payments.getPurchases().subscribe({
      next: (purchases) => {
        this.purchases.set(purchases);
        this.loading.set(false);
      },
      error: () => {
        this.notifications.error('Não foi possível carregar as compras.');
        this.loading.set(false);
      },
    });
  }

  toggle(purchase: Purchase): void {
    this.expandedId.set(this.expandedId() === purchase.id ? null : purchase.id);
  }

  create(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const payload = this.form.getRawValue();

    this.payments.createPurchase(payload).subscribe({
      next: (purchase) => {
        this.purchases.update((list) => [purchase, ...list]);
        this.expandedId.set(purchase.id);
        this.form.reset({ installments_count: 1 });
        this.saving.set(false);
        this.notifications.success('Compra criada — carnê digital gerado.');
      },
      error: () => {
        this.saving.set(false);
        this.notifications.error('Não foi possível criar a compra.');
      },
    });
  }

  payInstallment(purchase: Purchase, installment: Installment): void {
    this.payingId.set(installment.id);
    this.payments.payInstallment(installment.id).subscribe({
      next: (updated) => {
        this.purchases.update((list) =>
          list.map((p) =>
            p.id !== purchase.id
              ? p
              : { ...p, installments: p.installments.map((i) => (i.id === updated.id ? updated : i)) }
          )
        );
        this.payingId.set(null);
        this.notifications.success(`Parcela ${installment.number} paga com sucesso.`);
      },
      error: () => {
        this.payingId.set(null);
        this.notifications.error('Não foi possível pagar a parcela (verifique o saldo).');
      },
    });
  }
}
