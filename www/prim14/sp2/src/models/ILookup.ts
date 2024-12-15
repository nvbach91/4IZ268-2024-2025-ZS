export default interface ILookup {
  _id: string;
  label: string;
  type: string;
}

export interface ICheckableLookup extends ILookup {
  checked: boolean;
}
