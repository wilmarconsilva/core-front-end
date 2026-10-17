import { IDocumentSaveDto } from '../../DataTransferObjects/IDocumentSaveDto';
import { IOrderProductSaveDto } from './IOrderProductSaveDto';

export interface IOrderSaveDto extends IDocumentSaveDto<IOrderProductSaveDto> {}
