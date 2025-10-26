#!/bin/bash

# Fix all remaining relative imports

# Fix authStore imports
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from "../store/authStore"|from "@store/authStore"|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from "../../store/authStore"|from "@store/authStore"|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from "../../../store/authStore"|from "@store/authStore"|g'

# Fix GameCard imports
find src -name "*.tsx" | xargs sed -i 's|from "../components/GameCard"|from "@features/games/components/GameCard"|g'
find src -name "*.tsx" | xargs sed -i 's|from "../../components/GameCard"|from "@features/games/components/GameCard"|g'

# Fix Leaderboard imports
find src -name "*.tsx" | xargs sed -i 's|from "../components/Leaderboard"|from "@features/leaderboard/components/Leaderboard"|g'
find src -name "*.tsx" | xargs sed -i 's|from "../../components/Leaderboard"|from "@features/leaderboard/components/Leaderboard"|g'

# Fix loadGames imports
find src -name "*.tsx" | xargs sed -i 's|from "../games/loadGames"|from "@games/loadGames"|g'
find src -name "*.tsx" | xargs sed -i 's|from "../../games/loadGames"|from "@games/loadGames"|g'

# Fix socket imports
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from "../../services/socket"|from "@shared/services/socket"|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from "../services/socket"|from "@shared/services/socket"|g'

echo "Import fixes completed"
