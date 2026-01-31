import {create} from 'zustand';

interface ModalState {
  showLoginWarning: boolean;
  showNotSupported: boolean;
  showDeleteSuccess: boolean;

  openLoginWarning: () => void;
  closeLoginWarning: () => void;
  openNotSupported: () => void;
  closeNotSupported: () => void;
  openDeleteSuccess: () => void;
  closeDeleteSuccess: () => void;
  closeAll: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  showLoginWarning: false,
  showNotSupported: false,
  showDeleteSuccess: false,

  openLoginWarning: () => set({showLoginWarning: true}),
  closeLoginWarning: () => set({showLoginWarning: false}),
  openNotSupported: () => set({showNotSupported: true}),
  closeNotSupported: () => set({showNotSupported: false}),
  openDeleteSuccess: () => set({showDeleteSuccess: true}),
  closeDeleteSuccess: () => set({showDeleteSuccess: false}),
  closeAll: () =>
    set({
      showLoginWarning: false,
      showNotSupported: false,
      showDeleteSuccess: false,
    }),
}));
