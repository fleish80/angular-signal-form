/**
 * Landing page: ordered links into each Signal Forms demo topic (talk sequence + extra topics).
 * Card copy summarizes what you will see; open any topic for runnable examples and code-shaped remarks.
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'df-home',
  imports: [RouterLink, MatCard, MatCardContent, MatChip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h1 { font-size: 28px; margin: 0 0 8px; }
    .subtitle { color: #666; font-size: 16px; margin: 0 0 24px; }
    .topics { display: grid; gap: 12px; }
    .topic-card { cursor: pointer; text-decoration: none; color: inherit; }
    .topic-card mat-card { transition: box-shadow 0.15s; }
    .topic-card:hover mat-card { box-shadow: 0 4px 12px rgba(66, 133, 244, 0.15); }
    .card-row { display: flex; align-items: baseline; gap: 12px; }
    .topic-num { font-weight: 600; color: var(--mat-sys-primary); min-width: 24px; }
    .topic-name { font-weight: 500; }
    .topic-desc { color: #666; font-size: 13px; margin-top: 2px; }
    .section-label { margin: 28px 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #999; font-weight: 600; }
    .intro-remark { color: #555; font-size: 15px; line-height: 1.55; max-width: 720px; margin: 16px 0 8px; }
  `,
  template: `
    <h1>Angular Signal Forms</h1>
    <p class="subtitle">Interactive examples of Angular 21's new experimental Signal Forms API</p>
    <mat-chip highlighted>Experimental in v21</mat-chip>

    <p class="intro-remark">
      This app is a guided tour: each topic builds on a <strong>model-first</strong> idea—a writable signal holds your data,
      <code>form(model, schema)</code> exposes bindable field paths and validation, and templates use <code>[formField]</code>
      to connect native or custom controls. Start with Basic Form, then follow the numbers; side nav tooltips restate each topic in one sentence.
    </p>

    <p class="section-label">From the NG-DE Talk</p>
    <div class="topics">
      @for (topic of talkTopics; track topic.path) {
        <a class="topic-card" [routerLink]="topic.path">
          <mat-card appearance="outlined">
            <mat-card-content>
              <div class="card-row">
                <span class="topic-num">{{ topic.num }}</span>
                <div>
                  <div class="topic-name">{{ topic.name }}</div>
                  <div class="topic-desc">{{ topic.desc }}</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </a>
      }
    </div>

    <p class="section-label">Beyond the Talk</p>
    <div class="topics">
      @for (topic of extraTopics; track topic.path) {
        <a class="topic-card" [routerLink]="topic.path">
          <mat-card appearance="outlined">
            <mat-card-content>
              <div class="card-row">
                <span class="topic-num">{{ topic.num }}</span>
                <div>
                  <div class="topic-name">{{ topic.name }}</div>
                  <div class="topic-desc">{{ topic.desc }}</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </a>
      }
    </div>
  `,
})
export class Home {
  talkTopics = [
    { num: '1', path: '/basic-form', name: 'Basic Form', desc: 'Minimal wiring: WritableSignal + form() + [formField] on inputs and textarea.' },
    { num: '2', path: '/form-model', name: 'Form Model', desc: 'Nested objects on one signal, patch fields via paths, reset and derived computed().' },
    { num: '3', path: '/built-in-validators', name: 'Built-in Validators', desc: 'required, email, min, max, minLength, maxLength, pattern—errors as signals.' },
    { num: '4', path: '/custom-validators', name: 'Custom Validators', desc: 'validate() for ad-hoc rules; factor helpers that accept SchemaPath like built-ins.' },
    { num: '5', path: '/cross-field-validation', name: 'Cross-Field Validation', desc: 'valueOf(otherField) inside validate() for confirm-password and dependencies.' },
    { num: '6', path: '/field-state', name: 'Field State', desc: 'touched, dirty, valid, invalid, errors per field; form aggregates the same flags.' },
    { num: '7', path: '/conditional-fields', name: 'Conditional Fields', desc: 'disabled(), hidden(), readonly() driven by reactive predicates and messages.' },
    { num: '8', path: '/form-submission', name: 'Form Submission', desc: 'submit() touches all fields then runs async work only when the tree is valid.' },
    { num: '9', path: '/arrays-and-collections', name: 'Arrays & Collections', desc: 'Model arrays, dynamic rows, applyEach() to validate every item the same way.' },
    { num: '10', path: '/schema-composition', name: 'Schema Composition', desc: 'One contactSchema() reused for owner and list items via applyEach.' },
    { num: '11', path: '/custom-controls', name: 'Custom Controls', desc: 'FormValueControl / FormCheckboxControl integrate custom UIs with [formField].' },
  ];

  extraTopics = [
    { num: '12', path: '/debounce', name: 'Debounce', desc: 'debounce(path, ms) slows writes to the model; blur/submit still flush immediately.' },
    { num: '13', path: '/async-validation', name: 'Async Validation', desc: 'Long-running checks: pending() while a Promise-based rule resolves (demo + patterns).' },
    { num: '14', path: '/metadata', name: 'Metadata', desc: 'metadata() + keys for hints; validators publish min, max, required, lengths as signals.' },
    { num: '15', path: '/zod-integration', name: 'Zod Integration', desc: 'validateStandardSchema() for Zod/Standard Schema; mix with native validate() when needed.' },
    { num: '16', path: '/apply-when-value', name: 'Apply When Value', desc: 'Gate a group of validators on the form\'s own value with one predicate—entire schema activates or deactivates.' },
    { num: '17', path: '/apply-when', name: 'Apply When', desc: 'Use valueOf() to read sibling fields reactively; apply a schema to a nested subtree or leaf on cross-field conditions.' },
    { num: '18', path: '/apply-schema', name: 'Apply Schema', desc: 'schema() creates a reusable Schema object; apply() attaches it to multiple subtrees—same addressSchema for billing and shipping.' },
    { num: '19', path: '/ng-status-classes', name: 'NG status classes', desc: 'provideSignalFormsConfig + NG_STATUS_CLASSES: ng-touched, ng-invalid, ng-pending on [formField] hosts like reactive forms.' },
    { num: '20', path: '/custom-state-classes', name: 'Custom state classes', desc: 'Your own global class map and predicates—e.g. app-invalid only when invalid and touched.' },
    { num: '21', path: '/server-errors', name: 'Server Errors', desc: 'submit() action returns field-targeted server errors; submitting() signal for loading state.' },
    { num: '22', path: '/focus-controls', name: 'Focus Controls', desc: 'focusBoundControl() on FieldTree nodes—no ViewChild/ElementRef; includes "focus first error" pattern.' },
    { num: '23', path: '/form-root', name: 'formRoot Directive', desc: '[formRoot] makes submission declarative: no manual (submit) handler or preventDefault needed.' },
    { num: '24', path: '/compat-bridge', name: 'Compat Bridge', desc: 'SignalFormControl inside a FormGroup, or compatForm wrapping a FormControl—migrate incrementally.' },
    { num: '25', path: '/structuring-large-forms', name: 'Structuring large forms (talk)', desc: 'Profile form from the talk: model factories, build*Section schema, child components with FieldTree slices.' },
  ];
}
