/**
 * Topic 15 — Zod / Standard Schema: `validateStandardSchema(tree, zodSchema)` maps Zod failures onto Signal Form paths.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField, validateStandardSchema } from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardContent } from '@angular/material/card';
import * as z from 'zod';

interface UserData { email: string; age: number; website: string; }

const userSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  age: z.number().min(18, 'Must be at least 18').max(120, 'Invalid age'),
  website: z.url({ message: 'Must be a valid URL' }),
});

@Component({
  selector: 'df-zod-integration',
  imports: [
    FormField,
    JsonPipe,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatCard,
    MatCardContent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h2 { margin: 0 0 4px; }
    .hint { color: #666; font-size: 14px; margin: 0 0 8px; }
    .topic-remark { color: #555; font-size: 14px; line-height: 1.55; margin: 0 0 24px; max-width: 640px; }
    .topic-remark code { font-size: 13px; }
    .sections { display: flex; flex-direction: column; gap: 16px; max-width: 460px; }
    .section-form { display: flex; flex-direction: column; gap: 16px; }
    .field-stack { display: flex; flex-direction: column; align-items: stretch; }
    .field-stack mat-form-field { width: 100%; }
    .field-stack .field-errors {
      margin-top: 4px;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .model-output { margin-top: 8px; font-size: 12px; }
    pre { margin: 0; white-space: pre-wrap; }
  `,
  template: `
    <h2>15. Zod Integration</h2>
    <p class="hint"><code>validateStandardSchema()</code> bridges Zod (or any Standard Schema library) with Signal Forms.</p>
    <p class="topic-remark">
      Define your schema once with Zod and <code>validateStandardSchema()</code> maps failures onto the matching form paths.
      Any library implementing the <a href="https://github.com/standard-schema/standard-schema" target="_blank">Standard Schema</a>
      spec (Valibot, ArkType) works the same way.
    </p>

    <div class="sections">
      <mat-card appearance="outlined">
        <mat-card-content>
          <form novalidate class="section-form">
            <div class="field-stack">
              <mat-form-field>
                <mat-label>Email</mat-label>
                <input matInput type="email" [formField]="userForm.email" />
              </mat-form-field>
              @if (userForm.email().touched() && userForm.email().invalid()) {
                <div class="field-errors" role="alert">
                  @for (err of userForm.email().errors(); track err) {
                    <mat-error>{{ err.message }}</mat-error>
                  }
                </div>
              }
            </div>

            <div class="field-stack">
              <mat-form-field>
                <mat-label>Age</mat-label>
                <input matInput type="number" [formField]="userForm.age" />
              </mat-form-field>
              @if (userForm.age().touched() && userForm.age().invalid()) {
                <div class="field-errors" role="alert">
                  @for (err of userForm.age().errors(); track err) {
                    <mat-error>{{ err.message }}</mat-error>
                  }
                </div>
              }
            </div>

            <div class="field-stack">
              <mat-form-field>
                <mat-label>Website</mat-label>
                <input matInput type="url" [formField]="userForm.website" placeholder="https://..." />
              </mat-form-field>
              @if (userForm.website().touched() && userForm.website().invalid()) {
                <div class="field-errors" role="alert">
                  @for (err of userForm.website().errors(); track err) {
                    <mat-error>{{ err.message }}</mat-error>
                  }
                </div>
              }
            </div>
          </form>
          <div class="model-output"><pre>{{ userModel() | json }}</pre></div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class ZodIntegration {
  userModel = signal<UserData>({ email: '', age: 0, website: '' });
  userForm = form(this.userModel, (p) => { validateStandardSchema(p, userSchema); });
}
