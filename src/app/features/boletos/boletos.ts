import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Boleto } from '../../core/models/payments.model';
import { NotificationService } from '../../core/services/notification.service';
import { PaymentsService } from '../../core/services/payments.service';
import { StatusBadge } from '../../shared/status-badge/status-badge';

@Component({
  selector: 'app-boletos',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe, StatusBadge],
  templateUrl: './boletos.html',
  styleUrl: './boletos.scss',
})
export class BoletosPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly payments = inject(PaymentsService);
  private readonly notifications = inject(NotificationService);

  readonly boletos = signal<Boleto[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly payingId = signal<number | null>(null);

  readonly form = this.fb.nonNullable.group({
    description: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0.01)]],
    due_date: ['', Validators.required],
  });

  ngOnInit(): void {
    this.payments.getBoletos().subscribe({
      next: (boletos) => {
        this.boletos.set(boletos);
        this.loading.set(false);
      },
      error: () => {
        this.notifications.error('Não foi possível carregar os boletos.');
        this.loading.set(false);
      },
    });
  }

  create(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const payload = this.form.getRawValue();

    this.payments.createBoleto(payload).subscribe({
      next: (boleto) => {
        this.boletos.update((list) => [boleto, ...list]);
        this.form.reset();
        this.saving.set(false);
        this.notifications.success('Boleto emitido com sucesso.');
      },
      error: () => {
        this.saving.set(false);
        this.notifications.error('Não foi possível emitir o boleto.');
      },
    });
  }

  pay(boleto: Boleto): void {
    this.payingId.set(boleto.id);
    this.payments.payBoleto(boleto.id).subscribe({
      next: (updated) => {
        this.boletos.update((list) => list.map((b) => (b.id === updated.id ? updated : b)));
        this.payingId.set(null);
        this.notifications.success('Boleto pago com sucesso.');
      },
      error: () => {
        this.payingId.set(null);
        this.notifications.error('Não foi possível pagar o boleto (verifique o saldo).');
      },
    });
  }
}
