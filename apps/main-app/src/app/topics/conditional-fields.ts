/**
 * Topic 7 — Conditional fields: `disabled`, `hidden`, and `readonly` are schema rules with reactive predicates.
 * Optional reasons explain why a field is disabled; `when` on validators ties requirements to the same conditions.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, disabled, hidden, readonly } from '@angular/forms/signals';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatChip } from '@angular/material/chips';

interface OrderData {
  total: number;
  couponCode: string;
  isPublic: boolean;
  publicUrl: string;
  systemId: string;
  isLocked: boolean;
  notes: string;
}

@Component({
  selector: 'df-conditional-fields',
  imports: [
    FormField,
    MatFormField,
    MatLabel,
    MatInput,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatSlideToggle,
    MatChip,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h2 { margin: 0 0 4px; }
    .hint { color: #666; font-size: 14px; margin: 0 0 8px; }
    .topic-remark { color: #555; font-size: 14px; line-height: 1.55; margin: 0 0 24px; max-width: 640px; }
    .topic-remark code { font-size: 13px; }
    .sections { display: flex; flex-direction: column; gap: 16px; max-width: 460px; }
    .section-form { display: flex; flex-direction: column; gap: 4px; }
    .toggle-row { margin: 8px 0; }
    .disabled-reason { margin-top: 4px; }
  `,
  template: `
    <h2>7. Conditional Fields</h2>
    <p class="hint"><code>disabled()</code>, <code>hidden()</code>, <code>readonly()</code> -- reactive rules that control field availability.</p>
    <p class="topic-remark">
      Rules live next to validators: e.g. coupon is disabled until total ≥ 50, with a string reason surfaced as <code>disabledReasons()</code>.
      <code>hidden(publicUrl)</code> tracks visibility while <code>required(..., when:)</code> only enforces URL when “public” is on—keep validation and UI in sync.
      <code>readonly</code> can be unconditional (system id) or toggled (notes when locked).
    </p>

    <div class="sections">
      <mat-card appearance="outlined">
        <mat-card-header><mat-card-title>disabled() with reasons</mat-card-title></mat-card-header>
        <mat-card-content class="section-form">
          <mat-form-field>
            <mat-label>Order Total</mat-label>
            <input matInput type="number" [formField]="orderForm.total" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Coupon Code</mat-label>
            <input matInput [formField]="orderForm.couponCode" />
          </mat-form-field>
          @if (orderForm.couponCode().disabled()) {
            @for (reason of orderForm.couponCode().disabledReasons(); track reason) {
              <mat-chip class="disabled-reason">{{ reason.message }}</mat-chip>
            }
          }
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header><mat-card-title>hidden()</mat-card-title></mat-card-header>
        <mat-card-content class="section-form">
          <mat-slide-toggle class="toggle-row" [formField]="orderForm.isPublic">Make profile public</mat-slide-toggle>
          @if (!orderForm.publicUrl().hidden()) {
            <mat-form-field>
              <mat-label>Public URL</mat-label>
              <input matInput [formField]="orderForm.publicUrl" />
            </mat-form-field>
          }
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header><mat-card-title>readonly()</mat-card-title></mat-card-header>
        <mat-card-content class="section-form">
          <mat-form-field>
            <mat-label>System ID (always readonly)</mat-label>
            <input matInput [formField]="orderForm.systemId" />
          </mat-form-field>
          <mat-slide-toggle class="toggle-row" [formField]="orderForm.isLocked">Lock notes</mat-slide-toggle>
          <mat-form-field>
            <mat-label>Notes</mat-label>
            <input matInput [formField]="orderForm.notes" />
          </mat-form-field>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class ConditionalFields {
  orderModel = signal<OrderData>({
    total: 25, couponCode: '', isPublic: false, publicUrl: '',
    systemId: 'SYS-00042', isLocked: false, notes: 'Editable until locked',
  });

  orderForm = form(this.orderModel, (p) => {
    disabled(p.couponCode, ({ valueOf }) =>
      valueOf(p.total) < 50 ? 'Order must be $50 or more to use a coupon' : false,
    );
    hidden(p.publicUrl, ({ valueOf }) => !valueOf(p.isPublic));
    required(p.publicUrl, { message: 'Public URL is required', when: ({ valueOf }) => valueOf(p.isPublic) });
    readonly(p.systemId);
    readonly(p.notes, ({ valueOf }) => valueOf(p.isLocked));
  });
}
