import { IDocumentSaveDto } from '../IDocumentSaveDto';
import { IBudgetPaymentSaveDto } from './IBudgetPaymentSaveDto';
import { IBudgetProductSaveDto } from '../Budgets/IBudgetProductSaveDto';

export interface IBudgetSaveDto extends IDocumentSaveDto<IBudgetProductSaveDto, IBudgetPaymentSaveDto> {}
