export interface ComponentStatus {
  id:
    | 'general'
    | 'knowledge-base'
    | 'metadata'
    | 'additional-parameters'
    | 'prompt';
  isComplete: boolean;
  requiredFields: string[];
  displayName: string;
}

export interface ComponentStatusState {
  components: Record<ComponentStatus['id'], ComponentStatus>;
  aiWritingEnabled: boolean;
}
