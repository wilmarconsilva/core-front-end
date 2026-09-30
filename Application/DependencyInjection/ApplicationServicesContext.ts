import { createContext } from 'react';
import { IApplicationServices } from './IApplicationServices';

/**
 * Injection point of the application services. The composition root provides
 * the concrete implementation at the top of the component tree.
 */
export const ApplicationServicesContext = createContext<IApplicationServices | null>(null);
