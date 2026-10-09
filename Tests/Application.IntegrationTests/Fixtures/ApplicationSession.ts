import type { IApplicationServices } from '../../../Application/DependencyInjection/IApplicationServices';
import { OperationMode } from '../../../Application/Offline/Services/OperationModeService';

type CompositionRootModule = typeof import('../../../Presentation/DependencyInjection/ApplicationCompositionRoot');
type OperationModeModule = typeof import('../../../Application/Offline/Services/OperationModeService');

/**
 * Uma execução da aplicação, do carregamento ao fechamento da aba.
 *
 * O composition root, o modo de operação e o estado da sincronização são singletons de módulo
 * (write-once, como o PWA exige). Cada sessão carrega os módulos isoladamente, recriando o wiring
 * real do `ApplicationCompositionRoot`; o IndexedDB é preservado entre as sessões de um teste,
 * exatamente como num recarregamento da página.
 */
export class ApplicationSession {
  private constructor(readonly services: IApplicationServices) {}

  static startOnline(): ApplicationSession {
    return ApplicationSession.start(OperationMode.Online);
  }

  static startOffline(): ApplicationSession {
    return ApplicationSession.start(OperationMode.Offline);
  }

  private static start(mode: OperationMode): ApplicationSession {
    let services!: IApplicationServices;

    jest.isolateModules(() => {
      const { OperationModeService } = require('../../../Application/Offline/Services/OperationModeService') as OperationModeModule;
      OperationModeService.resolve(mode);

      services = (require('../../../Presentation/DependencyInjection/ApplicationCompositionRoot') as CompositionRootModule)
        .ApplicationCompositionRoot;
    });

    return new ApplicationSession(services);
  }
}
