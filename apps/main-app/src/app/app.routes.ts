import { Route } from '@angular/router';
import { provideSignalFormsConfig } from '@angular/forms/signals';
import { NG_STATUS_CLASSES } from '@angular/forms/signals/compat';

/** Lazy routes: each path loads one standalone topic component that demonstrates part of `@angular/forms/signals`. */
export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./topics/home').then((m) => m.Home),
  },
  {
    path: 'basic-form',
    loadComponent: () =>
      import('./topics/basic-form').then((m) => m.BasicForm),
  },
  {
    path: 'form-model',
    loadComponent: () =>
      import('./topics/form-model').then((m) => m.FormModelTopic),
  },
  {
    path: 'built-in-validators',
    loadComponent: () =>
      import('./topics/built-in-validators').then((m) => m.BuiltInValidators),
  },
  {
    path: 'custom-validators',
    loadComponent: () =>
      import('./topics/custom-validators').then((m) => m.CustomValidators),
  },
  {
    path: 'cross-field-validation',
    loadComponent: () =>
      import('./topics/cross-field-validation').then(
        (m) => m.CrossFieldValidation
      ),
  },
  {
    path: 'field-state',
    loadComponent: () =>
      import('./topics/field-state').then((m) => m.FieldStateTopic),
  },
  {
    path: 'conditional-fields',
    loadComponent: () =>
      import('./topics/conditional-fields').then((m) => m.ConditionalFields),
  },
  {
    path: 'form-submission',
    loadComponent: () =>
      import('./topics/form-submission').then((m) => m.FormSubmission),
  },
  {
    path: 'arrays-and-collections',
    loadComponent: () =>
      import('./topics/arrays-and-collections').then(
        (m) => m.ArraysAndCollections
      ),
  },
  {
    path: 'schema-composition',
    loadComponent: () =>
      import('./topics/schema-composition').then((m) => m.SchemaComposition),
  },
  {
    path: 'custom-controls',
    loadComponent: () =>
      import('./topics/custom-controls').then((m) => m.CustomControls),
  },
  {
    path: 'debounce',
    loadComponent: () =>
      import('./topics/debounce').then((m) => m.DebounceTopic),
  },
  {
    path: 'async-validation',
    loadComponent: () =>
      import('./topics/async-validation').then((m) => m.AsyncValidation),
  },
  {
    path: 'metadata',
    loadComponent: () =>
      import('./topics/metadata').then((m) => m.MetadataTopic),
  },
  {
    path: 'zod-integration',
    loadComponent: () =>
      import('./topics/zod-integration').then((m) => m.ZodIntegration),
  },
  {
    path: 'apply-when-value',
    loadComponent: () =>
      import('./topics/apply-when-value').then((m) => m.ApplyWhenValueTopic),
  },
  {
    path: 'apply-when',
    loadComponent: () =>
      import('./topics/apply-when').then((m) => m.ApplyWhenTopic),
  },
  {
    path: 'apply-schema',
    loadComponent: () =>
      import('./topics/apply-schema').then((m) => m.ApplySchemaTopic),
  },
  {
    path: 'ng-status-classes',
    loadComponent: () =>
      import('./topics/ng-status-classes').then((m) => m.NgStatusClassesTopic),
    providers: [
      ...provideSignalFormsConfig({ classes: NG_STATUS_CLASSES }),
    ],
  },
  {
    path: 'custom-state-classes',
    loadComponent: () =>
      import('./topics/custom-state-classes').then(
        (m) => m.CustomStateClassesTopic,
      ),
  },
  {
    path: 'server-errors',
    loadComponent: () =>
      import('./topics/server-errors').then((m) => m.ServerErrors),
  },
  {
    path: 'focus-controls',
    loadComponent: () =>
      import('./topics/focus-controls').then((m) => m.FocusControls),
  },
  {
    path: 'form-root',
    loadComponent: () =>
      import('./topics/form-root').then((m) => m.FormRootTopic),
  },
  {
    path: 'compat-bridge',
    loadComponent: () =>
      import('./topics/form-composition').then((m) => m.CompatBridge),
  },
  {
    path: 'structuring-large-forms',
    loadComponent: () =>
      import('./topics/structuring-large-forms/structuring-large-forms-topic').then(
        (m) => m.StructuringLargeFormsTopic,
      ),
  },
];
