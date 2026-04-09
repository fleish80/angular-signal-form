/**
 * Topic 25 — Same structure as Brian Treese's NG-DE example: one profile model, parent composes
 * `buildAccountSection` / `buildAddressSection` / `buildPreferencesSection`, children take only their `FieldTree` slice.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { form, submit } from '@angular/forms/signals';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { AccountSectionComponent } from './account-section';
import { AddressSectionComponent } from './address-section';
import { PreferencesSectionComponent } from './preferences-section';
import {
  buildAccountSection,
  buildAddressSection,
  buildPreferencesSection,
  createProfileModel,
  type Profile,
} from './profile-model';

@Component({
  selector: 'df-structuring-large-forms',
  imports: [
    JsonPipe,
    RouterLink,
    MatAnchor,
    MatButton,
    MatIcon,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    AccountSectionComponent,
    AddressSectionComponent,
    PreferencesSectionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h2 { margin: 0 0 4px; }
    .hint { color: #666; font-size: 14px; margin: 0 0 8px; }
    .topic-remark { color: #555; font-size: 14px; line-height: 1.55; margin: 0 0 16px; max-width: 720px; }
    .topic-remark code { font-size: 13px; }
    .video-wrap {
      position: relative; width: 100%; max-width: 720px; aspect-ratio: 16 / 9; margin: 0 0 20px;
      border-radius: 8px; overflow: hidden; background: #111;
    }
    .video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
    form { display: flex; flex-direction: column; gap: 16px; max-width: 520px; }
    .model-output { margin-top: 8px; }
    pre { margin: 0; white-space: pre-wrap; font-size: 13px; }
    .resource { margin-top: 20px; font-size: 13px; color: #666; }
    .resource a { color: var(--mat-sys-primary); }
  `,
  template: `
    <h2>25. Structuring large forms (talk)</h2>
    <p class="hint">
      Runnable version of the profile form from
      <em>Angular Signal Forms: How to structure large forms without losing your mind</em> (Brian Treese).
    </p>
    <p class="topic-remark">
      The parent owns one writable <code>Profile</code> signal and a single <code>form(model, schemaFn)</code> call.
      Each section exports a <code>build*Section</code> that takes a <code>SchemaPathTree</code> for that slice and registers validators there only.
      Child components receive <code>FieldTree</code> slices via <code>input.required()</code> and bind with <code>[formField]</code>; they do not import sibling sections.
    </p>

    <div class="actions">
      <a mat-stroked-button href="https://www.youtube.com/watch?v=hgy3t9mFmuc&amp;t=304s" target="_blank" rel="noopener noreferrer">
        <mat-icon>open_in_new</mat-icon>
        Open talk (t=5m04s)
      </a>
    </div>

    <div class="video-wrap" aria-label="YouTube: structuring large Signal Forms">
      <iframe
        src="https://www.youtube.com/embed/hgy3t9mFmuc?start=304"
        title="Angular Signal Forms: How to structure large forms without losing your mind"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
      ></iframe>
    </div>

    <form (submit)="onSubmit($event)" novalidate>
      <df-account-section [tree]="profileForm.account" />
      <df-address-section [tree]="profileForm.shippingAddress" />
      <df-preferences-section [tree]="profileForm.preferences" />

      <div class="actions">
        <button mat-flat-button color="primary" type="submit">
          <mat-icon>send</mat-icon>
          Submit
        </button>
        <button mat-stroked-button type="button" (click)="reset()">Reset</button>
      </div>
    </form>

    @if (submitted()) {
      <mat-card class="model-output" appearance="outlined">
        <mat-card-header><mat-card-title>Last successful submit (demo)</mat-card-title></mat-card-header>
        <mat-card-content><pre>{{ submitted() | json }}</pre></mat-card-content>
      </mat-card>
    }

    @if (submitError()) {
      <mat-card class="model-output" appearance="outlined">
        <mat-card-content style="color: #c62828;">{{ submitError() }}</mat-card-content>
      </mat-card>
    }

    <mat-card class="model-output" appearance="outlined">
      <mat-card-header><mat-card-title>Model value (live)</mat-card-title></mat-card-header>
      <mat-card-content><pre>{{ profileModel() | json }}</pre></mat-card-content>
    </mat-card>

    <p class="resource">
      Reference repo:
      <a href="https://github.com/brianmtreese/signal-forms-composition-example-after" target="_blank" rel="noopener noreferrer">signal-forms-composition-example-after</a>
      · Related demos:
      <a routerLink="/schema-composition">Schema composition</a>,
      <a routerLink="/apply-schema">Apply schema</a>
    </p>
  `,
})
export class StructuringLargeFormsTopic {
  profileModel = signal<Profile>(createProfileModel());

  profileForm = form(this.profileModel, (s) => {
    buildAccountSection(s.account);
    buildAddressSection(s.shippingAddress);
    buildPreferencesSection(s.preferences);
  });

  submitted = signal<Profile | null>(null);
  submitError = signal<string | null>(null);

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitted.set(null);
    this.submitError.set(null);

    submit(this.profileForm, async () => {
      this.submitted.set({ ...this.profileModel() });
      return undefined;
    });

    if (this.profileForm().invalid()) {
      this.submitError.set('Form is invalid. All fields have been marked as touched.');
    }
  }

  reset() {
    this.profileModel.set(createProfileModel());
    this.profileForm().reset();
    this.submitted.set(null);
    this.submitError.set(null);
  }
}
