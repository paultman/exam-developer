export interface MetadataItem {
  id: string;
  name: string;
  type: 'Single-line Text' | 'Dropdown List';
  required: boolean;
  prompt: string;
  values?: string[];
}
