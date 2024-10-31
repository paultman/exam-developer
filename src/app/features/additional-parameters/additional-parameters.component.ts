// src/app/features/additional-parameters/additional-parameters.component.ts
import { Component } from '@angular/core';
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
    PageHeaderComponent,
    PageFooterComponent,
  ],
  template: `
    <div class="page-wrapper">
      <app-page-header></app-page-header>

      <nav class="breadcrumb">
        <a href="#">Item bank name</a> / <a href="#">Project name</a> /
        <a href="#">Item Assist</a> /
        <span>Additional parameters</span>
      </nav>

      <main class="content-container">
        <h1>Additional parameters</h1>

        <div class="parameters-layout">
          <div class="add-parameter-section">
            <h2>Add new parameter</h2>

            <div class="parameter-form" [formGroup]="parameterForm">
              <mat-form-field appearance="outline">
                <input
                  matInput
                  placeholder="Field name *"
                  formControlName="fieldName"
                  required
                />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <textarea
                  matInput
                  placeholder="Context"
                  formControlName="context"
                  rows="4"
                >
                </textarea>
                <mat-hint>Provided to author when using this field.</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <textarea
                  matInput
                  placeholder="Prompt *"
                  formControlName="prompt"
                  required
                  rows="4"
                >
                </textarea>
              </mat-form-field>

              <mat-slide-toggle formControlName="required">
                Author must enter this parameter before generating content.
              </mat-slide-toggle>

              <div class="form-actions">
                <button mat-button (click)="cancelAdd()">Cancel</button>
                <button
                  mat-flat-button
                  color="primary"
                  [disabled]="!isValid()"
                  (click)="addParameter()"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div class="added-parameters-section">
            <h2>Added parameters</h2>
            @if (!parameters.length) {
            <div class="no-parameters">No parameters have been added yet.</div>
            } @else { @for (param of parameters; track param.id) {
            <div class="parameter-item">
              <div class="parameter-header">
                <div class="title">
                  {{ param.fieldName }}
                  @if (param.required) {
                  <span class="required-tag">Required</span>
                  }
                </div>
                <button class="edit-button" (click)="editParameter(param)">
                  Edit
                </button>
              </div>

              <div class="parameter-content">
                <div class="section-label">PROMPT</div>
                <p class="prompt-text">{{ param.prompt }}</p>
              </div>
            </div>
            } }
          </div>
        </div>

        <div class="page-actions">
          <button mat-button (click)="cancel()">Cancel</button>
          <button mat-flat-button class="save-button" (click)="save()">
            Save
          </button>
        </div>
      </main>

      <app-page-footer></app-page-footer>
    </div>
  `,
  styles: [
    `
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

        a {
          color: #0073ea;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
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
        }
      }

      .parameters-layout {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        margin-bottom: 24px;
      }

      .add-parameter-section,
      .added-parameters-section {
        background: white;
        border-radius: 4px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

        h2 {
          font-size: 14px;
          font-weight: 400;
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
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid rgba(0, 0, 0, 0.08);
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
          color: rgba(0, 0, 0, 0.87);

          .required-tag {
            color: #008099;
            font-size: 12px;
            margin-left: 8px;
          }
        }

        .edit-button {
          color: #0073ea;
          background: none;
          border: none;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 14px;

          &:hover {
            background-color: rgba(0, 115, 234, 0.04);
            border-radius: 4px;
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
      }

      .save-button {
        background-color: #008099 !important;
        color: white !important;
      }

      ::ng-deep {
        .mat-mdc-form-field-subscript-wrapper {
          display: none;
        }
      }
    `,
  ],
})
export class AdditionalParametersComponent {
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
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }

  save(): void {
    console.log('Saving parameters:', this.parameters);
    this.router.navigate(['/dashboard']);
  }
}
