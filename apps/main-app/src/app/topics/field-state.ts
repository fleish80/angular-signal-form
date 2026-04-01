/**
 * Topic 6 — Field state: every path exposes signals for touched, dirty, valid, invalid, and errors.
 * The root form() call also exposes aggregate touched/dirty/valid for buttons and summaries.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, email } from '@angular/forms/signals';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

interface ContactData {
  name: string;
  email: string;
}

@Component({
  selector: 'df-field-state',
  imports: [FormField, MatFormField, MatLabel, MatInput, MatCard, MatCardContent, MatCardHeader, MatCardTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h2 { margin: 0 0 4px; }
    .hint { color: #666; font-size: 14px; margin: 0 0 8px; }
    .topic-remark { color: #555; font-size: 14px; line-height: 1.55; margin: 0 0 24px; max-width: 640px; }
    .topic-remark code { font-size: 13px; }
    .layout { display: flex; gap: 32px; flex-wrap: wrap; }
    form { display: flex; flex-direction: column; gap: 4px; max-width: 320px; flex: 1; }
    .state-panel { flex: 1; min-width: 300px; }
    table { border-collapse: collapse; width: 100%; font-size: 13px; margin-top: 8px; }
    th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #e0e0e0; }
    th { color: #666; font-weight: 500; }
    .true { color: #2e7d32; font-weight: 500; }
    .false { color: #999; }
    .form-state { margin-top: 24px; }
  `,
  template: `
    <h2>6. Field State</h2>
    <p class="hint">Every field exposes reactive signals: touched, dirty, valid, invalid, errors. The form itself aggregates them.</p>
    <p class="topic-remark">
      <strong>Touched</strong> usually flips on blur or after submit; <strong>dirty</strong> means the value diverged from the initial snapshot—handy for “unsaved changes” warnings.
      The inspector table is a live readout of the same signals you would use for disabling Save, showing badges, or debugging. Form-level <code>valid</code> is false if any field is invalid.
    </p>

    <div class="layout">
      <form novalidate>
        <mat-form-field>
          <mat-label>Name</mat-label>
          <input matInput [formField]="contactForm.name" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput type="email" [formField]="contactForm.email" />
        </mat-form-field>
      </form>

      <mat-card class="state-panel" appearance="outlined">
        <mat-card-header><mat-card-title>Field State Inspector</mat-card-title></mat-card-header>
        <mat-card-content>
          <table>
            <thead><tr><th></th><th>Name</th><th>Email</th></tr></thead>
            <tbody>
              <tr>
                <th>touched</th>
                <td [class.true]="contactForm.name().touched()" [class.false]="!contactForm.name().touched()">{{ contactForm.name().touched() }}</td>
                <td [class.true]="contactForm.email().touched()" [class.false]="!contactForm.email().touched()">{{ contactForm.email().touched() }}</td>
              </tr>
              <tr>
                <th>dirty</th>
                <td [class.true]="contactForm.name().dirty()" [class.false]="!contactForm.name().dirty()">{{ contactForm.name().dirty() }}</td>
                <td [class.true]="contactForm.email().dirty()" [class.false]="!contactForm.email().dirty()">{{ contactForm.email().dirty() }}</td>
              </tr>
              <tr>
                <th>valid</th>
                <td [class.true]="contactForm.name().valid()" [class.false]="!contactForm.name().valid()">{{ contactForm.name().valid() }}</td>
                <td [class.true]="contactForm.email().valid()" [class.false]="!contactForm.email().valid()">{{ contactForm.email().valid() }}</td>
              </tr>
              <tr>
                <th>errors</th>
                <td>{{ contactForm.name().errors().length }}</td>
                <td>{{ contactForm.email().errors().length }}</td>
              </tr>
            </tbody>
          </table>
        </mat-card-content>
      </mat-card>
    </div>

    <mat-card class="form-state" appearance="outlined">
      <mat-card-header><mat-card-title>Form-level state</mat-card-title></mat-card-header>
      <mat-card-content>
        <table>
          <tbody>
            <tr><th>valid</th><td [class.true]="contactForm().valid()" [class.false]="!contactForm().valid()">{{ contactForm().valid() }}</td></tr>
            <tr><th>touched</th><td [class.true]="contactForm().touched()" [class.false]="!contactForm().touched()">{{ contactForm().touched() }}</td></tr>
            <tr><th>dirty</th><td [class.true]="contactForm().dirty()" [class.false]="!contactForm().dirty()">{{ contactForm().dirty() }}</td></tr>
          </tbody>
        </table>
      </mat-card-content>
    </mat-card>
  `,
})
export class FieldStateTopic {
  contactModel = signal<ContactData>({ name: '', email: '' });

  contactForm = form(this.contactModel, (p) => {
    required(p.name, { message: 'Name is required' });
    required(p.email, { message: 'Email is required' });
    email(p.email, { message: 'Enter a valid email' });
  });
}
