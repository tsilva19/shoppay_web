import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { PixCharge, PixTransfer } from '../../core/models/payments.model';
import { NotificationService } from '../../core/services/notification.service';
import { PaymentsService } from '../../core/services/payments.service';
import { StatusBadge } from '../../shared/status-badge/status-badge';

type Tab = 'charges' | 'transfers';

@Component({
  selector: 'app-pix',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe, StatusBadge],
  templateUrl: './pix.html',
  styleUrl: './pix.scss',
})
export class PixPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly payments = inject(PaymentsService);
  private readonly notifications = inject(NotificationService);

  readonly tab = signal<Tab>('charges');
  readonly charges = signal<PixCharge[]>([]);
  readonly transfers = signal<PixTransfer[]>([]);
  readonly loading = signal(true);
  readonly savingCharge = signal(false);
  readonly savingTransfer = signal(false);
  readonly payingId = signal<number | null>(null);

  readonly chargeForm = this.fb.nonNullable.group({
    amount: ['', [Validators.required, Validators.min(0.01)]],
    description: [''],
  });

  readonly transferForm = this.fb.nonNullable.group({
    to_pix_key: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0.01)]],
    description: [''],
  });

  ngOnInit(): void {
    this.loadCharges();
    this.loadTransfers();
  }

  setTab(tab: Tab): void {
    this.tab.set(tab);
  }

  private loadCharges(): void {
    this.payments.getPixCharges().subscribe({
      next: (charges) => {
        this.charges.set(charges);
        this.loading.set(false);
      },
      error: () => {
        this.notifications.error('Não foi possível carregar as cobranças Pix.');
        this.loading.set(false);
      },
    });
  }

  private loadTransfers(): void {
    this.payments.getPixTransfers().subscribe({
      next: (transfers) => this.transfers.set(transfers),
      error: () => this.notifications.error('Não foi possível carregar as transferências Pix.'),
    });
  }

  createCharge(): void {
    if (this.chargeForm.invalid || this.savingCharge()) {
      this.chargeForm.markAllAsTouched();
      return;
    }

    this.savingCharge.set(true);
    const { amount, description } = this.chargeForm.getRawValue();

    this.payments.createPixCharge({ amount, description }).subscribe({
      next: (charge) => {
        this.charges.update((list) => [charge, ...list]);
        this.chargeForm.reset();
        this.savingCharge.set(false);
        this.notifications.success('Cobrança Pix gerada com sucesso.');
      },
      error: () => {
        this.savingCharge.set(false);
        this.notifications.error('Não foi possível gerar a cobrança Pix.');
      },
    });
  }

  payCharge(charge: PixCharge): void {
    this.payingId.set(charge.id);
    this.payments.payPixCharge(charge.id).subscribe({
      next: (updated) => {
        this.charges.update((list) => list.map((c) => (c.id === updated.id ? updated : c)));
        this.payingId.set(null);
        this.notifications.success('Cobrança paga — saldo creditado na carteira.');
      },
      error: () => {
        this.payingId.set(null);
        this.notifications.error('Não foi possível pagar essa cobrança.');
      },
    });
  }

  createTransfer(): void {
    if (this.transferForm.invalid || this.savingTransfer()) {
      this.transferForm.markAllAsTouched();
      return;
    }

    this.savingTransfer.set(true);
    const { to_pix_key, amount, description } = this.transferForm.getRawValue();

    this.payments.createPixTransfer({ to_pix_key, amount, description }).subscribe({
      next: (transfer) => {
        this.transfers.update((list) => [transfer, ...list]);
        this.transferForm.reset();
        this.savingTransfer.set(false);
        this.notifications.success('Transferência Pix enviada com sucesso.');
      },
      error: (err) => {
        this.savingTransfer.set(false);
        const message =
          err?.error?.detail ?? 'Não foi possível enviar a transferência (verifique saldo e chave Pix).';
        this.notifications.error(message);
      },
    });
  }
}
