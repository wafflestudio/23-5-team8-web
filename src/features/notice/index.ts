export {
  getNoticesApi,
  getNoticeDetailApi,
  createNoticeApi,
  updateNoticeApi,
  deleteNoticeApi,
} from './api/noticeApi';

export {
  useNoticesQuery,
  useNoticeDetailQuery,
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
  noticeKeys,
} from './model/useNoticeQuery';

export type {
  NoticeResponse,
  NoticeListResponse,
  NoticeCreateRequest,
  NoticeUpdateRequest,
  PageInfo,
} from './model/types';
