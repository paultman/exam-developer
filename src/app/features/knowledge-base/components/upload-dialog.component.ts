// src/app/features/knowledge-base/components/upload-dialog.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface UploadFile {
  name: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress?: number;
}

@Component({
  selector: 'app-upload-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatProgressBarModule],
  template: `
    <div class="upload-dialog">
      <div class="dialog-header">
        <h2>Upload resources</h2>
        <button class="close-button" (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div
        class="drop-zone"
        [class.dragging]="isDragging"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <div class="drop-content">
          <mat-icon class="upload-icon">cloud_upload</mat-icon>
          <p>Drag and drop your files here</p>
          <p>
            or
            <button class="choose-file" (click)="fileInput.click()">
              choose file to upload
            </button>
          </p>
          <p class="file-type">Only PDF files are accepted</p>
          <input
            #fileInput
            type="file"
            hidden
            accept=".pdf"
            multiple
            (change)="onFileSelected($event)"
          />
        </div>
      </div>

      <div class="file-list" *ngIf="files.length > 0">
        @for (file of files; track file.name) {
        <div class="file-item">
          <span class="file-name">{{ file.name }}</span>
          @if (file.status === 'pending') {
          <span class="status ready">Ready to be sent</span>
          } @else if (file.status === 'uploading') {
          <div class="upload-progress">
            <mat-progress-bar mode="determinate" [value]="file.progress">
            </mat-progress-bar>
            <span>{{ file.progress }}%</span>
          </div>
          } @else if (file.status === 'success') {
          <span class="status success">
            <mat-icon>check_circle</mat-icon>
          </span>
          } @else if (file.status === 'error') {
          <span class="status error">
            <mat-icon>error</mat-icon>
          </span>
          }
          <button class="action-menu">
            <mat-icon>more_vert</mat-icon>
          </button>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .upload-dialog {
        min-width: 500px;
        max-width: 600px;
      }

      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 24px 16px;

        h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.87);
        }

        .close-button {
          color: rgba(0, 0, 0, 0.54);
          border: none;
          background: none;
          cursor: pointer;
          padding: 8px;

          &:hover {
            background-color: rgba(0, 0, 0, 0.04);
            border-radius: 50%;
          }
        }
      }

      .drop-zone {
        border: 2px dashed rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        padding: 32px;
        margin: 0 24px;
        text-align: center;
        transition: border-color 0.3s ease;

        &.dragging {
          border-color: #0073ea;
          background-color: rgba(0, 115, 234, 0.04);
        }

        .drop-content {
          .upload-icon {
            font-size: 48px;
            width: 48px;
            height: 48px;
            color: rgba(0, 0, 0, 0.54);
            margin-bottom: 16px;
          }

          p {
            margin: 8px 0;
            color: rgba(0, 0, 0, 0.87);
          }

          .choose-file {
            color: #0073ea;
            border: none;
            background: none;
            padding: 0;
            cursor: pointer;
            font-size: inherit;

            &:hover {
              text-decoration: underline;
            }
          }

          .file-type {
            color: rgba(0, 0, 0, 0.6);
            font-size: 14px;
          }
        }
      }

      .file-list {
        margin: 24px;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 4px;
      }

      .file-item {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        font-size: 14px;

        &:last-child {
          border-bottom: none;
        }

        .file-name {
          flex: 1;
          color: rgba(0, 0, 0, 0.87);
        }

        .status {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-right: 16px;
          font-size: 12px;

          &.ready {
            color: #0073ea;
          }

          &.success {
            color: #4caf50;
          }

          &.error {
            color: #f44336;
          }

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }

        .upload-progress {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 200px;
          margin-right: 16px;

          mat-progress-bar {
            flex: 1;
          }

          span {
            min-width: 40px;
            text-align: right;
            color: rgba(0, 0, 0, 0.6);
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
    `,
  ],
})
export class UploadDialogComponent {
  @Output() closeDialog = new EventEmitter<{ files: UploadFile[] }>();

  files: UploadFile[] = [];
  isDragging = false;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const droppedFiles = Array.from(event.dataTransfer?.files || []).filter(
      (file) => file.type === 'application/pdf'
    );

    this.handleFiles(droppedFiles);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const selectedFiles = Array.from(input.files).filter(
        (file) => file.type === 'application/pdf'
      );
      this.handleFiles(selectedFiles);
    }
  }

  handleFiles(files: File[]): void {
    const newFiles = files.map((file) => ({
      name: file.name,
      status: 'pending' as const,
    }));

    this.files.push(...newFiles);

    // Simulate upload process for each file
    newFiles.forEach((file) => {
      setTimeout(() => this.simulateUpload(file), 500);
    });
  }

  simulateUpload(file: UploadFile): void {
    file.status = 'uploading';
    file.progress = 0;

    const interval = setInterval(() => {
      if (file.progress === undefined) return;

      if (file.progress < 100) {
        file.progress += 10;
      } else {
        clearInterval(interval);
        file.status = Math.random() > 0.8 ? 'error' : 'success';
      }
    }, 200);
  }

  close(): void {
    const successFiles = this.files.filter((f) => f.status === 'success');
    this.closeDialog.emit({ files: successFiles });
  }
}
