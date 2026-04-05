/**
 * Topic 17 — applyWhen: conditionally apply a schema to a path using `valueOf()` to read
 * other fields reactively. Unlike `applyWhenValue`, the condition depends on *sibling* fields.
 */
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  form, FormField, required, minLength, pattern,
  applyWhen,
} from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatChip } from '@angular/material/chips';

interface ShippingAddress {
  street: string;
  city: string;
  zipCode: string;
}

interface OrderData {
  product: string;
  needsShipping: boolean;
  shipping: ShippingAddress;
  isGift: boolean;
  giftMessage: string;
}

@Component({
  selector: 'df-apply-when',
  imports: [
    FormField,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
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
    .field-stack { display: flex; flex-direction: column; align-items: stretch; }
    .field-stack mat-form-field { width: 100%; }
    .field-stack .field-errors {
      margin-top: 4px;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .conditional-fields { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; }
    .status-row { margin-top: 8px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  `,
  template: `
    <h2>17. Apply When</h2>
    <p class="hint"><code>applyWhen(path, logicFn, schema)</code> — gate a schema on <em>other</em> fields via <code>valueOf()</code>.</p>
    <p class="topic-remark">
      Where <code>applyWhenValue</code> checks the path's own value, <code>applyWhen</code> uses the
      <code>valueOf()</code> context to read <em>sibling</em> fields reactively.
      Below, the shipping address schema (3 required fields + ZIP pattern) only activates when
      <code>valueOf(p.needsShipping)</code> is true, and the gift-message rules only activate when
      <code>valueOf(p.isGift)</code> is true. Each toggle controls a separate conditional schema block.
    </p>

    <div class="sections">
      <mat-card appearance="outlined">
        <mat-card-content class="section-form">
          <div class="field-stack">
            <mat-form-field>
              <mat-label>Product</mat-label>
              <input matInput [formField]="orderForm.product" />
            </mat-form-field>
            @if (orderForm.product().touched() && orderForm.product().invalid()) {
              <div class="field-errors" role="alert">
                @for (err of orderForm.product().errors(); track err) {
                  <mat-error>{{ err.message }}</mat-error>
                }
              </div>
            }
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header><mat-card-title>Shipping (nested subtree)</mat-card-title></mat-card-header>
        <mat-card-content class="section-form">
          <mat-slide-toggle class="toggle-row" [formField]="orderForm.needsShipping">Ship to me</mat-slide-toggle>

          @if (needsShipping()) {
            <div class="conditional-fields">
              <div class="field-stack">
                <mat-form-field>
                  <mat-label>Street Address</mat-label>
                  <input matInput [formField]="orderForm.shipping.street" />
                </mat-form-field>
                @if (orderForm.shipping.street().touched() && orderForm.shipping.street().invalid()) {
                  <div class="field-errors" role="alert">
                    @for (err of orderForm.shipping.street().errors(); track err) {
                      <mat-error>{{ err.message }}</mat-error>
                    }
                  </div>
                }
              </div>

              <div class="field-stack">
                <mat-form-field>
                  <mat-label>City</mat-label>
                  <input matInput [formField]="orderForm.shipping.city" />
                </mat-form-field>
                @if (orderForm.shipping.city().touched() && orderForm.shipping.city().invalid()) {
                  <div class="field-errors" role="alert">
                    @for (err of orderForm.shipping.city().errors(); track err) {
                      <mat-error>{{ err.message }}</mat-error>
                    }
                  </div>
                }
              </div>

              <div class="field-stack">
                <mat-form-field>
                  <mat-label>ZIP Code</mat-label>
                  <input matInput [formField]="orderForm.shipping.zipCode" placeholder="e.g. 90210" />
                </mat-form-field>
                @if (orderForm.shipping.zipCode().touched() && orderForm.shipping.zipCode().invalid()) {
                  <div class="field-errors" role="alert">
                    @for (err of orderForm.shipping.zipCode().errors(); track err) {
                      <mat-error>{{ err.message }}</mat-error>
                    }
                  </div>
                }
              </div>
            </div>
          }

          @if (needsShipping()) {
            <mat-chip class="status-row">Shipping schema active — 4 rules on subtree</mat-chip>
          }
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header><mat-card-title>Gift message (leaf field)</mat-card-title></mat-card-header>
        <mat-card-content class="section-form">
          <mat-slide-toggle class="toggle-row" [formField]="orderForm.isGift">Send as gift</mat-slide-toggle>

          @if (isGift()) {
            <div class="conditional-fields">
              <div class="field-stack">
                <mat-form-field>
                  <mat-label>Gift Message</mat-label>
                  <textarea matInput [formField]="orderForm.giftMessage" rows="2"></textarea>
                </mat-form-field>
                @if (orderForm.giftMessage().touched() && orderForm.giftMessage().invalid()) {
                  <div class="field-errors" role="alert">
                    @for (err of orderForm.giftMessage().errors(); track err) {
                      <mat-error>{{ err.message }}</mat-error>
                    }
                  </div>
                }
              </div>
            </div>
          }

          @if (isGift()) {
            <mat-chip class="status-row">Gift rules active — 2 rules on leaf field</mat-chip>
          }
        </mat-card-content>
      </mat-card>

      <div class="status-row">
        <mat-chip [highlighted]="orderForm().valid()">
          Form is {{ orderForm().valid() ? 'valid' : 'invalid' }}
        </mat-chip>
      </div>
    </div>
  `,
})
export class ApplyWhenTopic {
  model = signal<OrderData>({
    product: '',
    needsShipping: false,
    shipping: { street: '', city: '', zipCode: '' },
    isGift: false,
    giftMessage: '',
  });

  orderForm = form(this.model, (p) => {
    required(p.product, { message: 'Product name is required' });

    applyWhen(p.shipping, ({ valueOf }) => valueOf(p.needsShipping), (shipping) => {
      required(shipping.street, { message: 'Street address is required' });
      required(shipping.city, { message: 'City is required' });
      required(shipping.zipCode, { message: 'ZIP code is required' });
      pattern(shipping.zipCode, /^\d{5}(-\d{4})?$/, { message: 'Enter a valid ZIP (e.g. 90210)' });
    });

    applyWhen(p.giftMessage, ({ valueOf }) => valueOf(p.isGift), (path) => {
      required(path, { message: 'Please include a gift message' });
      minLength(path, 10, { message: 'Write at least 10 characters' });
    });
  });

  needsShipping = computed(() => this.orderForm.needsShipping().value());
  isGift = computed(() => this.orderForm.isGift().value());
}
