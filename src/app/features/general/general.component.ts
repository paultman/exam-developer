// src/app/features/general/general.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { A11yModule } from '@angular/cdk/a11y';
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
          <li><span aria-current="page">General settings</span></li>
        </ol>
      </nav>

      <main
        id="main-content"
        class="content-container"
        role="main"
        aria-labelledby="page-title"
      >
        <h1 id="page-title" tabindex="-1">General settings</h1>

        <div
          class="settings-card"
          role="form"
          aria-label="General settings form"
        >
          <div class="setting-item">
            <div class="setting-label" id="ai-writing-label">
              AI assisted item writing
            </div>
            <div class="toggle-wrapper">
              <mat-slide-toggle
                [(ngModel)]="aiWritingEnabled"
                [aria-labelledby]="'ai-writing-label'"
                (change)="updateToggleStatus($event, 'ai-writing-status')"
                aria-describedby="ai-writing-status"
              ></mat-slide-toggle>
              <span
                class="status"
                id="ai-writing-status"
                [attr.aria-label]="
                  'AI writing is ' + (aiWritingEnabled ? 'enabled' : 'disabled')
                "
              >
                {{ aiWritingEnabled ? 'Enabled' : 'Disabled' }}
              </span>
            </div>
          </div>

          <hr role="separator" aria-hidden="true" />

          <div class="setting-item">
            <div class="setting-label" id="blueprint-label">
              Required blueprint selection prior to generating questions
            </div>
            <div class="toggle-wrapper">
              <mat-slide-toggle
                [(ngModel)]="blueprintRequired"
                [aria-labelledby]="'blueprint-label'"
                (change)="updateToggleStatus($event, 'blueprint-status')"
                aria-describedby="blueprint-status"
              ></mat-slide-toggle>
              <span
                class="status"
                id="blueprint-status"
                [attr.aria-label]="
                  'Blueprint requirement is ' +
                  (blueprintRequired ? 'enabled' : 'disabled')
                "
              >
                {{ blueprintRequired ? 'Enabled' : 'Disabled' }}
              </span>
            </div>
          </div>

          <div
            class="radio-section"
            role="radiogroup"
            aria-labelledby="item-type-label"
          >
            <label id="item-type-label">
              Select item type
              <span class="required" aria-label="required">*</span>
            </label>

            <div class="radio-grid">
              <div class="radio-option" role="presentation">
                <mat-radio-button
                  value="single"
                  [checked]="selectedItemType === 'single'"
                  (change)="updateItemType('single')"
                  aria-label="Multiple choice - single select"
                >
                  Multiple choice - single select
                </mat-radio-button>
              </div>

              <div class="radio-option" role="presentation">
                <mat-radio-button
                  value="single-audio"
                  [checked]="selectedItemType === 'single-audio'"
                  (change)="updateItemType('single-audio')"
                  aria-label="Multiple choice - single select with audio"
                >
                  Multiple choice - single select with audio
                </mat-radio-button>
              </div>

              <div class="radio-option" role="presentation">
                <mat-radio-button
                  value="survey"
                  [checked]="selectedItemType === 'survey'"
                  (change)="updateItemType('survey')"
                  aria-label="Multiple choice - survey"
                >
                  Multiple choice - survey
                </mat-radio-button>
              </div>
            </div>
          </div>

          <div class="action-buttons" role="group" aria-label="Form actions">
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
              type="submit"
              aria-label="Save changes and return to dashboard"
            >
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
          font-weight: 500;
        }
      }

      .toggle-wrapper {
        display: flex;
        align-items: center;
        gap: 16px;

        .status {
          color: rgba(0, 0, 0, 0.6);
        }

        mat-slide-toggle:focus {
          outline: 2px solid #0073ea;
          outline-offset: 2px;
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
          font-weight: 500;

          .required {
            color: rgba(0, 0, 0, 0.87);
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
          border-color: #008099;
        }

        &:focus-within {
          outline: 2px solid #0073ea;
          outline-offset: 2px;
        }
      }

      .action-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 32px;
        padding-top: 24px;
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

      .save-button {
        background-color: #008099 !important;
        color: white !important;
      }

      @media (forced-colors: active) {
        .settings-card {
          border: 1px solid ButtonText;
        }

        .radio-option {
          border: 1px solid ButtonText;
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
export class GeneralComponent implements OnInit {
  aiWritingEnabled = false;
  blueprintRequired = false;
  selectedItemType = 'single';

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

  updateToggleStatus(event: any, statusId: string): void {
    const statusElement = document.getElementById(statusId);
    if (statusElement) {
      statusElement.textContent = event.checked ? 'Enabled' : 'Disabled';
      // Announce change to screen readers
      this.announceChange(
        `${event.source.ariaLabel} is now ${
          event.checked ? 'enabled' : 'disabled'
        }`
      );
    }
  }

  updateItemType(type: string): void {
    this.selectedItemType = type;
    this.announceChange(`Selected item type: ${type}`);
  }

  cancel(): void {
    this.announceChange('Canceling changes and returning to dashboard');
    this.router.navigate(['/dashboard']);
  }

  save(): void {
    this.announceChange('Saving changes and returning to dashboard');
    console.log('Saving settings:', {
      aiWritingEnabled: this.aiWritingEnabled,
      blueprintRequired: this.blueprintRequired,
      selectedItemType: this.selectedItemType,
    });
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
