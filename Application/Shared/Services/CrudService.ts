import { APIConsumerService } from './APIConsumerService';
import { ICrudService } from '../Interfaces/Services/ICrudService';
import { buildQueryParams } from './Utilities/QueryUtilities';

export class CrudService<TSaveDto, TDetailDto, TListing, TFilter>
  extends APIConsumerService
  implements ICrudService<TSaveDto, TDetailDto, TListing, TFilter>
{
  constructor(protected readonly basePath: string) {
    super();
  }

  async getAll(filter: TFilter): Promise<TListing[]> {
    const params = buildQueryParams(filter);
    return this.request<TListing[]>(`${this.basePath}?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
    { toastsConfiguration: { doNotShowSuccess: true } });
  }

  async getById(id: number): Promise<TDetailDto> {
    return this.request<TDetailDto>(`${this.basePath}/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }, { toastsConfiguration: { doNotShowSuccess: true } });
  }

  async create(dto: TSaveDto): Promise<TSaveDto> {
    return this.request<TSaveDto>(this.basePath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
  }

  async update(id: number, dto: TSaveDto): Promise<TSaveDto> {
    return this.request<TSaveDto>(`${this.basePath}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
  }

  async delete(id: number): Promise<void> {
    return this.request<void>(`${this.basePath}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
