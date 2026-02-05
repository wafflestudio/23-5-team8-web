export interface NoticeResponse {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
}

export interface PageInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface NoticeListResponse {
  items: NoticeResponse[];
  pageInfo: PageInfo;
}

export interface NoticeCreateRequest {
  title: string;
  content: string;
  isPinned: boolean;
}

export interface NoticeUpdateRequest {
  title: string;
  content: string;
  isPinned: boolean;
}
