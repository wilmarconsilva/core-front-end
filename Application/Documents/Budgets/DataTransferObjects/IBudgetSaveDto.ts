import { IDocumentSaveDto } from '../../DataTransferObjects/IDocumentSaveDto';
import { IBudgetProductSaveDto } from './IBudgetProductSaveDto';

export interface IBudgetSaveDto extends IDocumentSaveDto<IBudgetProductSaveDto> {}
