import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageFooterComponent } from '../../shared/components/page-footer/page-footer.component';
import { MetadataItem } from './models/metadata.model';

@Component({
  selector: 'app-metadata',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
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

        <div class="settings-card">
          <div class="add-metadata-section">
            <h2>Add new metadata</h2>
            <mat-form-field appearance="outline" class="metadata-select">
              <mat-select
                placeholder="Select metadata"
                [(ngModel)]="selectedMetadataType"
                (selectionChange)="onMetadataTypeSelected()"
              >
                <mat-option value="text">Single-line Text</mat-option>
                <mat-option value="dropdown">Dropdown List</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="metadata-list">
            @for (item of metadata; track item.id) {
            <div class="metadata-item">
              <div class="metadata-header">
                <h3>
                  {{ item.name }}
                  @if (item.required) {
                  <span class="required">Required</span>
                  }
                </h3>
                <div class="metadata-type">{{ item.type }}</div>
                <button class="edit-button" (click)="editMetadata(item)">
                  Edit
                </button>
              </div>

              <div class="metadata-content">
                <div class="prompt-section">
                  <h4>PROMPT</h4>
                  <p>{{ item.prompt }}</p>
                </div>

                @if (item.type === 'Dropdown List' && item.values) {
                <div class="values-section">
                  <h4>FIVE VALUES</h4>
                  <div class="values-list">
                    @for (value of item.values; track value) {
                    <div class="value-item">{{ value }}</div>
                    }
                  </div>
                </div>
                }
              </div>
            </div>
            }
          </div>

          <div class="button-row">
            <button mat-button (click)="cancel()">Cancel</button>
            <button mat-flat-button class="save-button" (click)="save()">
              Save
            </button>
          </div>
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

      .settings-card {
        background: white;
        border-radius: 4px;
        padding: 32px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }

      .add-metadata-section {
        margin-bottom: 32px;

        h2 {
          font-size: 14px;
          font-weight: 400;
          margin: 0 0 16px;
          color: rgba(0, 0, 0, 0.87);
        }
      }

      .metadata-select {
        width: 100%;
        max-width: 300px;
      }

      .metadata-list {
        margin-bottom: 32px;
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

        h3 {
          font-size: 14px;
          font-weight: 400;
          margin: 0;
          color: rgba(0, 0, 0, 0.87);
          flex: 1;

          .required {
            color: #008099;
            margin-left: 8px;
            font-size: 12px;
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

        h4 {
          font-size: 12px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.6);
          margin: 0 0 8px;
        }

        p {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.87);
          margin: 0;
        }

        .values-section {
          margin-top: 16px;
        }

        .values-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .value-item {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.87);
        }
      }

      .button-row {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 32px;
        padding-top: 24px;
        border-top: 1px solid rgba(0, 0, 0, 0.08);
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
export class MetadataComponent {
  selectedMetadataType: string | null = null;

  metadata: MetadataItem[] = [
    {
      id: '1',
      name: 'Apples',
      type: 'Single-line Text',
      required: true,
      prompt:
        'Lorem ipsum dolor sit amet consectetur. Ultricies pharetra magna risus fames sed egestas tristique fusce auctor. Et eget pulvinar sed quis at. Vitae sem velit maecenas nulla purus eu sit non mauris.',
    },
    {
      id: '2',
      name: 'Pears',
      type: 'Single-line Text',
      required: false,
      prompt:
        'Lorem ipsum dolor sit amet consectetur. Ultricies pharetra magna risus fames sed egestas tristique fusce auctor. Et eget pulvinar sed quis at.',
    },
    {
      id: '3',
      name: 'Skill',
      type: 'Dropdown List',
      required: false,
      prompt:
        'Lorem ipsum dolor sit amet consectetur. Ultricies pharetra magna risus fames sed egestas tristique fusce auctor.',
      values: ['Value 1', 'Value 2', 'Value 3', 'Value 4', 'Value 5'],
    },
  ];

  constructor(private router: Router) {}

  onMetadataTypeSelected(): void {
    // TODO: Implement add new metadata dialog
    console.log('Selected metadata type:', this.selectedMetadataType);
    this.selectedMetadataType = null;
  }

  editMetadata(item: MetadataItem): void {
    // TODO: Implement edit metadata dialog
    console.log('Editing metadata:', item);
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }

  save(): void {
    console.log('Saving metadata:', this.metadata);
    this.router.navigate(['/dashboard']);
  }
}
