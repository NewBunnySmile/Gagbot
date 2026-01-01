import { ButtonStyle, Interaction, Snowflake, User } from "discord.js";

type Unames =
  | "DisableVibes"
  | "StaticArousal"
  | "DynamicArousal"
  | "DisabledKeyFumbling"
  | "KeyFumblingSelf"
  | "KeyFumblingOthers"
  | "KeyLossDisabled"
  | "KeyLoss"
  | "BlessedLuckDisabled"
  | "BlessedLuck"
  | "KeyGivingDisabled"
  | "KeyGivingPrompt"
  | "KeyGivingAuto"
  | "RemoveBondagePrompt"
  | "RemoveBondageBinder"
  | "RemoveBondageKeyholder"
  | "RemoveBondageAuto";
type Config = {
  [Uname in Unames as `get${Uname}`]: (user: Snowflake) => boolean;
};

type ConfigChoice = {
  name: string;
  helptext: string;
  select_function: (userID: Snowflake) => boolean?;
  value: string | number;
  style: ButtonStyle;
  uname: Unames;
};

export const configoptions: { [key: string]: { [key: string]: { name: string; desc: string; choices: ConfigChoice[]; default: string | number; disabled: (userID: Snowflake) => boolean } } };
export function generateConfigModal(interaction: Interaction, menuset?: string): InteractionReplyOptions;
export function setOption(userID: Snowflake, option: string, choice: number | string);
export function getOption(userID: Snowflake, option: string): number | string;
export function initializeOptions(userID: Snowflake): void;
export const config: Config;
