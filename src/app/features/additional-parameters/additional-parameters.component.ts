import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { A11yModule } from '@angular/cdk/a11y';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageFooterComponent } from '../../shared/components/page-footer/page-footer.component';

interface Parameter {
  id: string;
  fieldName: string;
  context?: string;
  prompt: string;
  required: boolean;
}

@Component({
  selector: 'app-additional-parameters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatIconModule,
    A11yModule,
    PageHeaderComponent,
    PageFooterComponent,
  ],
  template: `
    <div class="page-wrapper">
      <!-- Skip Link -->
      <a class="skip-link" href="#main-content"> Skip to main content </a>

      <app-page-header></app-page-header>

      <nav
        class="breadcrumb"
        role="navigation"
        aria-label="Breadcrumb navigation"
      >
        <ol>
          <li>
            <a href="#" aria-label="Navigate to item bank">Item bank name</a>
          </li>
          <li><a href="#" aria-label="Navigate to project">Project name</a></li>
          <li>
            <a href="#" aria-label="Navigate to Item Assist">Item Assist</a>
          </li>
          <li><span aria-current="page">Additional parameters</span></li>
        </ol>
      </nav>

      <main
        id="main-content"
        class="content-container"
        role="main"
        aria-labelledby="page-title"
      >
        <h1 id="page-title" tabindex="-1">Additional parameters</h1>

        <div class="parameters-layout">
          <section
            class="add-parameter-section"
            aria-labelledby="add-parameter-title"
          >
            <h2 id="add-parameter-title">Add new parameter</h2>

            <form
              class="parameter-form"
              [formGroup]="parameterForm"
              (ngSubmit)="addParameter()"
              role="form"
              aria-label="New parameter form"
            >
              <mat-form-field appearance="outline">
                <mat-label>Field name</mat-label>
                <input
                  matInput
                  formControlName="fieldName"
                  required
                  [attr.aria-label]="'Field name' + (parameterForm.get('fieldName')?.errors?.['required'] ? ' (Required)' : '')"
                  [attr.aria-invalid]="
                    parameterForm.get('fieldName')?.invalid &&
                    parameterForm.get('fieldName')?.touched
                  "
                />
                <mat-error
                  role="alert"
                  *ngIf="parameterForm.get('fieldName')?.errors?.['required']"
                >
                  Field name is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Context</mat-label>
                <textarea
                  matInput
                  formControlName="context"
                  rows="4"
                  aria-label="Context information"
                >
                </textarea>
                <mat-hint>Provided to author when using this field.</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Prompt</mat-label>
                <textarea
                  matInput
                  formControlName="prompt"
                  required
                  rows="4"
                  [attr.aria-label]="'Prompt' + (parameterForm.get('prompt')?.errors?.['required'] ? ' (Required)' : '')"
                  [attr.aria-invalid]="
                    parameterForm.get('prompt')?.invalid &&
                    parameterForm.get('prompt')?.touched
                  "
                >
                </textarea>
                <mat-error
                  role="alert"
                  *ngIf="parameterForm.get('prompt')?.errors?.['required']"
                >
                  Prompt is required
                </mat-error>
              </mat-form-field>

              <mat-slide-toggle
                formControlName="required"
                aria-label="Make parameter required"
              >
                Author must enter this parameter before generating content.
              </mat-slide-toggle>

              <div class="form-actions" role="group" aria-label="Form actions">
                <button
                  type="button"
                  mat-button
                  (click)="cancelAdd()"
                  aria-label="Cancel adding parameter"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  mat-flat-button
                  color="primary"
                  [disabled]="!isValid()"
                  aria-label="Add parameter"
                >
                  Add
                </button>
              </div>
            </form>
          </section>

          <section
            class="added-parameters-section"
            aria-labelledby="added-parameters-title"
          >
            <h2 id="added-parameters-title">Added parameters</h2>
            @if (!parameters.length) {
            <div
              class="no-parameters"
              role="status"
              aria-label="No parameters added"
            >
              No parameters have been added yet.
            </div>
            } @else {
            <div
              class="parameters-list"
              role="list"
              aria-label="List of added parameters"
            >
              @for (param of parameters; track param.id) {
              <div class="parameter-item" role="listitem">
                <div class="parameter-header">
                  <div class="title">
                    {{ param.fieldName }}
                    @if (param.required) {
                    <span
                      class="required-tag"
                      role="status"
                      aria-label="Required parameter"
                    >
                      Required
                    </span>
                    }
                  </div>
                  <button
                    class="edit-button"
                    (click)="editParameter(param)"
                    aria-label="Edit parameter {{ param.fieldName }}"
                  >
                    Edit
                  </button>
                </div>

                <div
                  class="parameter-content"
                  role="region"
                  [attr.aria-label]="'Details for ' + param.fieldName"
                >
                  <div class="section-label">PROMPT</div>
                  <p class="prompt-text">{{ param.prompt }}</p>
                </div>
              </div>
              }
            </div>
            }
          </section>
        </div>

        <div class="page-actions" role="group" aria-label="Page actions">
          <button
            mat-button
            (click)="cancel()"
            type="button"
            aria-label="Cancel changes and return to dashboard"
          >
            Cancel
          </button>
          <button
            mat-flat-button
            class="save-button"
            (click)="save()"
            type="button"
            aria-label="Save changes and return to dashboard"
          >
            Save
          </button>
        </div>
      </main>

      <app-page-footer></app-page-footer>
    </div>
  `,
  styles: [
    `
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #0073ea;
        color: white;
        padding: 8px;
        z-index: 100;
        transition: top 0.2s ease;

        &:focus {
          top: 0;
          outline: 2px solid #ffffff;
          outline-offset: 2px;
        }
      }

      .page-wrapper {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: #f8f9fa;
      }

      .breadcrumb {
        padding: 20px 32px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        background: white;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);

        ol {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
        }

        li {
          display: flex;
          align-items: center;

          &:not(:last-child)::after {
            content: '/';
            margin: 0 8px;
            color: rgba(0, 0, 0, 0.6);
          }
        }

        a {
          color: #0073ea;
          text-decoration: none;
          padding: 4px;
          border-radius: 4px;

          &:hover {
            text-decoration: underline;
          }

          &:focus {
            outline: 2px solid #0073ea;
            outline-offset: 2px;
          }

          &:focus:not(:focus-visible) {
            outline: none;
          }
        }
      }

      .content-container {
        flex: 1;
        padding: 24px 32px;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;

        h1 {
          font-size: 24px;
          font-weight: 400;
          margin: 0 0 24px;
          color: rgba(0, 0, 0, 0.87);

          &:focus {
            outline: none;
          }
        }
      }

      .parameters-layout {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        margin-bottom: 24px;

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      }

      .add-parameter-section,
      .added-parameters-section {
        background: white;
        border-radius: 4px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

        h2 {
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 16px;
          color: rgba(0, 0, 0, 0.87);
        }
      }

      .parameter-form {
        display: flex;
        flex-direction: column;
        gap: 16px;

        mat-form-field {
          width: 100%;
        }

        ::ng-deep {
          .mat-mdc-form-field-error {
            font-size: 12px;
          }
        }
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid rgba(0, 0, 0, 0.08);

        button {
          min-width: 100px;

          &:focus {
            outline: 2px solid #0073ea;
            outline-offset: 2px;
          }

          &:focus:not(:focus-visible) {
            outline: none;
          }
        }
      }

      .no-parameters {
        color: rgba(0, 0, 0, 0.38);
        font-size: 14px;
        padding: 16px;
        text-align: center;
        background: rgba(0, 0, 0, 0.02);
        border-radius: 4px;
      }

      .parameter-item {
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .parameter-header {
        display: flex;
        align-items: center;
        padding: 16px;
        background-color: rgba(0, 0, 0, 0.02);
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);

        .title {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.87);

          .required-tag {
            color: #008099;
            font-size: 12px;
            margin-left: 8px;
            font-weight: normal;
          }
        }

        .edit-button {
          color: #0073ea;
          background: none;
          border: none;
          padding: 8px 16px;
          cursor: pointer;
          font-size: 14px;
          border-radius: 4px;

          &:hover {
            background-color: rgba(0, 115, 234, 0.04);
          }

          &:focus {
            outline: 2px solid #0073ea;
            outline-offset: 2px;
          }

          &:focus:not(:focus-visible) {
            outline: none;
          }
        }
      }

      .parameter-content {
        padding: 16px;

        .section-label {
          font-size: 12px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.6);
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .prompt-text {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.87);
          margin: 0;
          line-height: 1.5;
        }
      }

      .page-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;

        button {
          min-width: 100px;

          &:focus {
            outline: 2px solid #0073ea;
            outline-offset: 2px;
          }

          &:focus:not(:focus-visible) {
            outline: none;
          }
        }
      }

      .save-button {
        background-color: #008099 !important;
        color: white !important;
      }

      @media (forced-colors: active) {
        .parameter-item {
          border: 1px solid ButtonText;
        }

        .edit-button {
          border: 1px solid ButtonText;
        }
      }
    `,
  ],
})
export class AdditionalParametersComponent implements OnInit {
  parameterForm: FormGroup;
  parameters: Parameter[] = [
    {
      id: '1',
      fieldName: 'Additional information',
      prompt:
        'Lorem ipsum dolor sit amet consectetur. Ultricies pharetra magna risus fames sed egestas tristique fusce auctor. Et eget pulvinar sed quis at. Vitae sem velit maecenas nulla purus eu sit non mauris. Enim pharetra dis turpis lorem integer triniverra non orci et. Ornare vitae aliquet purus pellentesque. Ut lacinia blandit ullamcorper aliquet arcu.',
      required: true,
    },
    {
      id: '2',
      fieldName: 'New label here',
      prompt:
        'Lorem ipsum dolor sit amet consectetur. Ultricies pharetra magna risus fames sed egestas tristique fusce auctor. Et eget pulvinar sed quis at. Vitae sem velit maecenas nulla purus eu sit non mauris.',
      required: false,
    },
    {
      id: '3',
      fieldName: 'Sample stem structure',
      prompt:
        'Lorem ipsum dolor sit amet consectetur. Ultricies pharetra magna risus fames sed egestas tristique fusce auctor. Et eget pulvinar sed quis at. Vitae sem velit maecenas nulla purus eu sit non mauris.',
      required: true,
    },
  ];

  constructor(private router: Router, private fb: FormBuilder) {
    this.parameterForm = this.fb.group({
      fieldName: ['', Validators.required],
      context: [''],
      prompt: ['', Validators.required],
      required: [false],
    });
  }

  ngOnInit(): void {
    // Set initial focus to the main heading
    setTimeout(() => {
      const mainHeading = document.querySelector('h1');
      if (mainHeading) {
        (mainHeading as HTMLElement).focus();
      }
    });
  }

  isValid(): boolean {
    return this.parameterForm.valid;
  }

  addParameter(): void {
    if (this.parameterForm.valid) {
      const parameter = {
        id: Math.random().toString(36).substr(2, 9),
        ...this.parameterForm.value,
      };
      this.parameters.push(parameter);
      this.parameterForm.reset(
        {
          fieldName: '',
          context: '',
          prompt: '',
          required: false,
        },
        { emitEvent: false }
      );
      Object.keys(this.parameterForm.controls).forEach((key) => {
        const control = this.parameterForm.get(key);
        if (control) {
          control.markAsUntouched();
          control.markAsPristine();
        }
      });
      // Announce to screen readers
      this.announceChange('Parameter added successfully');
    }
  }

  editParameter(param: Parameter): void {
    this.parameters = this.parameters.filter((p) => p.id !== param.id);
    this.parameterForm.patchValue({
      fieldName: param.fieldName,
      context: param.context || '',
      prompt: param.prompt,
      required: param.required,
    });
    // Announce to screen readers
    this.announceChange(`Editing parameter ${param.fieldName}`);
  }

  cancelAdd(): void {
    this.parameterForm.reset(
      {
        fieldName: '',
        context: '',
        prompt: '',
        required: false,
      },
      { emitEvent: false }
    );
    Object.keys(this.parameterForm.controls).forEach((key) => {
      const control = this.parameterForm.get(key);
      if (control) {
        control.markAsUntouched();
        control.markAsPristine();
      }
    });
    // Announce to screen readers
    this.announceChange('Form cleared');
  }

  cancel(): void {
    this.announceChange('Canceling changes and returning to dashboard');
    this.router.navigate(['/dashboard']);
  }

  save(): void {
    this.announceChange('Saving parameters and returning to dashboard');
    console.log('Saving parameters:', this.parameters);
    this.router.navigate(['/dashboard']);
  }

  private announceChange(message: string): void {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.classList.add('sr-only');
    announcer.textContent = message;
    document.body.appendChild(announcer);

    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }
}
