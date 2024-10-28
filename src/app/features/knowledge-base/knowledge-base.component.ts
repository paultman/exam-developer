// src/app/features/knowledge-base/knowledge-base.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { UploadDialogComponent } from './components/upload-dialog.component';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageFooterComponent } from '../../shared/components/page-footer/page-footer.component';
import { FileItem } from './models/file.model';
import { Router } from '@angular/router';

interface UploadedFile {
  name: string;
  size: string;
  sizeInKB: number;
}

@Component({
  selector: 'app-knowledge-base',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    DragDropModule,
    PageHeaderComponent,
    PageFooterComponent,
  ],
  template: `
    <div class="page-wrapper">
      <app-page-header></app-page-header>

      <nav class="breadcrumb">
        <a href="#">Item bank name</a> / <a href="#">Project name</a> /
        <a href="#">Item Assist</a> /
        <span>Knowledge base</span>
      </nav>

      <main class="content-container">
        <div class="header-row">
          <h1>Knowledge base</h1>
          <button
            mat-stroked-button
            class="upload-button"
            (click)="openUploadDialog()"
          >
            <span>Upload resources</span>
          </button>
        </div>

        <div class="error-banner" *ngIf="hasProcessingError">
          <mat-icon class="warning-icon">warning</mat-icon>
          <span
            >One file failed to process to the VALUE service. Update the file or
            click Save to attempt processing it again.</span
          >
          <button class="try-again">Try again</button>
        </div>

        <h2>Search and select resources</h2>

        <div class="file-sections">
          <div class="file-section">
            <h3>AVAILABLE FILES</h3>
            <div class="search-box">
              <mat-icon>search</mat-icon>
              <input
                type="text"
                placeholder="Search by name"
                [(ngModel)]="searchTerm"
                (input)="filterFiles()"
              />
            </div>

            <div
              class="file-list"
              cdkDropList
              #availableList="cdkDropList"
              [cdkDropListData]="availableFiles"
              [cdkDropListConnectedTo]="[selectedList]"
              (cdkDropListDropped)="drop($event)"
            >
              @for (file of filteredFiles; track file.id) {
              <div class="file-item" cdkDrag>
                <div class="file-item-content">
                  <div class="drag-handle" cdkDragHandle>
                    <mat-icon>drag_indicator</mat-icon>
                  </div>
                  <mat-icon class="file-icon">description</mat-icon>
                  <div class="file-details">
                    <div class="file-name">{{ file.name }}</div>
                    <div class="file-size">{{ file.size }}</div>
                  </div>
                  <button class="action-menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                </div>
              </div>
              }
            </div>

            <div class="add-all">
              <mat-slide-toggle [(ngModel)]="addAllFiles">
                Add all available files
              </mat-slide-toggle>
            </div>
          </div>

          <div class="file-section">
            <h3>SELECTED FILES</h3>
            <div
              class="file-list"
              cdkDropList
              #selectedList="cdkDropList"
              [cdkDropListData]="selectedFiles"
              [cdkDropListConnectedTo]="[availableList]"
              (cdkDropListDropped)="drop($event)"
            >
              @if (selectedFiles.length === 0) {
              <div class="empty-message">Add your files here.</div>
              } @else { @for (file of selectedFiles; track file.id) {
              <div class="file-item" cdkDrag>
                <div class="file-item-content">
                  <div class="drag-handle" cdkDragHandle>
                    <mat-icon>drag_indicator</mat-icon>
                  </div>
                  <mat-icon class="file-icon">description</mat-icon>
                  <div class="file-details">
                    <div class="file-name">{{ file.name }}</div>
                    <div class="file-size">{{ file.size }}</div>
                  </div>
                  <div class="file-status" [class]="file.status">
                    @if (file.status === 'processing') {
                    <mat-icon>hourglass_empty</mat-icon>
                    Processing } @else if (file.status === 'processed') {
                    <mat-icon>check_circle</mat-icon>
                    Processed } @else if (file.status === 'failed') {
                    <mat-icon>error</mat-icon>
                    Failed to process }
                  </div>
                  <button class="action-menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                </div>
              </div>
              } }
            </div>
          </div>
        </div>

        <div class="button-row">
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
      }

      .upload-button {
        color: #008099;
        border-color: #008099;
      }

      .error-banner {
        display: flex;
        align-items: center;
        gap: 12px;
        background-color: #fff4f4;
        border: 1px solid #ffe0e0;
        border-radius: 4px;
        padding: 16px;
        margin-bottom: 24px;
        color: rgba(0, 0, 0, 0.87);
        font-size: 14px;

        .warning-icon {
          color: #f44336;
        }

        .try-again {
          margin-left: auto;
          color: #0073ea;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-size: 14px;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      h2 {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.87);
        margin-bottom: 16px;
      }

      .file-sections {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
      }

      .file-section {
        background: white;
        border-radius: 4px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

        h3 {
          font-size: 12px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.6);
          margin: 0 0 16px;
        }
      }

      .search-box {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        margin-bottom: 16px;

        mat-icon {
          color: rgba(0, 0, 0, 0.54);
        }

        input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 14px;

          &::placeholder {
            color: rgba(0, 0, 0, 0.38);
          }
        }
      }

      .file-list {
        min-height: 200px;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        margin-bottom: 16px;
      }

      .empty-message {
        padding: 16px;
        color: rgba(0, 0, 0, 0.38);
        font-size: 14px;
      }

      .file-item {
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);

        &:last-child {
          border-bottom: none;
        }

        .file-item-content {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          gap: 12px;
        }

        .drag-handle {
          cursor: move;
          color: rgba(0, 0, 0, 0.38);
        }

        .file-icon {
          color: rgba(0, 0, 0, 0.54);
        }

        .file-details {
          flex: 1;

          .file-name {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.87);
          }

          .file-size {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.6);
          }
        }

        .file-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;

          &.processing {
            color: #ff9800;
          }

          &.processed {
            color: #4caf50;
          }

          &.failed {
            color: #f44336;
          }

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }

        .action-menu {
          color: rgba(0, 0, 0, 0.54);
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          border-radius: 50%;

          &:hover {
            background: rgba(0, 0, 0, 0.04);
          }
        }
      }

      .add-all {
        border-top: 1px solid rgba(0, 0, 0, 0.08);
        padding-top: 16px;
      }

      .button-row {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 24px;
      }

      .save-button {
        background-color: #008099 !important;
        color: white !important;
      }

      .cdk-drag-preview {
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
          0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
      }

      .cdk-drag-placeholder {
        opacity: 0;
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .file-list.cdk-drop-list-dragging .file-item:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class KnowledgeBaseComponent {
  searchTerm = '';
  addAllFiles = false;
  hasProcessingError = false;

  availableFiles: FileItem[] = [
    {
      id: '1',
      name: 'PVTC Appendix A - Mobile and Classroom Testing 2.5',
      size: '128 kB',
      sizeInKB: 128,
    },
    {
      id: '2',
      name: 'PVTC Appendix B - Using the Administrator Application in Delivery Manager 1.6',
      size: '52 kB',
      sizeInKB: 52,
    },
    {
      id: '3',
      name: 'PVTC Appendix C - Hardware and Software at PVTC Government Centers 2.7',
      size: '80 kB',
      sizeInKB: 80,
    },
    {
      id: '4',
      name: 'PVTC Appendix D - Cloud Control Technology at PVTC Selects 2.3',
      size: '80 kB',
      sizeInKB: 80,
    },
    {
      id: '5',
      name: 'PVTC Appendix E - Completing DIA in Admissions Manager 1.7',
      size: '80 kB',
      sizeInKB: 80,
    },
    {
      id: '6',
      name: 'PVTC Chapter 01 - Overview 2.7',
      size: '80 kB',
      sizeInKB: 80,
    },
    {
      id: '7',
      name: 'PVTC Chapter 02 - Pearson VUE Certified Administrator 2.0',
      size: '1.2 MB',
      sizeInKB: 1228,
    },
    {
      id: '8',
      name: 'PVTC Chapter 03 - Hardware and Software Overview 3.3',
      size: '2.3 MB',
      sizeInKB: 2355,
    },
  ];

  selectedFiles: FileItem[] = [];
  filteredFiles: FileItem[] = [...this.availableFiles];

  constructor(private router: Router, private dialog: MatDialog) {}

  openUploadDialog(): void {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: '600px',
      disableClose: false,
      panelClass: 'upload-dialog-container',
    });

    dialogRef.componentInstance.closeDialog.subscribe((result) => {
      if (result && result.files) {
        // Convert uploaded files to FileItem format
        const newFiles = result.files.map((file) => ({
          id: Math.random().toString(36).substring(7), // Generate random id
          name: file.name.replace('.pdf', ''),
          size: this.formatFileSize(this.estimateFileSize()),
          sizeInKB: this.estimateFileSize(),
        }));

        // Add to available files
        this.availableFiles = [...this.availableFiles, ...newFiles];
        this.filterFiles(); // Refresh the filtered list
      }
      dialogRef.close();
    });
  }
  // Helper method to format file size
  private formatFileSize(sizeInKB: number): string {
    return sizeInKB >= 1024
      ? `${(sizeInKB / 1024).toFixed(1)} MB`
      : `${sizeInKB} kB`;
  }

  // Helper method to generate random file size for simulation
  private estimateFileSize(): number {
    return Math.floor(Math.random() * (2048 - 50) + 50); // Random size between 50KB and 2MB
  }

  filterFiles(): void {
    if (!this.searchTerm) {
      this.filteredFiles = [...this.availableFiles];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredFiles = this.availableFiles.filter((file) =>
      file.name.toLowerCase().includes(searchLower)
    );
  }

  drop(event: CdkDragDrop<FileItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // If moving to selected files, start processing
      if (event.container.data === this.selectedFiles) {
        const movedFile = this.selectedFiles[event.currentIndex];
        this.processFile(movedFile);
      }
    }
  }

  processFile(file: FileItem): void {
    file.status = 'processing';

    // Simulate processing with random outcome
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.7) {
        file.status = 'failed';
        this.hasProcessingError = true; // Only set to true when a file fails
      } else {
        file.status = 'processed';
      }
    }, 2000);
  }

  toggleAddAll(checked: boolean): void {
    if (checked) {
      // Move all available files to selected
      this.availableFiles.forEach((file) => {
        this.selectedFiles.push({ ...file, status: 'processing' });
        this.processFile(this.selectedFiles[this.selectedFiles.length - 1]);
      });
      this.availableFiles = [];
      this.filteredFiles = [];
    } else {
      // Move all files back to available
      this.selectedFiles.forEach((file) => {
        const cleanFile = {
          id: file.id,
          name: file.name,
          size: file.size,
          sizeInKB: file.sizeInKB,
        };
        this.availableFiles.push(cleanFile);
      });
      this.selectedFiles = [];
      this.filterFiles();
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }

  save(): void {
    // Mock save functionality
    console.log('Saving files:', {
      selected: this.selectedFiles,
    });
    this.router.navigate(['/dashboard']);
  }
}
