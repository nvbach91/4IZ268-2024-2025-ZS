export interface PagedList<T> {
  items: T[];
  totalRecords: number;
  currentPage: number;
  offset: number;
}
