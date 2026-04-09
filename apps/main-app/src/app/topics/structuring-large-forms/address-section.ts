/**
 * Shipping address slice: same composition idea — schema and fields stay co-located with this subtree only.
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormField, type FieldTree } from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import type { Address } from './profile-model';

@Component({
  selector: 'df-address-section',
  imports: [FormField, MatFormField, MatLabel, MatInput, MatError, MatCard, MatCardContent, MatCardHeader, MatCardTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .field-stack { display: flex; flex-direction: column; gap: 4px; }
    .field-stack mat-form-field { width: 100%; }
    .field-errors { margin-top: 4px; padding: 0 16px; display: flex; flex-direction: column; gap: 2px; }
  `,
  template: `
    <mat-card appearance="outlined">
      <mat-card-header><mat-card-title>Shipping address</mat-card-title></mat-card-header>
      <mat-card-content class="field-stack">
        <mat-form-field>
          <mat-label>Street</mat-label>
          <input matInput [formField]="tree().street" />
        </mat-form-field>
        @if (tree().street().touched() && tree().street().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of tree().street().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }

        <mat-form-field>
          <mat-label>City</mat-label>
          <input matInput [formField]="tree().city" />
        </mat-form-field>
        @if (tree().city().touched() && tree().city().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of tree().city().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }

        <mat-form-field>
          <mat-label>State</mat-label>
          <input matInput [formField]="tree().state" />
        </mat-form-field>
        @if (tree().state().touched() && tree().state().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of tree().state().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }

        <mat-form-field>
          <mat-label>ZIP</mat-label>
          <input matInput [formField]="tree().zip" />
        </mat-form-field>
        @if (tree().zip().touched() && tree().zip().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of tree().zip().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
})
export class AddressSectionComponent {
  readonly tree = input.required<FieldTree<Address>>();
}
