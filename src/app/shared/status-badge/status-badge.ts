import { Component, computed, input } from '@angular/core';

const LABELS: Record<string, string> = {
  PENDING: 'Aguardando',
  PAID: 'Pago',
  EXPIRED: 'Expirado',
  OVERDUE: 'Vencido',
  COMPLETED: 'Concluído',
  FAILED: 'Falhou',
};

const TONES: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  PENDING: 'warning',
  PAID: 'success',
  COMPLETED: 'success',
  EXPIRED: 'danger',
  OVERDUE: 'danger',
  FAILED: 'danger',
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="sp-badge sp-badge--{{ tone() }}">{{ label() }}</span>`,
  styles: [
    `
      .sp-badge {
        display: inline-flex;
        align-items: center;
        padding: 3px 10px;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 700;
        white-space: nowrap;
      }
      .sp-badge--success {
        background: var(--sp-success-soft);
        color: var(--sp-success);
      }
      .sp-badge--warning {
        background: var(--sp-yellow-soft);
        color: #8a6300;
      }
      .sp-badge--danger {
        background: var(--sp-danger-soft);
        color: var(--sp-danger);
      }
      .sp-badge--info {
        background: var(--sp-blue-soft);
        color: var(--sp-blue-dark);
      }
    `,
  ],
})
export class StatusBadge {
  readonly status = input.required<string>();

  readonly label = computed(() => LABELS[this.status()] ?? this.status());
  readonly tone = computed(() => TONES[this.status()] ?? 'info');
}
