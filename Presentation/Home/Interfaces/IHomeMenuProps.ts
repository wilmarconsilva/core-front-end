import { Screen } from '../../../Application/Hooks/UseNavigation';
import { OperationMode } from '../../../Application/Services/Offline/OperationModeService';

export interface IHomeMenuProps {
  userName: string;
  navigate: (screen: Screen) => void;
  operationMode: OperationMode;
}
