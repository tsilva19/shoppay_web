import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    <span class="sp-logo" [class.sp-logo--lg]="size() === 'lg'">
      <svg class="sp-logo__mark" viewBox="0 0 32 32" width="1em" height="1em" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="var(--sp-orange)" />
        <path
          d="M9 18.5c0-3.5 2.8-6 7-6 1.6 0 2.9.35 3.9 1l-1.3 2.2c-.7-.4-1.6-.65-2.5-.65-2.2 0-3.6 1.3-3.6 3.15 0 1.9 1.5 3.15 3.7 3.15.9 0 1.8-.25 2.5-.65l1.2 2.2c-1 .65-2.4 1-4 1-4.1 0-6.9-2.4-6.9-5.4Z"
          fill="var(--sp-yellow)"
        />
      </svg>
      <span class="sp-logo__text">
        <span class="sp-logo__shop">Shop</span><span class="sp-logo__pay">Pay</span>
      </span>
    </span>
  `,
  styles: [
    `
      .sp-logo {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-weight: 800;
        font-size: 1.15rem;
        letter-spacing: -0.01em;
      }
      .sp-logo--lg {
        font-size: 1.6rem;
        gap: 10px;
      }
      .sp-logo__mark {
        flex-shrink: 0;
      }
      .sp-logo__shop {
        color: var(--sp-blue-dark);
      }
      .sp-logo__pay {
        color: var(--sp-orange);
      }
    `,
  ],
})
export class Logo {
  readonly size = input<'md' | 'lg'>('md');
}
