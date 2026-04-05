/**
 * Topic 16 — applyWhenValue: conditionally apply an entire schema (group of validators)
 * based on the form's own value. Inspired by the Brian Treese video on Signal Forms.
 */
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  form, FormField, required, email, minLength,
  applyWhenValue,
} from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatChip } from '@angular/material/chips';

interface RegistrationData {
  isBusiness: boolean;
  name: string;
  email: string;
  companyName: string;
  taxId: string;
  website: string;
}

@Component({
  selector: 'df-apply-when-value',
  imports: [
    FormField,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatCard,
    MatCardContent,
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
    .status-row { margin-top: 8px; display: flex; gap: 8px; align-items: center; }
  `,
  template: `
    <h2>16. Apply When Value</h2>
    <p class="hint"><code>applyWhenValue(path, predicate, schema)</code> — gate a group of rules on the path's own value.</p>
    <p class="topic-remark">
      Instead of adding <code>when:</code> to each individual validator, <code>applyWhenValue</code> conditionally
      applies an <em>entire schema</em> based on the value at the given path.
      Here the predicate checks <code>isBusiness</code> on the root model—when true, four extra validators
      (company name required, tax ID required + min length, website required) activate as one block.
      Toggle "Business account" to see the schema switch on and off.
    </p>

    <div class="sections">
      <mat-card appearance="outlined">
        <mat-card-content class="section-form">
          <mat-slide-toggle class="toggle-row" [formField]="regForm.isBusiness">Business account</mat-slide-toggle>

          <div class="field-stack">
            <mat-form-field>
              <mat-label>Name</mat-label>
              <input matInput [formField]="regForm.name" />
            </mat-form-field>
            @if (regForm.name().touched() && regForm.name().invalid()) {
              <div class="field-errors" role="alert">
                @for (err of regForm.name().errors(); track err) {
                  <mat-error>{{ err.message }}</mat-error>
                }
              </div>
            }
          </div>

          <div class="field-stack">
            <mat-form-field>
              <mat-label>Email</mat-label>
              <input matInput type="email" [formField]="regForm.email" />
            </mat-form-field>
            @if (regForm.email().touched() && regForm.email().invalid()) {
              <div class="field-errors" role="alert">
                @for (err of regForm.email().errors(); track err) {
                  <mat-error>{{ err.message }}</mat-error>
                }
              </div>
            }
          </div>

          @if (isBusiness()) {
            <div class="conditional-fields">
              <div class="field-stack">
                <mat-form-field>
                  <mat-label>Company Name</mat-label>
                  <input matInput [formField]="regForm.companyName" />
                </mat-form-field>
                @if (regForm.companyName().touched() && regForm.companyName().invalid()) {
                  <div class="field-errors" role="alert">
                    @for (err of regForm.companyName().errors(); track err) {
                      <mat-error>{{ err.message }}</mat-error>
                    }
                  </div>
                }
              </div>

              <div class="field-stack">
                <mat-form-field>
                  <mat-label>Tax ID</mat-label>
                  <input matInput [formField]="regForm.taxId" placeholder="e.g. 12-3456789" />
                </mat-form-field>
                @if (regForm.taxId().touched() && regForm.taxId().invalid()) {
                  <div class="field-errors" role="alert">
                    @for (err of regForm.taxId().errors(); track err) {
                      <mat-error>{{ err.message }}</mat-error>
                    }
                  </div>
                }
              </div>

              <div class="field-stack">
                <mat-form-field>
                  <mat-label>Website</mat-label>
                  <input matInput [formField]="regForm.website" placeholder="https://..." />
                </mat-form-field>
                @if (regForm.website().touched() && regForm.website().invalid()) {
                  <div class="field-errors" role="alert">
                    @for (err of regForm.website().errors(); track err) {
                      <mat-error>{{ err.message }}</mat-error>
                    }
                  </div>
                }
              </div>
            </div>
          }

          <div class="status-row">
            <mat-chip [highlighted]="regForm().valid()">
              Form is {{ regForm().valid() ? 'valid' : 'invalid' }}
            </mat-chip>
            @if (isBusiness()) {
              <mat-chip>Business schema active</mat-chip>
            }
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class ApplyWhenValueTopic {
  model = signal<RegistrationData>({
    isBusiness: false,
    name: '',
    email: '',
    companyName: '',
    taxId: '',
    website: '',
  });

  regForm = form(this.model, (p) => {
    required(p.name, { message: 'Name is required' });
    required(p.email, { message: 'Email is required' });
    email(p.email, { message: 'Must be a valid email' });

    applyWhenValue(p, (val) => val.isBusiness, (tree) => {
      required(tree.companyName, { message: 'Company name is required for business accounts' });
      required(tree.taxId, { message: 'Tax ID is required' });
      minLength(tree.taxId, 9, { message: 'Tax ID must be at least 9 characters' });
      required(tree.website, { message: 'Website is required for business accounts' });
    });
  });

  isBusiness = computed(() => this.regForm.isBusiness().value());
}
