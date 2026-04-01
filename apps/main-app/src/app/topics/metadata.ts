/**
 * Topic 14 — Metadata: `metadata(path, key, factory)` attaches arbitrary typed data; `createMetadataKey()` defines keys.
 * Built-in validators also publish constraint signals (`required()`, `min`, `max`, lengths) for hints and generic UI.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, min, max, minLength, maxLength, metadata, createMetadataKey } from '@angular/forms/signals';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

export const HELP_TEXT = createMetadataKey<string>();

interface ProductData { name: string; price: number; description: string; }

@Component({
  selector: 'df-metadata',
  imports: [FormField, MatFormField, MatLabel, MatInput, MatHint, MatCard, MatCardContent, MatCardHeader, MatCardTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h2 { margin: 0 0 4px; }
    .hint { color: #666; font-size: 14px; margin: 0 0 8px; }
    .topic-remark { color: #555; font-size: 14px; line-height: 1.55; margin: 0 0 24px; max-width: 640px; }
    .topic-remark code { font-size: 13px; }
    form { display: flex; flex-direction: column; gap: 0; max-width: 460px; }
    mat-hint { font-style: italic; }
    .constraint-info { font-size: 12px; color: #888; margin-bottom: 8px; }
    .state-panel { margin-top: 24px; }
    table { border-collapse: collapse; width: 100%; font-size: 13px; margin-top: 8px; }
    th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #e0e0e0; }
    th { color: #666; font-weight: 500; }
    .note { margin-top: 16px; }
  `,
  template: `
    <h2>14. Metadata</h2>
    <p class="hint">Validators auto-populate metadata. Use <code>createMetadataKey()</code> for custom metadata like help text.</p>
    <p class="topic-remark">
      Read metadata in the template with <code>field.metadata(KEY)</code>—here <code>HELP_TEXT</code> drives <code>mat-hint</code>.
      Constraint signals (e.g. <code>min?.()</code>) come from the validators you registered, so a generic “field inspector” or design-system label can stay declarative without duplicating numbers from the schema.
    </p>

    <form novalidate>
      <mat-form-field>
        <mat-label>Product Name</mat-label>
        <input matInput [formField]="productForm.name" />
        @if (productForm.name().metadata(HELP_TEXT); as helpText) {
          <mat-hint>{{ helpText }}</mat-hint>
        }
      </mat-form-field>
      <div class="constraint-info">Required: {{ productForm.name().required() }}</div>

      <mat-form-field>
        <mat-label>Price</mat-label>
        <input matInput type="number" [formField]="productForm.price" />
        @if (productForm.price().metadata(HELP_TEXT); as helpText) {
          <mat-hint>{{ helpText }}</mat-hint>
        }
      </mat-form-field>
      <div class="constraint-info">Min: {{ productForm.price().min?.() }} | Max: {{ productForm.price().max?.() }}</div>

      <mat-form-field>
        <mat-label>Description</mat-label>
        <textarea matInput [formField]="productForm.description" rows="2"></textarea>
        @if (productForm.description().metadata(HELP_TEXT); as helpText) {
          <mat-hint>{{ helpText }}</mat-hint>
        }
      </mat-form-field>
      <div class="constraint-info">Min length: {{ productForm.description().minLength?.() }} | Max length: {{ productForm.description().maxLength?.() }}</div>
    </form>

    <mat-card class="state-panel" appearance="outlined">
      <mat-card-header><mat-card-title>Built-in metadata (auto-populated by validators)</mat-card-title></mat-card-header>
      <mat-card-content>
        <table>
          <thead><tr><th>Field</th><th>required</th><th>min</th><th>max</th><th>minLength</th><th>maxLength</th></tr></thead>
          <tbody>
            <tr>
              <th>name</th>
              <td>{{ productForm.name().required() }}</td>
              <td>-</td><td>-</td><td>-</td><td>-</td>
            </tr>
            <tr>
              <th>price</th>
              <td>{{ productForm.price().required() }}</td>
              <td>{{ productForm.price().min?.() }}</td>
              <td>{{ productForm.price().max?.() }}</td>
              <td>-</td><td>-</td>
            </tr>
            <tr>
              <th>description</th>
              <td>-</td><td>-</td><td>-</td>
              <td>{{ productForm.description().minLength?.() }}</td>
              <td>{{ productForm.description().maxLength?.() }}</td>
            </tr>
          </tbody>
        </table>
      </mat-card-content>
    </mat-card>

    <mat-card class="note" appearance="outlined">
      <mat-card-content>
        <code>HELP_TEXT</code> is a custom metadata key created with <code>createMetadataKey&lt;string&gt;()</code>.
        Built-in metadata like <code>required()</code>, <code>min()</code>, <code>max()</code> are auto-populated by validators.
      </mat-card-content>
    </mat-card>
  `,
})
export class MetadataTopic {
  readonly HELP_TEXT = HELP_TEXT;

  productModel = signal<ProductData>({ name: '', price: 0, description: '' });

  productForm = form(this.productModel, (p) => {
    required(p.name, { message: 'Product name is required' });
    metadata(p.name, HELP_TEXT, () => 'Enter a unique product identifier');
    required(p.price, { message: 'Price is required' });
    min(p.price, 0.01, { message: 'Price must be positive' });
    max(p.price, 99999, { message: 'Price too high' });
    metadata(p.price, HELP_TEXT, () => 'Price in USD (0.01 - 99,999)');
    minLength(p.description, 10, { message: 'Description too short' });
    maxLength(p.description, 500, { message: 'Description too long' });
    metadata(p.description, HELP_TEXT, () => 'Between 10 and 500 characters');
  });
}
