/**
 * Topic 2 — Form Model: nested objects on one signal, programmatic updates via field paths or model.set,
 * and computed() that read through the form API so UI and validation stay aligned.
 */
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField } from '@angular/forms/signals';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

interface UserProfile {
  name: string;
  email: string;
  address: { street: string; city: string; zip: string };
}

@Component({
  selector: 'df-form-model',
  imports: [
    FormField,
    JsonPipe,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatDivider,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h2 { margin: 0 0 4px; }
    .hint { color: #666; font-size: 14px; margin: 0 0 8px; }
    .topic-remark { color: #555; font-size: 14px; line-height: 1.55; margin: 0 0 24px; max-width: 640px; }
    .topic-remark code { font-size: 13px; }
    form { display: flex; flex-direction: column; gap: 4px; max-width: 460px; }
    .address-section { margin: 8px 0; font-weight: 500; font-size: 14px; color: #666; }
    .actions { display: flex; gap: 8px; margin-top: 8px; }
    .model-output { margin-top: 24px; }
    pre { margin: 0; white-space: pre-wrap; font-size: 13px; }
    .derived { margin-top: 8px; font-size: 13px; color: #666; }
  `,
  template: `
    <h2>2. Form Model</h2>
    <p class="hint">Model-first: the signal is the source of truth. Nested objects, programmatic updates, derived state.</p>
    <p class="topic-remark">
      Dot paths like <code>profileForm.address.city</code> mirror the interface shape—no parallel “form object” to keep in sync.
      <strong>Load Sample Data</strong> replaces the whole model; <strong>Clear Name</strong> uses <code>profileForm.name().value.set('')</code>
      to show field-level writes. <code>nameLength</code> is a <code>computed</code> over <code>profileForm.name().value()</code> so derived UI stays reactive.
    </p>

    <form>
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput [formField]="profileForm.name" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Email</mat-label>
        <input matInput type="email" [formField]="profileForm.email" />
      </mat-form-field>

      <mat-divider />
      <p class="address-section">Address</p>

      <mat-form-field>
        <mat-label>Street</mat-label>
        <input matInput [formField]="profileForm.address.street" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>City</mat-label>
        <input matInput [formField]="profileForm.address.city" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Zip</mat-label>
        <input matInput [formField]="profileForm.address.zip" />
      </mat-form-field>

      <div class="actions">
        <button mat-flat-button color="primary" type="button" (click)="loadSample()">Load Sample Data</button>
        <button mat-stroked-button type="button" (click)="clearName()">Clear Name</button>
        <button mat-stroked-button type="button" (click)="reset()">Reset</button>
      </div>
    </form>

    <mat-card class="model-output" appearance="outlined">
      <mat-card-header><mat-card-title>Model value (live)</mat-card-title></mat-card-header>
      <mat-card-content>
        <pre>{{ profileModel() | json }}</pre>
        <p class="derived">Name length: {{ nameLength() }}</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class FormModelTopic {
  private readonly emptyProfile: UserProfile = {
    name: '', email: '', address: { street: '', city: '', zip: '' },
  };

  profileModel = signal<UserProfile>({ ...this.emptyProfile });
  profileForm = form(this.profileModel);
  nameLength = computed(() => this.profileForm.name().value().length);

  loadSample() {
    this.profileModel.set({
      name: 'Alice Johnson', email: 'alice@example.com',
      address: { street: '123 Angular Way', city: 'Mountain View', zip: '94043' },
    });
  }

  clearName() { this.profileForm.name().value.set(''); }
  reset() { this.profileModel.set({ ...this.emptyProfile }); }
}
