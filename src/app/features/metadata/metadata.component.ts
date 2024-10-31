// src/app/features/metadata/metadata.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageFooterComponent } from '../../shared/components/page-footer/page-footer.component';

interface MetadataTemplate {
  id: string;
  name: string;
  type: 'Single-line Text' | 'Dropdown List';
  context?: string;
  prompt: string;
  required?: boolean;
  categories?: Record<string, string>;
  values?: string[];
}

@Component({
  selector: 'app-metadata',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    PageHeaderComponent,
    PageFooterComponent,
  ],
  template: `
    <div class="page-wrapper">
      <app-page-header></app-page-header>

      <nav class="breadcrumb">
        <a href="#">Item bank name</a> / <a href="#">Project name</a> /
        <a href="#">Item Assist</a> /
        <span>Metadata</span>
      </nav>

      <main class="content-container">
        <h1>Metadata</h1>

        <div class="metadata-layout">
          <div class="add-metadata-section">
            <h2>Add new metadata</h2>
            <mat-form-field appearance="outline" class="metadata-select">
              <mat-select
                placeholder="Metadata *"
                [(ngModel)]="selectedMetadataId"
                (selectionChange)="onMetadataSelected()"
              >
                <mat-option
                  *ngFor="let option of metadataOptions"
                  [value]="option.id"
                >
                  {{ option.name }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            @if (selectedTemplate) {
            <div class="metadata-form">
              <div class="metadata-type">TYPE {{ selectedTemplate.type }}</div>

              <mat-form-field appearance="outline" class="full-width">
                <textarea
                  matInput
                  placeholder="Context"
                  [(ngModel)]="selectedTemplate.context"
                  rows="3"
                >
                </textarea>
                <mat-hint>Provided to author when using this field.</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <textarea
                  matInput
                  placeholder="Prompt *"
                  [(ngModel)]="selectedTemplate.prompt"
                  required
                  rows="3"
                >
                </textarea>
              </mat-form-field>

              @if (selectedTemplate.type === 'Dropdown List') {
              <mat-slide-toggle
                [(ngModel)]="selectedTemplate.required"
                color="primary"
                class="require-toggle"
              >
                Require this metadata when authoring.
              </mat-slide-toggle>

              <hr class="section-divider" />

              @for (category of dropdownCategories; track category) {
              <div class="category-section">
                <div class="category-label">{{ category.toUpperCase() }}</div>
                <mat-form-field appearance="outline" class="full-width">
                  <textarea
                    matInput
                    placeholder="Prompt"
                    [(ngModel)]="selectedTemplate.categories![category]"
                    rows="3"
                  >
                  </textarea>
                </mat-form-field>
              </div>
              } } @if (selectedTemplate.type === 'Single-line Text') {
              <mat-slide-toggle
                [(ngModel)]="selectedTemplate.required"
                color="primary"
              >
                Require this metadata when authoring.
              </mat-slide-toggle>
              }

              <div class="form-actions">
                <button mat-button (click)="cancelAdd()">Cancel</button>
                <button
                  mat-flat-button
                  color="primary"
                  [disabled]="!isTemplateValid()"
                  (click)="addMetadata()"
                >
                  Add
                </button>
              </div>
            </div>
            }
          </div>

          <div class="added-metadata-section">
            <h2>Added Metadata</h2>
            @if (!addedMetadata.length) {
            <div class="no-metadata">No metadata has been added yet.</div>
            } @else { @for (item of addedMetadata; track item.id) {
            <div class="metadata-item">
              <div class="metadata-header">
                <div class="metadata-title">
                  {{ item.name }}
                  @if (item.required) {
                  <span class="required-tag">Required</span>
                  }
                </div>
                <div class="metadata-type">{{ item.type }}</div>
                <button class="edit-button" (click)="editMetadata(item)">
                  Edit
                </button>
              </div>

              <div class="metadata-content">
                <div class="section-label">PROMPT</div>
                <p class="prompt-text">{{ item.prompt }}</p>

                @if (item.type === 'Dropdown List') {
                <div class="dropdown-values">
                  <div class="section-label">FIVE VALUES</div>
                  <div class="values-list">
                    @for (value of item.values; track value) {
                    <span class="value-item">{{ value }}</span>
                    }
                  </div>
                </div>
                }
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

      .metadata-layout {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        margin-bottom: 24px;
      }

      .add-metadata-section,
      .added-metadata-section {
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

      .metadata-select {
        width: 100%;
      }

      .metadata-form {
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .metadata-type {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
        margin-bottom: 8px;
      }

      .category-section {
        .category-label {
          font-size: 12px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.6);
          margin-bottom: 8px;
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

      .no-metadata {
        color: rgba(0, 0, 0, 0.38);
        font-size: 14px;
        padding: 16px;
        text-align: center;
        background: rgba(0, 0, 0, 0.02);
        border-radius: 4px;
      }

      .metadata-item {
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .metadata-header {
        display: flex;
        align-items: center;
        padding: 16px;
        background-color: rgba(0, 0, 0, 0.02);
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);

        .metadata-title {
          flex: 1;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.87);

          .required-tag {
            color: #008099;
            font-size: 12px;
            margin-left: 8px;
          }
        }

        .metadata-type {
          color: rgba(0, 0, 0, 0.6);
          font-size: 12px;
          margin-right: 16px;
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

      .metadata-content {
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
          margin: 0 0 16px;
          line-height: 1.5;
        }

        .dropdown-values {
          margin-top: 16px;
        }

        .values-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          .value-item {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.87);
          }
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
      .full-width {
        width: 100%;
      }

      .require-toggle {
        margin: 8px 0;
      }

      .section-divider {
        border: none;
        border-top: 1px solid rgba(0, 0, 0, 0.12);
        margin: 24px 0;
      }

      .category-section {
        margin-bottom: 16px;

        .category-label {
          font-size: 12px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.6);
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        mat-form-field {
          width: 100%;
        }
      }

      ::ng-deep {
        .mat-mdc-form-field {
          .mat-mdc-form-field-hint {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.6);
          }
        }
      }
    `,
  ],
})
export class MetadataComponent {
  selectedMetadataId: string | null = null;
  selectedTemplate: MetadataTemplate | null = null;
  addedMetadata: MetadataTemplate[] = [];

  metadataOptions = [
    { id: 'apples', name: 'Apples', type: 'Single-line Text' as const },
    { id: 'skills', name: 'Skills', type: 'Dropdown List' as const },
    { id: 'content', name: 'Content area', type: 'Single-line Text' as const },
  ];

  dropdownCategories = [
    'grammar',
    'listening',
    'reading',
    'speaking',
    'vocabulary',
    'writing',
  ];

  constructor(private router: Router) {}

  onMetadataSelected(): void {
    if (!this.selectedMetadataId) return;

    const option = this.metadataOptions.find(
      (o) => o.id === this.selectedMetadataId
    );
    if (!option) return;

    if (option.type === 'Dropdown List') {
      this.selectedTemplate = {
        id: option.id,
        name: option.name,
        type: option.type,
        prompt: '',
        categories: this.dropdownCategories.reduce((acc, cat) => {
          acc[cat] = '';
          return acc;
        }, {} as Record<string, string>),
        values: ['Value 1', 'Value 2', 'Value 3', 'Value 4', 'Value 5'],
      };
    } else {
      this.selectedTemplate = {
        id: option.id,
        name: option.name,
        type: option.type,
        prompt: '',
      };
    }
  }

  isTemplateValid(): boolean {
    if (!this.selectedTemplate) return false;
    if (!this.selectedTemplate.prompt) return false;

    if (this.selectedTemplate.type === 'Dropdown List') {
      return !Object.values(this.selectedTemplate.categories || {}).some(
        (v) => !v
      );
    }

    return true;
  }

  addMetadata(): void {
    if (!this.selectedTemplate || !this.isTemplateValid()) return;

    this.addedMetadata.push({ ...this.selectedTemplate });
    this.selectedMetadataId = null;
    this.selectedTemplate = null;
  }

  editMetadata(item: MetadataTemplate): void {
    this.addedMetadata = this.addedMetadata.filter((m) => m.id !== item.id);
    this.selectedMetadataId = item.id;
    this.selectedTemplate = { ...item };
  }

  cancelAdd(): void {
    this.selectedMetadataId = null;
    this.selectedTemplate = null;
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }

  save(): void {
    console.log('Saving metadata:', this.addedMetadata);
    this.router.navigate(['/dashboard']);
  }
}
