export class BR {
  status: boolean;
  id: string;
  message: string;
  error: string;
  data: any;

  constructor(
    status: boolean,
    message: string,
    error: string = '',
    data: any = {},
    id: string = '',
  ) {
    this.status = status;
    this.message = message;
    this.error = error;
    this.data = data;
    this.id = id;
  }
}

export const successBR = (
  id: string,
  name: string,
  data: any = {},
  return_data: boolean = false,
): BR => {
  const operation = id && id.length > 0 ? 'update' : 'create';
  if (return_data) {
    return new BR(true, `${name} ${operation}d successfully.`, '', data, id);
  } else {
    return new BR(true, `${name} ${operation}d successfully.`, '', {}, id);
  }
};

export const errorBR = (id: string, name: string, error: string = ''): BR => {
  const operation = id && id.length > 0 ? 'update' : 'create';
  return new BR(false, `${name} ${operation} failed.`, error, {}, id);
};

export class PAGE_DATA {
  total_count: number;
  page_count: number;
  next_page: boolean;
  page_index: number;
  constructor(
    total_count: number,
    page_count: number,
    next_page: boolean,
    page_index: number,
  ) {
    this.total_count = total_count;
    this.page_count = page_count;
    this.next_page = next_page;
    this.page_index = page_index;
  }
}

export class FBR {
  status: boolean;
  message: string;
  page_data: PAGE_DATA;
  data;
  error: string;

  constructor(
    status: boolean,
    message: string,
    page_data: PAGE_DATA,
    data,
    error: string = '',
  ) {
    this.status = status;
    this.message = message;
    this.page_data = page_data;
    this.data = data;
    this.error = error;
  }
}

export const successFBR = (
  totalCount: number = 0,
  take: number = 0,
  skip: number = 0,
  page_index: number = 0,
  data,
): FBR => {
  const currentCount = data?.length;
  const page_data = new PAGE_DATA(
    totalCount,
    currentCount,
    totalCount > take + skip,
    page_index,
  );
  return currentCount > 0
    ? new FBR(true, 'Data found.', page_data, data, '')
    : new FBR(false, 'Data not found.', page_data, [], '');
};

export const errorFBR = (error: string = ''): FBR => {
  const page_data = new PAGE_DATA(0, 0, false, 0);
  return new FBR(false, 'Data not found.', page_data, [], error);
};

export class DBR {
  status: boolean;
  message: string;
  error: string;
  constructor(status: boolean, message: string, error: string = '') {
    this.status = status;
    this.message = message;
    this.error = error;
  }
}

export const successDBR = (name: string): DBR => {
  return new DBR(true, `${name} deleted successfully.`);
};

export const errorDBR_notfound = (name: string): DBR => {
  return new DBR(false, `${name} not found`, '');
};

export const errorDBR = (name: string, error: string = ''): DBR => {
  return new DBR(false, `${name} delete failed.`, error);
};

export class SBR {
  status: boolean;
  message: string;
  error: string;
  constructor(status: boolean, message: string, error: string = '') {
    this.status = status;
    this.message = message;
    this.error = error;
  }
}

export const r_log = (data: any = {}) => {
  return data;
};
