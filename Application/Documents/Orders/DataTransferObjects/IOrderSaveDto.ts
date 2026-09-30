import { IDocumentSaveDto } from '../../DataTransferObjects/IDocumentSaveDto';
import { IOrderPaymentSaveDto } from './IOrderPaymentSaveDto';
import { IOrderProductSaveDto } from './IOrderProductSaveDto';

export interface IOrderSaveDto extends IDocumentSaveDto<IOrderProductSaveDto, IOrderPaymentSaveDto> {}
