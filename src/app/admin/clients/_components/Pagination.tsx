import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
      <p className="text-xs text-slate-500">
        Page <span className="font-medium text-slate-700">{page}</span> of{' '}
        <span className="font-medium text-slate-700">{totalPages}</span>
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          className="inline-flex h-8 items-center rounded-md border border-slate-300 px-2.5 text-sm text-slate-700 disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="mr-1 h-3.5 w-3.5" />
          Previous
        </button>
        <button
          type="button"
          className="inline-flex h-8 items-center rounded-md border border-slate-300 px-2.5 text-sm text-slate-700 disabled:opacity-40"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="ml-1 h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
