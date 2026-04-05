/**
 * Topic 18 — apply() + schema(): create a reusable Schema object with `schema()` and attach it
 * to multiple subtrees with `apply()`. Unlike a plain function call, `apply()` is the explicit
 * structural primitive that pairs with `applyEach`, `applyWhen`, and `applyWhenValue`.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  form, FormField, required, pattern,
  schema, apply,
} from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';

interface Address {
  street: string;
  city: string;
  zipCode: string;
}

interface CheckoutData {
  billingAddress: Address;
  shippingAddress: Address;
}

const addressSchema = schema<Address>((addr) => {
  required(addr.street, { message: 'Street is required' });
  required(addr.city, { message: 'City is required' });
  required(addr.zipCode, { message: 'ZIP code is required' });
  pattern(addr.zipCode, /^\d{5}(-\d{4})?$/, { message: 'Enter a valid ZIP (e.g. 90210)' });
});

@Component({
  selector: 'df-apply-schema',
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
    .field-stack { display: flex; flex-direction: column; align-items: stretch; }
    .field-stack mat-form-field { width: 100%; }
    .field-stack .field-errors {
      margin-top: 4px;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .status-row { margin-top: 8px; display: flex; gap: 8px; align-items: center; }
  `,
  template: `
    <h2>18. Apply Schema</h2>
    <p class="hint"><code>schema()</code> creates a reusable Schema object; <code>apply()</code> attaches it to a path.</p>
    <p class="topic-remark">
      Topic 10 composes schemas via plain function calls.
      <code>apply(path, schema)</code> is the explicit structural primitive—it pairs with
      <code>applyEach</code>, <code>applyWhen</code>, and <code>applyWhenValue</code> to form a consistent API.
      Here one <code>addressSchema</code> created with <code>schema()</code> is applied to both billing and
      shipping subtrees. Each subtree is validated independently with the same set of rules.
    </p>

    <div class="sections">
      <mat-card appearance="outlined">
        <mat-card-header><mat-card-title>Billing Address</mat-card-title></mat-card-header>
        <mat-card-content class="section-form">
          <div class="field-stack">
            <mat-form-field>
              <mat-label>Street</mat-label>
              <input matInput [formField]="checkoutForm.billingAddress.street" />
            </mat-form-field>
            @if (checkoutForm.billingAddress.street().touched() && checkoutForm.billingAddress.street().invalid()) {
              <div class="field-errors" role="alert">
                @for (err of checkoutForm.billingAddress.street().errors(); track err) {
                  <mat-error>{{ err.message }}</mat-error>
                }
              </div>
            }
          </div>

          <div class="field-stack">
            <mat-form-field>
              <mat-label>City</mat-label>
              <input matInput [formField]="checkoutForm.billingAddress.city" />
            </mat-form-field>
            @if (checkoutForm.billingAddress.city().touched() && checkoutForm.billingAddress.city().invalid()) {
              <div class="field-errors" role="alert">
                @for (err of checkoutForm.billingAddress.city().errors(); track err) {
                  <mat-error>{{ err.message }}</mat-error>
                }
              </div>
            }
          </div>

          <div class="field-stack">
            <mat-form-field>
              <mat-label>ZIP Code</mat-label>
              <input matInput [formField]="checkoutForm.billingAddress.zipCode" placeholder="e.g. 90210" />
            </mat-form-field>
            @if (checkoutForm.billingAddress.zipCode().touched() && checkoutForm.billingAddress.zipCode().invalid()) {
              <div class="field-errors" role="alert">
                @for (err of checkoutForm.billingAddress.zipCode().errors(); track err) {
                  <mat-error>{{ err.message }}</mat-error>
                }
              </div>
            }
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header><mat-card-title>Shipping Address</mat-card-title></mat-card-header>
        <mat-card-content class="section-form">
          <div class="field-stack">
            <mat-form-field>
              <mat-label>Street</mat-label>
              <input matInput [formField]="checkoutForm.shippingAddress.street" />
            </mat-form-field>
            @if (checkoutForm.shippingAddress.street().touched() && checkoutForm.shippingAddress.street().invalid()) {
              <div class="field-errors" role="alert">
                @for (err of checkoutForm.shippingAddress.street().errors(); track err) {
                  <mat-error>{{ err.message }}</mat-error>
                }
              </div>
            }
          </div>

          <div class="field-stack">
            <mat-form-field>
              <mat-label>City</mat-label>
              <input matInput [formField]="checkoutForm.shippingAddress.city" />
            </mat-form-field>
            @if (checkoutForm.shippingAddress.city().touched() && checkoutForm.shippingAddress.city().invalid()) {
              <div class="field-errors" role="alert">
                @for (err of checkoutForm.shippingAddress.city().errors(); track err) {
                  <mat-error>{{ err.message }}</mat-error>
                }
              </div>
            }
          </div>

          <div class="field-stack">
            <mat-form-field>
              <mat-label>ZIP Code</mat-label>
              <input matInput [formField]="checkoutForm.shippingAddress.zipCode" placeholder="e.g. 90210" />
            </mat-form-field>
            @if (checkoutForm.shippingAddress.zipCode().touched() && checkoutForm.shippingAddress.zipCode().invalid()) {
              <div class="field-errors" role="alert">
                @for (err of checkoutForm.shippingAddress.zipCode().errors(); track err) {
                  <mat-error>{{ err.message }}</mat-error>
                }
              </div>
            }
          </div>
        </mat-card-content>
      </mat-card>

      <div class="status-row">
        <mat-chip [highlighted]="checkoutForm().valid()">
          Form is {{ checkoutForm().valid() ? 'valid' : 'invalid' }}
        </mat-chip>
        <mat-chip>Same addressSchema applied to both subtrees</mat-chip>
      </div>
    </div>
  `,
})
export class ApplySchemaTopic {
  model = signal<CheckoutData>({
    billingAddress: { street: '', city: '', zipCode: '' },
    shippingAddress: { street: '', city: '', zipCode: '' },
  });

  checkoutForm = form(this.model, (p) => {
    apply(p.billingAddress, addressSchema);
    apply(p.shippingAddress, addressSchema);
  });
}
