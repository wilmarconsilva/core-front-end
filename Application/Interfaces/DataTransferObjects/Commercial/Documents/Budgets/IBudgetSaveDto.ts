import { IDocumentSaveDto } from '../IDocumentSaveDto';
import { IBudgetProductSaveDto } from '../Budgets/IBudgetProductSaveDto';

export interface IBudgetSaveDto extends IDocumentSaveDto<IBudgetProductSaveDto> {}
