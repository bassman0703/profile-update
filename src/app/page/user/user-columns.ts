export const columns: {
  columnKey: any,
    name: string,
    sort: boolean,
    search: boolean
}[] = [
  {
    columnKey: 'id',
    name: '#',
    sort: true,
    search: true,
  },
  {
    columnKey: 'firstName',
    name: 'სახელი',
    sort: true,
    search: true,
  },
  {
    columnKey: 'lastName',
    name: 'გვარი',
    sort: true,
    search: true,
  },
  {
    columnKey: 'gender',
    name: 'სქესი',
    sort: true,
    search: true,
  },
  {
    columnKey: 'personalNumber',
    name: 'პირადი ნომერი',
    sort: true,
    search: true,
  },
  {
    columnKey: 'phoneNumber',
    name: 'მობილური',
    sort: true,
    search: true,
  },
  {
    columnKey: 'legalAddress',
    name: 'იურიდიული მისამართი',
    sort: false,
    search: true,
  },
  {
    columnKey: 'actualAddress',
    name: 'ფაქტიური მისამართი',
    sort: false,
    search: true,
  },
  {
    columnKey: 'href="data:application/octet-stream;base64',
    name: 'ფოტოსურათი',
    sort: false,
    search: false,
  },
  {
    columnKey: 'createdAt',
    name: 'შექმნის თარიღი',
    sort: true,
    search: false,
  },
  {
    columnKey: 'actions',
    name: '',
    sort: false,
    search: false,
  }
]
