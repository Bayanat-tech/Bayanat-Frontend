import {
  CheckSquareOutlined,
  CloseSquareOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileOutlined,
  PlayCircleOutlined,
  PlusSquareOutlined,
  UserDeleteOutlined
} from '@ant-design/icons';
import { ButtonGroup, Divider, IconButton } from '@mui/material';
import CustomTooltip from 'components/CustomTooltip';
import React from 'react';
import { TActionButtonGroupProps, TActionButtons } from 'types/types.actionButtonsGroups';

const ActionButtonsGroup = (props: TActionButtonGroupProps) => {
  const { handleActions } = props;

  const availableActionButtons: TActionButtons[] = [
    { action: 'add_action', icon: <PlusSquareOutlined />, tooltip: 'Add Action' },
    { action: 'view', icon: <EyeOutlined />, tooltip: 'View' },
    { action: 'edit', icon: <EditOutlined />, tooltip: 'Edit' },
    { action: 'delete', icon: <DeleteOutlined />, color: 'error', tooltip: 'Delete' },
    { action: 'suspend', icon: <UserDeleteOutlined />, color: 'error', tooltip: 'Suspend' },
    { action: 'unsuspend', icon: <PlayCircleOutlined />, color: 'error', tooltip: 'Unsuspend' },
    { action: 'mark_followup', icon: <CheckSquareOutlined />, color: 'primary', tooltip: 'Completed' },
    { action: 'not_mark_followup', icon: <CloseSquareOutlined />, color: 'error', tooltip: 'Not completed' },
    { action: 'widget_code', icon: <FileOutlined />, color: 'info', tooltip: 'Widget Code' }
  ];

  const requiredButtons: TActionButtons[] = !props?.buttons
    ? availableActionButtons
    : availableActionButtons.filter((eachActionButton) => props?.buttons?.includes(eachActionButton.action));

  return (
    <ButtonGroup variant="text" className="flex items-center">
      {requiredButtons.map((eachActionButton, index, requiredButtonsArr) => (
        <React.Fragment key={index}>
          <CustomTooltip message={eachActionButton.tooltip ?? ''}>
            <IconButton
              color={!eachActionButton.color ? 'primary' : eachActionButton.color}
              onClick={() => handleActions(eachActionButton.action)}
            >
              {eachActionButton.icon}
            </IconButton>
          </CustomTooltip>
          {index < requiredButtonsArr.length - 1 && <Divider orientation="vertical" flexItem />}
        </React.Fragment>
      ))}
    </ButtonGroup>
  );
};

export default ActionButtonsGroup;
