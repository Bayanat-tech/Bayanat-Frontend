import { ReactElement } from 'react';

export type TAvailableActionButtons =
  | 'add_action'
  | 'view'
  | 'delete'
  | 'edit'
  | 'suspend'
  | 'unsuspend'
  | 'mark_followup'
  | 'not_mark_followup'
  | 'widget_code';

export type TActionButtonGroupProps = {
  handleActions: (arg0: string) => void;
  buttons?: TAvailableActionButtons[];
};

export type TActionButtons = {
  action: TAvailableActionButtons;
  icon: ReactElement;
  tooltip?: string;
  color?: 'default' | 'inherit' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
};
