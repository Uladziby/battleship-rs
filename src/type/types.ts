export const ActionType = {
  REG: "reg",
  CREATE_ROOM: "create_room",
  ADD_USER: "add_user",
  CREATE_GAME: "create_game",
  UPDATE_ROOM: "update_room",
  ADD_SHIPS: "add_ships",
  START_GAME: "start_game",
  ATTACK: "attack",
  RANDOM_ATTACK: "random_attack",
  SINGLE_PLAY: "single_play",
};

export type FormLogin = {
  type: typeof ActionType.REG;
  data: unknown;
  id: number;
};
