/**
 * Account slice UI: receives only `FieldTree<Account>` from the parent — no knowledge of shipping or preferences.
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormField, type FieldTree } from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import type { Account } from './profile-model';

@Component({
  selector: 'df-account-section',
  imports: [FormField, MatFormField, MatLabel, MatInput, MatError, MatCard, MatCardContent, MatCardHeader, MatCardTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .field-stack { display: flex; flex-direction: column; gap: 4px; }
    .field-stack mat-form-field { width: 100%; }
    .field-errors { margin-top: 4px; padding: 0 16px; display: flex; flex-direction: column; gap: 2px; }
  `,
  template: `
    <mat-card appearance="outlined">
      <mat-card-header><mat-card-title>Account information</mat-card-title></mat-card-header>
      <mat-card-content class="field-stack">
        <mat-form-field>
          <mat-label>First name</mat-label>
          <input matInput [formField]="tree().firstName" />
        </mat-form-field>
        @if (tree().firstName().touched() && tree().firstName().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of tree().firstName().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }

        <mat-form-field>
          <mat-label>Last name</mat-label>
          <input matInput [formField]="tree().lastName" />
        </mat-form-field>
        @if (tree().lastName().touched() && tree().lastName().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of tree().lastName().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
})
export class AccountSectionComponent {
  readonly tree = input.required<FieldTree<Account>>();
}
