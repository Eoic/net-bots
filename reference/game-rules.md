# Game rules

Before starting a custom game, player can adjust some of the game rules.

| Name                 | Value bounds               | Default value | Description                                                                                                                                  |
| -------------------- | -------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Max rounds           | 1 - 100                    | 10            | How many battles the game should have. At the start of each round, game state is reset and robots are positioned in their initial positions. |
| Tickes per second    | 3600 - 216 000             | 3600          | how many ticks (game updates) each round can have.                                                                                           |
| Map size             | (256, 256) - (4096 x 4096) | (512 x 512)   | How large the map should be.                                                                                                                 |
| Minimum player count | 2 - 20                     | 2             | Minimum number of players required for a game to start.                                                                                      |
| Minimum team count   | 2 - 20                     | 2             | Minimum number of teams to participate in the game. Registered game players are assigned to teams randomly.                                  |

{% hint style="warning" %}
#### Minimum player count

Number of players required for a game to start is related to the number of teams. There must be at least one player in the team therefore minimum player count cannot be less than minimum team count.
{% endhint %}
