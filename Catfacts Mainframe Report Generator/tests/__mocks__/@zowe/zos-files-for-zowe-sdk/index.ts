export const Upload = {
  bufferToDataSet: async () => ({}),
  fileToDataSet: async () => ({}),
  bufferToUssFile: async () => ({})
};

export const Download = {
  dataSet: async () => ({ commandResponse: 'Downloaded successfully' }),
  ussFile: async () => ({ commandResponse: 'Downloaded successfully' })
};

export const Create = {
  dataSet: async () => ({}),
  ussFile: async () => ({}),
  DataSetTypeEnum: {
    DATA_SET_SEQUENTIAL: 'DATA_SET_SEQUENTIAL',
    DATA_SET_PARTITIONED: 'DATA_SET_PARTITIONED',
    DATA_SET_DIRECT: 'DATA_SET_DIRECT'
  }
};

export const Delete = {
  dataSet: async () => ({}),
  ussFile: async () => ({})
};

export const List = {
  dataSet: async () => ({ items: [] }),
  ussFile: async () => ({ items: [] })
};
