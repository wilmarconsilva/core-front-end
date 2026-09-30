import { IDocumentSaveDto } from '../../DataTransferObjects/IDocumentSaveDto';
import { IBudgetPaymentSaveDto } from './IBudgetPaymentSaveDto';
import { IBudgetProductSaveDto } from './IBudgetProductSaveDto';

export interface IBudgetSaveDto extends IDocumentSaveDto<IBudgetProductSaveDto, IBudgetPaymentSaveDto> {}
