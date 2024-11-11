// src/app/features/metadata/metadata.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { A11yModule } from '@angular/cdk/a11y';
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
          <li><span aria-current="page">Metadata</span></li>
        </ol>
      </nav>

      <main
        id="main-content"
        class="content-container"
        role="main"
        aria-labelledby="page-title"
      >
        <h1 id="page-title" tabindex="-1">Metadata</h1>

        <div class="metadata-layout">
          <section
            class="add-metadata-section"
            aria-labelledby="add-metadata-title"
          >
            <h2 id="add-metadata-title">Add new metadata</h2>
            <mat-form-field appearance="outline" class="metadata-select">
              <mat-label>Select metadata type</mat-label>
              <mat-select
                [(ngModel)]="selectedMetadataId"
                (selectionChange)="onMetadataSelected()"
                required
                [attr.aria-label]="
                  'Select metadata type' +
                  (selectedMetadataId ? '' : ' (Required)')
                "
              >
                <mat-option
                  *ngFor="let option of metadataOptions"
                  [value]="option.id"
                  [attr.aria-label]="option.name + ' - ' + option.type"
                >
                  {{ option.name }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            @if (selectedTemplate) {
            <div
              class="metadata-form"
              role="form"
              [attr.aria-label]="'Metadata form for ' + selectedTemplate.name"
            >
              <div class="metadata-type" role="status">
                TYPE {{ selectedTemplate.type }}
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Context</mat-label>
                <textarea
                  matInput
                  [(ngModel)]="selectedTemplate.context"
                  rows="3"
                  aria-label="Context information"
                >
                </textarea>
                <mat-hint>Provided to author when using this field.</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Prompt</mat-label>
                <textarea
                  matInput
                  [(ngModel)]="selectedTemplate.prompt"
                  required
                  rows="3"
                  [attr.aria-label]="
                    'Prompt' + (!selectedTemplate.prompt ? ' (Required)' : '')
                  "
                  [attr.aria-invalid]="!selectedTemplate.prompt"
                >
                </textarea>
                <mat-error role="alert" *ngIf="!selectedTemplate.prompt">
                  Prompt is required
                </mat-error>
              </mat-form-field>

              @if (selectedTemplate.type === 'Dropdown List') {
              <mat-slide-toggle
                [(ngModel)]="selectedTemplate.required"
                color="primary"
                class="require-toggle"
                aria-label="Require this metadata when authoring"
              >
                Require this metadata when authoring.
              </mat-slide-toggle>

              <hr class="section-divider" role="separator" aria-hidden="true" />

              @for (category of dropdownCategories; track category) {
              <div
                class="category-section"
                role="region"
                [attr.aria-label]="category + ' category'"
              >
                <div class="category-label" [attr.id]="'category-' + category">
                  {{ category.toUpperCase() }}
                </div>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>{{ category }} prompt</mat-label>
                  <textarea
                    matInput
                    [(ngModel)]="selectedTemplate.categories![category]"
                    rows="3"
                    [attr.aria-labelledby]="'category-' + category"
                    required
                  >
                  </textarea>
                </mat-form-field>
              </div>
              } } @if (selectedTemplate.type === 'Single-line Text') {
              <mat-slide-toggle
                [(ngModel)]="selectedTemplate.required"
                color="primary"
                aria-label="Require this metadata when authoring"
              >
                Require this metadata when authoring.
              </mat-slide-toggle>
              }

              <div class="form-actions" role="group" aria-label="Form actions">
                <button
                  mat-button
                  (click)="cancelAdd()"
                  type="button"
                  aria-label="Cancel adding metadata"
                >
                  Cancel
                </button>
                <button
                  mat-flat-button
                  color="primary"
                  [disabled]="!isTemplateValid()"
                  (click)="addMetadata()"
                  type="submit"
                  [attr.aria-label]="
                    'Add ' + selectedTemplate.name + ' metadata'
                  "
                >
                  Add
                </button>
              </div>
            </div>
            }
          </section>

          <section
            class="added-metadata-section"
            aria-labelledby="added-metadata-title"
          >
            <h2 id="added-metadata-title">Added Metadata</h2>
            @if (!addedMetadata.length) {
            <div
              class="no-metadata"
              role="status"
              aria-label="No metadata has been added yet"
            >
              No metadata has been added yet.
            </div>
            } @else {
            <div
              class="metadata-list"
              role="list"
              aria-label="List of added metadata"
            >
              @for (item of addedMetadata; track item.id) {
              <div class="metadata-item" role="listitem">
                <div class="metadata-header">
                  <div class="metadata-title">
                    {{ item.name }}
                    @if (item.required) {
                    <span
                      class="required-tag"
                      role="status"
                      aria-label="Required metadata"
                    >
                      Required
                    </span>
                    }
                  </div>
                  <div class="metadata-type" aria-label="Type">
                    {{ item.type }}
                  </div>
                  <button
                    class="edit-button"
                    (click)="editMetadata(item)"
                    aria-label="Edit {{ item.name }} metadata"
                  >
                    Edit
                  </button>
                </div>

                <div
                  class="metadata-content"
                  role="region"
                  [attr.aria-label]="'Details for ' + item.name"
                >
                  <div class="section-label">PROMPT</div>
                  <p class="prompt-text">{{ item.prompt }}</p>

                  @if (item.type === 'Dropdown List') {
                  <div
                    class="dropdown-values"
                    role="region"
                    aria-label="Dropdown values"
                  >
                    <div class="section-label">FIVE VALUES</div>
                    <div
                      class="values-list"
                      role="list"
                      aria-label="List of values"
                    >
                      @for (value of item.values; track value) {
                      <span class="value-item" role="listitem">
                        {{ value }}
                      </span>
                      }
                    </div>
                  </div>
                  }
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

      .metadata-layout {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        margin-bottom: 24px;

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      }

      .add-metadata-section,
      .added-metadata-section {
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
        font-weight: 500;
        color: rgba(0, 0, 0, 0.6);
        margin-bottom: 8px;
        text-transform: uppercase;
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

        &:focus-within {
          outline: 2px solid #0073ea;
          outline-offset: 2px;
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
          font-weight: 500;
          color: rgba(0, 0, 0, 0.87);

          .required-tag {
            color: #008099;
            font-size: 12px;
            margin-left: 8px;
            font-weight: normal;
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

      .metadata-content {
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
            padding: 4px 8px;
            background: rgba(0, 0, 0, 0.04);
            border-radius: 4px;
          }
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

      @media (forced-colors: active) {
        .metadata-item {
          border: 1px solid ButtonText;
        }

        .edit-button {
          border: 1px solid ButtonText;
        }

        .value-item {
          border: 1px solid ButtonText;
        }
      }
    `,
  ],
})
export class MetadataComponent implements OnInit {
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

  ngOnInit(): void {
    // Set initial focus to the main heading
    setTimeout(() => {
      const mainHeading = document.querySelector('h1');
      if (mainHeading) {
        (mainHeading as HTMLElement).focus();
      }
    });
  }

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
    this.announceChange(`Selected ${option.name} metadata type`);
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
    this.announceChange('Metadata added successfully');
  }

  editMetadata(item: MetadataTemplate): void {
    this.addedMetadata = this.addedMetadata.filter((m) => m.id !== item.id);
    this.selectedMetadataId = item.id;
    this.selectedTemplate = { ...item };
    this.announceChange(`Editing ${item.name} metadata`);
  }

  cancelAdd(): void {
    this.selectedMetadataId = null;
    this.selectedTemplate = null;
    this.announceChange('Form cleared');
  }

  cancel(): void {
    this.announceChange('Canceling changes and returning to dashboard');
    this.router.navigate(['/dashboard']);
  }

  save(): void {
    this.announceChange('Saving metadata and returning to dashboard');
    console.log('Saving metadata:', this.addedMetadata);
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
