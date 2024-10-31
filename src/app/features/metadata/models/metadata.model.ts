// src/app/features/metadata/models/metadata.model.ts
export type MetadataType = 'Single-line Text' | 'Dropdown List';

export interface BaseMetadataTemplate {
  id: string;
  name: string;
  type: MetadataType;
  context?: string;
  prompt: string;
  required?: boolean;
}

export interface SingleLineMetadata extends BaseMetadataTemplate {
  type: 'Single-line Text';
}

export interface DropdownMetadata extends BaseMetadataTemplate {
  type: 'Dropdown List';
  categories: {
    [key: string]: string; // category name -> prompt
  };
  values?: string[];
}

export type MetadataTemplate = SingleLineMetadata | DropdownMetadata;

export interface MetadataOption {
  id: string;
  name: string;
  type: MetadataType;
}
