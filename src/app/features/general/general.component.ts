// src/app/features/general/general.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageFooterComponent } from '../../shared/components/page-footer/page-footer.component';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatButtonModule,
    PageHeaderComponent,
    PageFooterComponent,
  ],
  template: `
    <div class="topaz-page-content">
      <app-page-header></app-page-header>

      <nav class="breadcrumb">
        <a href="#">Item bank name</a> / <a href="#">Project name</a> /
        <a href="#">Item Assist</a> /
        <span>General settings</span>
      </nav>

      <main class="content-container">
        <h1>General settings</h1>

        <div class="settings-card">
          <div class="setting-item">
            <div class="setting-label">AI assisted item writing</div>
            <div class="toggle-wrapper">
              <mat-slide-toggle
                [(ngModel)]="aiWritingEnabled"
              ></mat-slide-toggle>
              <span class="status">Disabled</span>
            </div>
          </div>

          <hr />

          <div class="setting-item">
            <div class="setting-label">
              Required blueprint selection prior to generating questions
            </div>
            <div class="toggle-wrapper">
              <mat-slide-toggle
                [(ngModel)]="blueprintRequired"
              ></mat-slide-toggle>
              <span class="status">Disabled</span>
            </div>
          </div>

          <div class="radio-section">
            <label>Select item type <span class="required">*</span></label>

            <div class="radio-grid">
              <div class="radio-option">
                <mat-radio-button
                  value="single"
                  [checked]="selectedItemType === 'single'"
                  (change)="selectedItemType = 'single'"
                >
                  Multiple choice - single select
                </mat-radio-button>
              </div>

              <div class="radio-option">
                <mat-radio-button
                  value="single-audio"
                  [checked]="selectedItemType === 'single-audio'"
                  (change)="selectedItemType = 'single-audio'"
                >
                  Multiple choice - single select with audio
                </mat-radio-button>
              </div>

              <div class="radio-option">
                <mat-radio-button
                  value="survey"
                  [checked]="selectedItemType === 'survey'"
                  (change)="selectedItemType = 'survey'"
                >
                  Multiple choice - survey
                </mat-radio-button>
              </div>
            </div>
          </div>

          <div class="action-buttons">
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

      .setting-item {
        padding: 16px 0;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.87);

        .setting-label {
          margin-bottom: 12px;
        }
      }

      .toggle-wrapper {
        display: flex;
        align-items: center;
        gap: 16px;

        .status {
          color: rgba(0, 0, 0, 0.6);
        }
      }

      hr {
        border: none;
        border-top: 1px solid rgba(0, 0, 0, 0.08);
        margin: 8px 0;
      }

      .radio-section {
        margin-top: 32px;

        label {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.87);
          margin-bottom: 16px;
          display: block;

          .required {
            color: rgba(0, 0, 0, 0.87); // Changed to dark grey
            margin-left: 4px;
          }
        }
      }

      .radio-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }

      .radio-option {
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        padding: 16px;

        &:has(mat-radio-button.mat-radio-checked) {
          border-color: #008099; // Updated to teal
        }
      }

      .action-buttons {
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
        .mat-mdc-slide-toggle {
          --mdc-switch-selected-track-color: rgba(0, 115, 234, 0.8) !important;
          --mdc-switch-unselected-track-color: rgba(0, 0, 0, 0.5) !important;
          --mdc-switch-selected-handle-color: white !important;
          --mdc-switch-unselected-handle-color: white !important;
          --mdc-switch-unselected-icon-color: white !important;
          --mdc-switch-selected-icon-color: white !important;
        }

        .mat-mdc-radio-button {
          .mdc-form-field {
            font-size: 14px;
          }
          .mdc-radio {
            padding: 0;
            margin-right: 12px;
          }
          &.mat-mdc-radio-checked {
            .mdc-radio__background {
              .mdc-radio__outer-circle {
                border-color: #008099 !important;
              }
              .mdc-radio__inner-circle {
                border-color: #008099 !important;
              }
            }
          }
        }
      }

      @media (max-width: 768px) {
        .radio-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class GeneralComponent {
  aiWritingEnabled = false;
  blueprintRequired = false;
  selectedItemType = 'single';

  constructor(private router: Router) {}

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }

  save(): void {
    console.log('Saving settings:', {
      aiWritingEnabled: this.aiWritingEnabled,
      blueprintRequired: this.blueprintRequired,
      selectedItemType: this.selectedItemType,
    });
    this.router.navigate(['/dashboard']);
  }
}
