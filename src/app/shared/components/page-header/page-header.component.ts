// src/app/shared/components/page-header/page-header.component.ts
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatMenuModule],
  template: `
    <div class="header-container">
      <mat-toolbar class="page-header">
        <div class="header-left">
          <img src="assets/pearson-white.png" alt="Pearson" height="32" />
          <div class="app-info">
            <div class="title-label">Application</div>
            <div class="title-value">ExamDeveloper</div>
          </div>
          <span class="divider">|</span>
          <div class="app-info">
            <div class="title-label">Testing program</div>
            <div class="title-value">ContosoTesting</div>
          </div>
        </div>

        <div class="header-right">
          <mat-icon class="help-icon">help_outline</mat-icon>
          <div class="user-menu">
            <mat-icon>person_outline</mat-icon>
            <span>Jayne Dough</span>
            <mat-icon>expand_more</mat-icon>
          </div>
        </div>
      </mat-toolbar>
    </div>
  `,
  styles: [
    `
      .header-container {
        background-color: #003057;
        position: sticky;
        top: 0;
        z-index: 1000;
        width: 100%;
      }

      .page-header {
        background-color: #003057;
        color: white;
        height: 64px;
        padding: 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 16px;

        img {
          height: 32px;
          width: auto;
        }
      }

      .divider {
        color: rgba(255, 255, 255, 0.7);
        padding: 0 8px;
      }

      .app-info {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .title-label {
          font-size: 12px;
          opacity: 0.7;
        }

        .title-value {
          font-size: 16px;
          font-weight: 400;
        }
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .help-icon {
        color: white;
        font-size: 20px;
        width: 20px;
        height: 20px;
        cursor: pointer;
      }

      .user-menu {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;

        mat-icon {
          font-size: 20px;
          height: 20px;
          width: 20px;
        }

        span {
          font-size: 14px;
        }
      }

      @media (max-width: 768px) {
        .page-header {
          padding: 0 16px;
        }

        .app-info .title-label {
          display: none;
        }
      }

      @media (max-width: 480px) {
        .divider,
        .app-info:last-child {
          display: none;
        }

        .user-menu span {
          display: none;
        }
      }
    `,
  ],
})
export class PageHeaderComponent {}
