import { ISynchronizationPendency } from '../../../Application/Interfaces/DataTransferObjects/Offline/ISynchronizationPendency';

export interface ISynchronizationPendenciesScreenProps {
  onGoBack: () => void;
  /** Opens the form of the pendency's entity loaded with the local record. */
  onEditPendency: (pendency: ISynchronizationPendency) => void;
}
