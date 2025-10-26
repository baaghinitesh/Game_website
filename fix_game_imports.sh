#!/bin/bash

# Fix imports in games directory
find src/games -name "*.tsx" -o -name "*.ts" | while read file; do
  # Fix GameComponentProps imports from GamePluginRegistry
  sed -i "s|from '../GamePluginRegistry'|from '@games/GamePluginRegistry'|g" "$file"
  sed -i "s|from '../../GamePluginRegistry'|from '@games/GamePluginRegistry'|g" "$file"
  
  # Fix types imports
  sed -i "s|from '../../types'|from '@core/types'|g" "$file"
  sed -i "s|from '../types'|from '@games/types'|g" "$file"
  
  # Fix socket imports
  sed -i "s|from '../../services/socket'|from '@shared/services/socket'|g" "$file"
  sed -i "s|from '../services/socket'|from '@shared/services/socket'|g" "$file"
done

echo "Game imports fixed"
