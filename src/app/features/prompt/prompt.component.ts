// src/app/features/prompt/prompt.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageFooterComponent } from '../../shared/components/page-footer/page-footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prompt',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    PageHeaderComponent,
    PageFooterComponent,
  ],
  template: `
    <div class="topaz-page-content">
      <app-page-header></app-page-header>

      <nav class="breadcrumb">
        <a href="#">Item bank name</a> / <a href="#">Project name</a> /
        <a href="#">Item Assist</a> /
        <span>Prompt</span>
      </nav>

      <main class="content-container">
        <div class="header-row">
          <h1>Prompt</h1>
          <div class="header-actions">
            <button mat-button (click)="cancel()">Cancel</button>
            <button mat-flat-button class="save-button" (click)="save()">
              Save
            </button>
          </div>
        </div>

        <div class="prompt-card">
          <div class="toolbar">
            <mat-button-toggle-group
              [(ngModel)]="selectedView"
              class="view-toggles"
            >
              <mat-button-toggle value="grid">
                <mat-icon>grid_view</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle value="chart">
                <mat-icon>bar_chart</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle value="trend">
                <mat-icon>trending_up</mat-icon>
              </mat-button-toggle>
            </mat-button-toggle-group>

            <div class="toolbar-right">
              <span class="example-prompt">Use example prompt</span>
              <button
                mat-stroked-button
                [matMenuTriggerFor]="promptMenu"
                class="insert-button"
              >
                Insert
                <mat-icon>arrow_drop_down</mat-icon>
              </button>
            </div>

            <mat-menu #promptMenu="matMenu">
              <button mat-menu-item (click)="insertExample()">Insert</button>
              <button mat-menu-item (click)="replaceWithExample()">
                Replace
              </button>
            </mat-menu>
          </div>

          <form [formGroup]="promptForm">
            <mat-form-field appearance="outline" class="prompt-field">
              <textarea
                matInput
                formControlName="prompt"
                placeholder="Prompt *"
                required
                rows="15"
              >
              </textarea>
            </mat-form-field>
          </form>

          <div class="prompt-actions">
            <button mat-button (click)="reset()">Reset</button>
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
      }

      .header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        h1 {
          font-size: 24px;
          font-weight: 400;
          margin: 0;
          color: rgba(0, 0, 0, 0.87);
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }
      }

      .prompt-card {
        background: white;
        border-radius: 4px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }

      .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .view-toggles {
        height: 36px;

        ::ng-deep {
          .mat-button-toggle-button {
            height: 36px;
            line-height: 36px;
            padding: 0 12px;
          }

          .mat-button-toggle-label-content {
            line-height: 36px;
          }

          .mat-icon {
            font-size: 20px;
            height: 20px;
            width: 20px;
            line-height: 20px;
          }
        }
      }

      .toolbar-right {
        display: flex;
        align-items: center;
        gap: 16px;

        .example-prompt {
          color: rgba(0, 0, 0, 0.6);
          font-size: 14px;
        }

        .insert-button {
          color: #0073ea;
          border-color: #0073ea;

          mat-icon {
            margin-left: 4px;
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }
      }

      .prompt-field {
        width: 100%;

        ::ng-deep {
          textarea {
            font-family: inherit;
            font-size: 14px;
            line-height: 1.5;
          }
        }
      }

      .prompt-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 24px;
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
export class PromptComponent {
  promptForm: FormGroup;
  selectedView = 'grid';

  examplePrompt = `You are an expert multiple-choice item writer. I am a minimally-competent real estate licensure candidate. You are to write nine 4-option, single-response, multiple-choice test items that will test my competence to practice the essential functions of the real estate profession on day one in the United States. The items must reflect current industry practices, laws, and regulations. Use the item writing specifications given below.

Item Writing Specifications:
The item stem and response options for each item can have up to 200 words, written at eighth-grade reading level. Each of the answer options should be of comparable structure and length. For each item, provide a source justifying the correct answer, and a rationale for why each answer option is correct or incorrect. Use a variety of credible sources, not one source exclusively, if multiple sources have written about this topic. Distractors for math items should be derived from incorrectly calculating the information.
The stem of each item should either end with a complete sentence and a question mark, or an incomplete sentence that is completed by any of the response options.
After I read the stem of each item, I should know what information the item is asking me to provide. I shouldn't have to read the options to know what is being asked.
Create positive stem items, avoiding words like "EXCEPT" and "NOT".
Create plausible, specific, and realistic response options, but make them clearly incorrect. Include common errors or misconceptions. Avoid absurd, ridiculous, humorous, or tricky options. Don't use "All of the above" or "None of the above". Don't combine response options. The response options should not overlap; they should be mutually exclusive. Don't use "Yes" or "No" or "True" or "False" as responses.
The stem and response options for all items should be neutral in terms of gender, ethnicity, culture, and geography within the United States. You can pose the names of companies or organizations in your items but use a series of three sequential letters to name those agencies, such as "XYZ Agency". Try to avoid using "A", "B", "C", and "D".`;

  constructor(private router: Router, private fb: FormBuilder) {
    this.promptForm = this.fb.group({
      prompt: [''],
    });
  }

  insertExample(): void {
    const currentValue = this.promptForm.get('prompt')?.value || '';
    const cursorPosition =
      document.querySelector('textarea')?.selectionStart || 0;

    const newValue =
      currentValue.substring(0, cursorPosition) +
      this.examplePrompt +
      currentValue.substring(cursorPosition);

    this.promptForm.patchValue({ prompt: newValue });
  }

  replaceWithExample(): void {
    this.promptForm.patchValue({ prompt: this.examplePrompt });
  }

  reset(): void {
    this.promptForm.reset({ prompt: '' });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }

  save(): void {
    console.log('Saving prompt:', this.promptForm.value);
    this.router.navigate(['/dashboard']);
  }
}
