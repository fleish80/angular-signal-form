/**
 * Topic 9 — Arrays & collections: model includes an array of row objects; template uses @for with a stable id.
 * `applyEach(p.items, schema)` runs the same validators for every row when the array grows or shrinks.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField, required, min, applyEach } from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

interface OrderItem {
  /** Stable row key for `@for` tracking (not edited in the form). */
  id: string;
  product: string;
  quantity: number;
}
interface Order {
  title: string;
  items: OrderItem[];
}

function newOrderItem(): OrderItem {
  return { id: crypto.randomUUID(), product: '', quantity: 1 };
}

@Component({
  selector: 'df-arrays-and-collections',
  imports: [
    FormField,
    JsonPipe,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatButton,
    MatIconButton,
    MatIcon,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h2 { margin: 0 0 4px; }
    .hint { color: #666; font-size: 14px; margin: 0 0 8px; }
    .topic-remark { color: #555; font-size: 14px; line-height: 1.55; margin: 0 0 24px; max-width: 640px; }
    .topic-remark code { font-size: 13px; }
    form { display: flex; flex-direction: column; gap: 8px; max-width: 540px; }
    .item-row { display: flex; gap: 8px; align-items: flex-start; padding: 12px; background: #fafafa; border-radius: 8px; }
    .item-row .field-stack { flex: 1; min-width: 0; }
    .item-row .qty-field { max-width: 100px; }
    .field-stack { display: flex; flex-direction: column; align-items: stretch; }
    .field-stack mat-form-field { width: 100%; }
    .field-stack .field-errors {
      margin-top: 4px;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .model-output { margin-top: 24px; }
    pre { margin: 0; white-space: pre-wrap; font-size: 13px; }
  `,
  template: `
    <h2>9. Arrays & Collections</h2>
    <p class="hint">Array models with <code>applyEach()</code> to validate each item. Add/remove items dynamically.</p>
    <p class="topic-remark">
      Index the field tree with the loop index: <code>orderForm.items[i]</code> stays aligned with <code>orderModel().items[i]</code> as long as you track rows by a stable <code>id</code> for DOM reconciliation.
      Adding or removing rows updates the signal; the form rebinds paths and <code>applyEach</code> applies the inner rules to each element—no copy-pasted validator blocks per index.
    </p>

    <form novalidate>
      <mat-form-field>
        <mat-label>Order Title</mat-label>
        <input matInput [formField]="orderForm.title" />
      </mat-form-field>

      @for (row of orderModel().items; track row.id; let i = $index) {
        @let item = orderForm.items[i];
        <div class="item-row">
          <div class="field-stack">
            <mat-form-field>
              <mat-label>Product</mat-label>
              <input matInput [formField]="item.product" />
            </mat-form-field>
            @if (item.product().touched() && item.product().invalid()) {
              <div class="field-errors" role="alert">
                @for (err of item.product().errors(); track err) {
                  <mat-error>{{ err.message }}</mat-error>
                }
              </div>
            }
          </div>

          <mat-form-field class="qty-field">
            <mat-label>Qty</mat-label>
            <input matInput type="number" [formField]="item.quantity" />
          </mat-form-field>

          <button mat-icon-button color="warn" type="button" (click)="removeItem(row.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      }

      <button mat-stroked-button type="button" (click)="addItem()">
        <mat-icon>add</mat-icon>
        Add Item
      </button>
    </form>

    <mat-card class="model-output" appearance="outlined">
      <mat-card-header><mat-card-title>Model value (live)</mat-card-title></mat-card-header>
      <mat-card-content><pre>{{ orderModel() | json }}</pre></mat-card-content>
    </mat-card>
  `,
})
export class ArraysAndCollections {
  orderModel = signal<Order>({ title: '', items: [newOrderItem()] });

  orderForm = form(this.orderModel, (p) => {
    required(p.title, { message: 'Order title is required' });
    applyEach(p.items, (item) => {
      required(item.product, { message: 'Product name is required' });
      min(item.quantity, 1, { message: 'Quantity must be at least 1' });
    });
  });

  addItem() {
    this.orderModel.update((m) => ({ ...m, items: [...m.items, newOrderItem()] }));
  }

  removeItem(id: string) {
    this.orderModel.update((m) => ({ ...m, items: m.items.filter((item) => item.id !== id) }));
  }
}
