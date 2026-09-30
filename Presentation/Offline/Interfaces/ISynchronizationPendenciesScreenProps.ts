import { ISynchronizationPendency } from '../../../Application/Offline/DataTransferObjects/ISynchronizationPendency';

export interface ISynchronizationPendenciesScreenProps {
  onGoBack: () => void;
  /** Opens the form of the pendency's entity loaded with the local record. */
  onEditPendency: (pendency: ISynchronizationPendency) => void;
}
