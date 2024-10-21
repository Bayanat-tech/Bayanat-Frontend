import ClickAwayListener from '@mui/material/ClickAwayListener';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import { useState } from 'react';

function CustomTooltip({
  message,
  children,
  className,
  props
}: {
  message: React.ReactNode;
  children: React.ReactElement<any, any>;
  className?: string;
  props?: Partial<TooltipProps>;
}) {
  const [open, setOpen] = useState(false);

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const handleTooltipClose = () => {
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <Tooltip
          className={className}
          {...props}
          open={open}
          title={message}
          arrow
          onClick={handleTooltipOpen}
          onMouseEnter={handleTooltipOpen}
          onMouseLeave={handleTooltipClose}
        >
          {children}
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
}

export default CustomTooltip;
