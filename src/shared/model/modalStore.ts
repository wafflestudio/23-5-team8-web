import {create} from 'zustand';

// Modal ID (네임스페이스 패턴)
type ModalId =
  // 글로벌 (여러 페이지에서 사용)
  | 'loginWarning'
  | 'notSupported'
  | 'deleteSuccess'
  // search 페이지
  | 'search/cart'
  | 'search/conflict'
  | 'search/noCourseSelected'
  | 'search/timeOverlap'
  | 'search/capacityFull'
  // cart 페이지
  | 'cart/noCourseSelected'
  // registration 페이지
  | 'registration/practiceEnd';

// 모달별 데이터 타입
interface ModalDataMap {
  'search/conflict': { name: string; code: string };
}

interface ModalStoreState {
  openModals: Set<ModalId>;
  modalData: Partial<ModalDataMap>;

  // 새로운 API
  openModal: <T extends ModalId>(
    id: T,
    data?: T extends keyof ModalDataMap ? ModalDataMap[T] : never
  ) => void;
  closeModal: (id: ModalId) => void;
  closeAll: () => void;
  isOpen: (id: ModalId) => boolean;
  getData: <T extends keyof ModalDataMap>(id: T) => ModalDataMap[T] | undefined;

  // 하위 호환성 (기존 API)
  showLoginWarning: boolean;
  showNotSupported: boolean;
  showDeleteSuccess: boolean;
  openLoginWarning: () => void;
  closeLoginWarning: () => void;
  openNotSupported: () => void;
  closeNotSupported: () => void;
  openDeleteSuccess: () => void;
  closeDeleteSuccess: () => void;
}

export const useModalStore = create<ModalStoreState>((set, get) => ({
  openModals: new Set<ModalId>(),
  modalData: {},

  // 새로운 API
  openModal: (id, data) =>
    set((state) => {
      const newOpenModals = new Set(state.openModals);
      newOpenModals.add(id);
      const newModalData = data
        ? { ...state.modalData, [id]: data }
        : state.modalData;
      return {
        openModals: newOpenModals,
        modalData: newModalData,
        // 하위 호환성: 글로벌 모달 상태 동기화
        ...(id === 'loginWarning' && { showLoginWarning: true }),
        ...(id === 'notSupported' && { showNotSupported: true }),
        ...(id === 'deleteSuccess' && { showDeleteSuccess: true }),
      };
    }),

  closeModal: (id) =>
    set((state) => {
      const newOpenModals = new Set(state.openModals);
      newOpenModals.delete(id);
      const newModalData = { ...state.modalData };
      if (id in newModalData) {
        delete newModalData[id as keyof ModalDataMap];
      }
      return {
        openModals: newOpenModals,
        modalData: newModalData,
        // 하위 호환성: 글로벌 모달 상태 동기화
        ...(id === 'loginWarning' && { showLoginWarning: false }),
        ...(id === 'notSupported' && { showNotSupported: false }),
        ...(id === 'deleteSuccess' && { showDeleteSuccess: false }),
      };
    }),

  closeAll: () =>
    set({
      openModals: new Set<ModalId>(),
      modalData: {},
      showLoginWarning: false,
      showNotSupported: false,
      showDeleteSuccess: false,
    }),

  isOpen: (id) => get().openModals.has(id),

  getData: (id) => get().modalData[id] as ModalDataMap[typeof id] | undefined,

  // 하위 호환성 (기존 API)
  showLoginWarning: false,
  showNotSupported: false,
  showDeleteSuccess: false,

  openLoginWarning: () => {
    const { openModal } = get();
    openModal('loginWarning');
  },
  closeLoginWarning: () => {
    const { closeModal } = get();
    closeModal('loginWarning');
  },
  openNotSupported: () => {
    const { openModal } = get();
    openModal('notSupported');
  },
  closeNotSupported: () => {
    const { closeModal } = get();
    closeModal('notSupported');
  },
  openDeleteSuccess: () => {
    const { openModal } = get();
    openModal('deleteSuccess');
  },
  closeDeleteSuccess: () => {
    const { closeModal } = get();
    closeModal('deleteSuccess');
  },
}));
