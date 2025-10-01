export type SettingRow = { id:number; key:string; value:string|null; json:any|null; updated_at:string };
export type SettingsResp = { data: SettingRow[] };

export type FlagRow = { id:number; name:string; enabled:0|1; updated_at:string };
export type FlagsResp = { data: FlagRow[] };

export type PromptTemplate = { id:number; title:string; template:string; variables:string|null; is_active:0|1; created_at:string };
export type PromptListResp = { data: PromptTemplate[] };
