import { useContext } from 'react';
import { ApplicationServicesContext } from './ApplicationServicesContext';
import { IApplicationServices } from './IApplicationServices';

export function UseApplicationServices(): IApplicationServices {
  const services = useContext(ApplicationServicesContext);

  if (!services) {
    throw new Error('ApplicationServicesContext.Provider não encontrado na árvore de componentes.');
  }

  return services;
}
