export interface ICrudService<TSaveDto, TDetailDto, TListing, TFilter> {
  getAll(filter: TFilter): Promise<TListing[]>;
  getById(id: number): Promise<TDetailDto>;
  create(dto: TSaveDto): Promise<TSaveDto>;
  update(id: number, dto: TSaveDto): Promise<TSaveDto>;
  delete(id: number): Promise<void>;
}
