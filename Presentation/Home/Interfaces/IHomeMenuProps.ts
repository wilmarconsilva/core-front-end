import { Screen } from '../../../Application/Shared/Hooks/UseNavigation';
import { OperationMode } from '../../../Application/Offline/Services/OperationModeService';

export interface IHomeMenuProps {
  userName: string;
  navigate: (screen: Screen) => void;
  operationMode: OperationMode;
}
