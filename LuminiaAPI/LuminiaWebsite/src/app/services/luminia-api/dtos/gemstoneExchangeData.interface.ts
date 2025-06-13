export interface GemstoneExchangeDataDto {
  name: string;
  series: GemstoneExchangeDataRow[];
}

export interface GemstoneExchangeDataRow {
  name: number;
  value: number;
}
