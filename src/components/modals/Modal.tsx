'use client';

import { Modal as ModalMantine, ScrollArea } from '@mantine/core';

type PropsModal = {
  title?: string;
  fullScreen?: boolean;
  opened: boolean;
  close: () => void;
  children: React.ReactNode;
};

export const Modal = ({ opened, close, children, title, fullScreen = false }: PropsModal) => (
  <ModalMantine
    opened={opened}
    onClose={close}
    title={title}
    centered
    trapFocus
    closeOnEscape={false}
    closeOnClickOutside={false}
    returnFocus
    size="auto"
    fullScreen={fullScreen}
    scrollAreaComponent={ScrollArea.Autosize}
    overlayProps={{
      backgroundOpacity: 0.4,
      blur: 1,
    }}
  >
    {children}
  </ModalMantine>
);
