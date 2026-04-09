/**
 * Topic 24 — Compat Bridge: mix Signal Forms and Reactive Forms in the same view.
 * `SignalFormControl` drops a signal-backed field into a `FormGroup`,
 * `compatForm` wraps a `FormControl` inside a signal form model.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField, required, minLength } from '@angular/forms/signals';
import { SignalFormControl, compatForm } from '@angular/forms/signals/compat';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'df-compat-bridge',
  imports: [
    FormField, ReactiveFormsModule, JsonPipe,
    MatFormField, MatLabel, MatInput, MatError,
    MatCard, MatCardContent, MatCardHeader, MatCardTitle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h2 { margin: 0 0 4px; }
    .hint { color: #666; font-size: 14px; margin: 0 0 8px; }
    .topic-remark { color: #555; font-size: 14px; line-height: 1.55; margin: 0 0 24px; max-width: 640px; }
    .topic-remark code { font-size: 13px; }
    form { display: flex; flex-direction: column; gap: 4px; max-width: 460px; }
    .field-stack { display: flex; flex-direction: column; align-items: stretch; }
    .field-stack mat-form-field { width: 100%; }
    .field-stack .field-errors {
      margin-top: 4px;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .model-output { margin-top: 16px; }
    pre { margin: 0; white-space: pre-wrap; font-size: 13px; }
    .demo-block { margin-top: 28px; padding-top: 20px; border-top: 1px solid var(--mat-sys-outline-variant); }
    .demo-block:first-of-type { margin-top: 8px; border-top: none; padding-top: 0; }
    .demo-title { margin: 0 0 12px; font-size: 15px; font-weight: 600; color: var(--mat-sys-on-surface); }
    .label { font-weight: 500; font-size: 13px; color: var(--mat-sys-primary); margin: 8px 0 4px; }
  `,
  template: `
    <h2>24. Compat Bridge</h2>
    <p class="hint">Mix Signal Forms and Reactive Forms in the same view — no full rewrite needed.</p>
    <p class="topic-remark">
      <code>SignalFormControl</code> creates a signal-backed control that extends <code>AbstractControl</code>,
      so it drops into an existing <code>FormGroup</code>. Use <code>[formField]</code> on its
      <code>.fieldTree</code> for signal validation while the parent group keeps working with
      <code>formControlName</code> for other fields.
      Going the other direction, <code>compatForm</code> wraps an existing <code>FormControl</code>
      inside a signal form model—useful when migrating section by section.
    </p>

    <section class="demo-block" aria-labelledby="compat-demo-1-title">
      <h3 class="demo-title" id="compat-demo-1-title">SignalFormControl inside a FormGroup</h3>
      <p class="label">Reactive FormGroup with one signal-backed field (username)</p>
      <form [formGroup]="hybridGroup">
        <div class="field-stack">
          <mat-form-field>
            <mat-label>Username (Signal)</mat-label>
            <input matInput [formField]="usernameControl.fieldTree" />
          </mat-form-field>
          @if (usernameControl.fieldTree().touched() && usernameControl.fieldTree().invalid()) {
            <div class="field-errors" role="alert">
              @for (err of usernameControl.fieldTree().errors(); track err) {
                <mat-error>{{ err.message }}</mat-error>
              }
            </div>
          }
        </div>

        <div class="field-stack">
          <mat-form-field>
            <mat-label>Age (Reactive)</mat-label>
            <input matInput type="number" formControlName="age" />
          </mat-form-field>
        </div>
      </form>

      <mat-card class="model-output" appearance="outlined">
        <mat-card-header><mat-card-title>FormGroup value</mat-card-title></mat-card-header>
        <mat-card-content><pre>{{ hybridGroup.value | json }}</pre></mat-card-content>
      </mat-card>

      <mat-card class="model-output" appearance="outlined">
        <mat-card-header><mat-card-title>FormGroup valid?</mat-card-title></mat-card-header>
        <mat-card-content>
          <pre>group.valid: {{ hybridGroup.valid }}
username (signal) valid: {{ usernameControl.valid }}
age (reactive) valid: {{ hybridGroup.get('age')?.valid }}</pre>
        </mat-card-content>
      </mat-card>
    </section>

    <section class="demo-block" aria-labelledby="compat-demo-2-title">
      <h3 class="demo-title" id="compat-demo-2-title">compatForm wrapping a FormControl</h3>
      <p class="label">Signal form model that wraps a legacy FormControl (city)</p>
      <form novalidate>
        <div class="field-stack">
          <mat-form-field>
            <mat-label>Street (Signal)</mat-label>
            <input matInput [formField]="addressForm.street" />
          </mat-form-field>
          @if (addressForm.street().touched() && addressForm.street().invalid()) {
            <div class="field-errors" role="alert">
              @for (err of addressForm.street().errors(); track err) {
                <mat-error>{{ err.message }}</mat-error>
              }
            </div>
          }
        </div>

        <div class="field-stack">
          <mat-form-field>
            <mat-label>City (FormControl via compatForm)</mat-label>
            <input matInput [formField]="addressForm.city" />
          </mat-form-field>
        </div>
      </form>

      <mat-card class="model-output" appearance="outlined">
        <mat-card-header><mat-card-title>Signal model value</mat-card-title></mat-card-header>
        <mat-card-content><pre>{{ addressModel() | json }}</pre></mat-card-content>
      </mat-card>
    </section>
  `,
})
export class CompatBridge {
  // ─── Tab 1: SignalFormControl inside a Reactive FormGroup ───

  usernameControl = new SignalFormControl('', (p) => {
    required(p, { message: 'Username is required' });
    minLength(p, 3, { message: 'At least 3 characters' });
  });

  hybridGroup = new FormGroup({
    username: this.usernameControl,
    age: new FormControl(25, [Validators.required, Validators.min(1)]),
  });

  // ─── Tab 2: compatForm wrapping a FormControl ───

  cityControl = new FormControl('Springfield', { nonNullable: true });

  addressModel = signal({
    street: '',
    city: this.cityControl,
  });

  addressForm = compatForm(this.addressModel, (p) => {
    required(p.street, { message: 'Street is required' });
  });
}
