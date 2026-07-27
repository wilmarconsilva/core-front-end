export enum CrudOperationType {
    Create = 1,
    Read = 2,
    Update = 3,
    Delete = 4,
  }

export class CrudOperationTypeUtility {

    static getAll(): CrudOperationType[] {
        return [CrudOperationType.Create, CrudOperationType.Read, CrudOperationType.Update, CrudOperationType.Delete];
    }

}