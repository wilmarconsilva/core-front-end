import { IDocumentSaveDto } from '../IDocumentSaveDto';
import { IOrderProductSaveDto } from './IOrderProductSaveDto';

export interface IOrderSaveDto extends IDocumentSaveDto<IOrderProductSaveDto> {}
