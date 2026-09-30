import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { IBreadcrumbProps } from '../Interfaces/Breadcrumb/IBreadcrumbProps';
import { IPressableInteractionState } from '../Interfaces/Pressable/IPressableInteractionState';
import { breadcrumbStyles, interactionStyles } from '../Styles';

export type { IBreadcrumbItem } from '../Interfaces/Breadcrumb/IBreadcrumbItem';

export function Breadcrumb({ items }: IBreadcrumbProps) {
  return (
    <View style={breadcrumbStyles.container}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <Text style={breadcrumbStyles.separator}>›</Text>
            )}
            {isLast ? (
              <Text style={breadcrumbStyles.itemActive}>{item.label}</Text>
            ) : (
              <Pressable
                onPress={item.onPress}
                style={({ pressed, hovered }: IPressableInteractionState) =>
                  (pressed || hovered) ? interactionStyles.hovered : null
                }
              >
                <Text style={breadcrumbStyles.item}>{item.label}</Text>
              </Pressable>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}
