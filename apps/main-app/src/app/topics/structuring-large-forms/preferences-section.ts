/**
 * Preferences slice: boolean field via a tiny `FormCheckboxControl` (same contract as topic 11's toggle).
 */
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormField, type FieldTree, type FormCheckboxControl } from '@angular/forms/signals';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import type { Preferences } from './profile-model';

@Component({
  selector: 'df-marketing-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: inline-block; }
    .row { display: flex; align-items: center; gap: 10px; }
    .toggle {
      width: 44px; height: 24px; border-radius: 12px; background: #ccc; position: relative; cursor: pointer; transition: background 0.2s;
    }
    .toggle.on { background: var(--mat-sys-primary); }
    .toggle.disabled { opacity: 0.5; cursor: not-allowed; }
    .knob {
      width: 20px; height: 20px; border-radius: 50%; background: white; position: absolute; top: 2px; left: 2px;
      transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .toggle.on .knob { left: 22px; }
    .label { font-size: 14px; }
  `,
  template: `
    <div class="row">
      <div class="toggle" role="switch" tabindex="0"
           [attr.aria-checked]="checked()" [class.on]="checked()" [class.disabled]="disabled()"
           (click)="toggle()" (keydown.space)="$event.preventDefault(); toggle()" (keydown.enter)="toggle()">
        <div class="knob"></div>
      </div>
      <span class="label" id="marketing-label">Receive marketing emails</span>
    </div>
  `,
})
export class MarketingToggle implements FormCheckboxControl {
  checked = model(false);
  disabled = input(false);

  toggle() {
    if (!this.disabled()) this.checked.update((v) => !v);
  }
}

@Component({
  selector: 'df-preferences-section',
  imports: [FormField, MarketingToggle, MatCard, MatCardContent, MatCardHeader, MatCardTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .pad { padding-top: 8px; }
  `,
  template: `
    <mat-card appearance="outlined">
      <mat-card-header><mat-card-title>Preferences</mat-card-title></mat-card-header>
      <mat-card-content class="pad">
        <df-marketing-toggle [formField]="tree().marketingOptIn" />
      </mat-card-content>
    </mat-card>
  `,
})
export class PreferencesSectionComponent {
  readonly tree = input.required<FieldTree<Preferences>>();
}
