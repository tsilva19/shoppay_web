import { Component, inject } from '@angular/core';

import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="sp-toast-stack">
      @for (toast of notifications.toasts(); track toast.id) {
        <div class="sp-toast sp-toast--{{ toast.kind }}" (click)="notifications.dismiss(toast.id)">
          {{ toast.message }}
        </div>
      }
    </div>
  `,
  styles: [
    `
      .sp-toast-stack {
        position: fixed;
        top: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 1000;
        max-width: 320px;
      }
      .sp-toast {
        padding: 12px 16px;
        border-radius: var(--sp-radius-sm);
        box-shadow: var(--sp-shadow-lg);
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        animation: sp-toast-in 0.18s ease-out;
      }
      .sp-toast--success {
        background: var(--sp-success-soft);
        color: var(--sp-success);
        border-left: 4px solid var(--sp-success);
      }
      .sp-toast--error {
        background: var(--sp-danger-soft);
        color: var(--sp-danger);
        border-left: 4px solid var(--sp-danger);
      }
      .sp-toast--info {
        background: var(--sp-blue-soft);
        color: var(--sp-blue-dark);
        border-left: 4px solid var(--sp-blue);
      }
      @keyframes sp-toast-in {
        from {
          opacity: 0;
          transform: translateY(-6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class Toast {
  readonly notifications = inject(NotificationService);
}
