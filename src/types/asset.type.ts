export interface Ass {
  assetId: string;
  createdBy: string;
  createdOn: string;
  rootUri: string;
  metadata: any;
  name: string;
  ownerId: string;
}

export interface Lay {
  id: string;
  name: string;
  metadata: {
    datasetName: string;
  };
}