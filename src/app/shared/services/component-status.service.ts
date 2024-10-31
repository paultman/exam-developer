import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {
  ComponentStatus,
  ComponentStatusState,
} from '../interfaces/component-status.interface';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ComponentStatusService {
  private readonly initialState: ComponentStatusState = {
    components: {
      general: {
        id: 'general',
        isComplete: false,
        requiredFields: ['selectedItemType'],
        displayName: 'General settings',
      },
      'knowledge-base': {
        id: 'knowledge-base',
        isComplete: false,
        requiredFields: ['selectedFiles'],
        displayName: 'Knowledge base',
      },
      metadata: {
        id: 'metadata',
        isComplete: false,
        requiredFields: ['addedMetadata'],
        displayName: 'Metadata',
      },
      'additional-parameters': {
        id: 'additional-parameters',
        isComplete: false,
        requiredFields: ['parameters'],
        displayName: 'Additional parameters',
      },
      prompt: {
        id: 'prompt',
        isComplete: false,
        requiredFields: ['prompt'],
        displayName: 'Prompt',
      },
    },
    aiWritingEnabled: false,
  };

  private state$ = new BehaviorSubject<ComponentStatusState>(this.initialState);

  constructor(private notificationService: NotificationService) {}

  getComponentStatus(
    componentId: ComponentStatus['id']
  ): Observable<ComponentStatus> {
    return this.state$.pipe(map((state) => state.components[componentId]));
  }

  getAllComponentStatuses(): Observable<Record<string, ComponentStatus>> {
    return this.state$.pipe(map((state) => state.components));
  }

  isAiWritingEnabled(): Observable<boolean> {
    return this.state$.pipe(map((state) => state.aiWritingEnabled));
  }

  updateComponentStatus(
    componentId: ComponentStatus['id'],
    status: Partial<ComponentStatus>
  ): void {
    const currentState = this.state$.value;
    const updatedComponent = {
      ...currentState.components[componentId],
      ...status,
    };

    const newState = {
      components: {
        ...currentState.components,
        [componentId]: updatedComponent,
      },
      aiWritingEnabled: false,
    };

    // Check if all components are complete
    const allComplete = Object.values(newState.components).every(
      (component) => component.isComplete
    );

    newState.aiWritingEnabled = allComplete;

    this.state$.next(newState);

    // Show notification if component is complete
    if (status.isComplete && !currentState.components[componentId].isComplete) {
      this.notificationService.showSuccess(
        `${updatedComponent.displayName} updated!`
      );
    }
  }

  checkComponentCompletion(
    componentId: ComponentStatus['id'],
    data: Record<string, any>
  ): boolean {
    const component = this.state$.value.components[componentId];

    switch (componentId) {
      case 'general':
        return !!data.selectedItemType;

      case 'knowledge-base':
        return (
          Array.isArray(data.selectedFiles) && data.selectedFiles.length > 0
        );

      case 'metadata':
        return (
          Array.isArray(data.addedMetadata) && data.addedMetadata.length > 0
        );

      case 'additional-parameters':
        return Array.isArray(data.parameters) && data.parameters.length > 0;

      case 'prompt':
        return !!data.prompt && data.prompt.trim().length > 0;

      default:
        return false;
    }
  }

  resetStatuses(): void {
    this.state$.next(this.initialState);
  }
}
