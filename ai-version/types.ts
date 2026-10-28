export interface Task {
  id: number;
  title: string;
  done: boolean;
}

export interface CreateTaskBody {
  title: string;
}

export interface UpdateTaskBody {
  title?: string | undefined;
  done?: boolean | undefined;
}

export interface TaskParams {
  id: number;
}

export interface TaskQuery {
  search?: string | undefined;
  done?: boolean | string | undefined;
}

export interface TaskStats {
  total: number;
  done: number;
  open: number;
}

export interface RootResponse {
  name: string;
  version: string;
  endpoints: string[];
}

export interface ErrorResponse {
  message: string;
  error?: string | undefined;
  statusCode?: number | undefined;
}
