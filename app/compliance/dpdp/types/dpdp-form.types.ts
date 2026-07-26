import React from "react";
import { ScanStatusResponse } from "@/hooks/query-hooks/dpdp.query";
import { FieldHelpContent } from "../components/common/dpdp-info-modal";

export interface DpdpScanFormProps {
  scanRecord: ScanStatusResponse;
}

export interface UrlFieldProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  error?: string;
  touched?: boolean;
  discoveredValue?: string;
  isConfirmed: boolean;
  onConfirm: () => void;
  isNotAvailable: boolean;
  onToggleNotAvailable: () => void;
  onClearValue: () => void;
  helpContent?: FieldHelpContent;
  onOpenHelp?: (content: FieldHelpContent) => void;
}

export interface ToggleProps {
  name: string;
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  label: string;
  description: string;
  badge?: string;
  helpContent?: FieldHelpContent;
  onOpenHelp?: (content: FieldHelpContent) => void;
}

export interface FieldGroupProps {
  label: string;
  badge?: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  helpContent?: FieldHelpContent;
  onOpenHelp?: (content: FieldHelpContent) => void;
  children: React.ReactNode;
}

export interface SectionCardProps {
  step: string;
  title: string;
  badge: string;
  children: React.ReactNode;
  className?: string;
}

export interface CustomUrl {
  id: string;
  field_name: string;
  value: string;
  error?: string;
}

export interface CustomUrlsSectionProps {
  items: CustomUrl[];
  onChange: (items: CustomUrl[]) => void;
}
