/**
 * Estado entregue pelo callback de estilo de <Pressable>.
 *
 * Os tipos do React Native declaram apenas `pressed`; o react-native-web também
 * entrega `hovered` e `focused`. Este tipo evita espalhar `any` pelos componentes.
 */
export interface IPressableInteractionState {
  pressed: boolean;
  hovered?: boolean;
  focused?: boolean;
}
