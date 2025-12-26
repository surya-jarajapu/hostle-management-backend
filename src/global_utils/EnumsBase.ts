export enum PAGING {
  Yes = 'Yes',
  No = 'No',
}

export enum LoadParents {
  Yes = 'Yes',
  No = 'No',
  Custom = 'Custom',
}

export enum LoadChild {
  No = 'No',
  Yes = 'Yes',
  Custom = 'Custom',
  Count = 'Count',
}

export enum LoadChildCount {
  No = 'No',
  Yes = 'Yes',
  Custom = 'Custom',
}

export enum IncludeFields {
  All = 'All',
  Custom = 'Custom',
}

export enum OrderBy {
  asc = 'asc',
  desc = 'desc',
}

export enum AccessUserType {
  Admin = 'Admin',
  Officer = 'Officer',
  PatrolMan = 'PatrolMan',
}

export enum LoginFrom {
  Web = 'Web',
  Android = 'Android',
  IPhone = 'IPhone',
}

export enum ApiStatus {
  Success = 'Success',
  Failed = 'Failed',
}

export enum OverSpeed {
  Over_Speed_60KM = 'Over_Speed_60KM',
  Over_Speed_70KM = 'Over_Speed_70KM',
  Over_Speed_80KM = 'Over_Speed_80KM',
  Over_Speed_90KM = 'Over_Speed_90KM',
  Over_Speed_100KM = 'Over_Speed_100KM',
  Over_Speed_110KM = 'Over_Speed_110KM',
  Over_Speed_120KM = 'Over_Speed_120KM',
  Over_Speed_130KM = 'Over_Speed_130KM',
}

export enum TimeSlot {
  TIME_SLOT_12AM_TO_12AM = 'TIME_SLOT_12AM_TO_12AM',
  TIME_SLOT_1AM_TO_1AM = 'TIME_SLOT_1AM_TO_1AM',
  TIME_SLOT_2AM_TO_2AM = 'TIME_SLOT_2AM_TO_2AM',
  TIME_SLOT_3AM_TO_3AM = 'TIME_SLOT_3AM_TO_3AM',
  TIME_SLOT_4AM_TO_4AM = 'TIME_SLOT_4AM_TO_4AM',
  TIME_SLOT_5AM_TO_5AM = 'TIME_SLOT_5AM_TO_5AM',
  TIME_SLOT_6AM_TO_6AM = 'TIME_SLOT_6AM_TO_6AM',
  TIME_SLOT_7AM_TO_7AM = 'TIME_SLOT_7AM_TO_7AM',
  TIME_SLOT_8AM_TO_8AM = 'TIME_SLOT_8AM_TO_8AM',
  TIME_SLOT_9AM_TO_9AM = 'TIME_SLOT_9AM_TO_9AM',
  TIME_SLOT_10AM_TO_10AM = 'TIME_SLOT_10AM_TO_10AM',
  TIME_SLOT_11AM_TO_11AM = 'TIME_SLOT_11AM_TO_11AM',
  TIME_SLOT_12PM_TO_12PM = 'TIME_SLOT_12PM_TO_12PM',
}

export enum NightDriving {
  Night_Driving_8PM_2AM = 'Night_Driving_8PM_2AM',
  Night_Driving_8PM_3AM = 'Night_Driving_8PM_3AM',
  Night_Driving_8PM_4AM = 'Night_Driving_8PM_4AM',
  Night_Driving_8PM_5AM = 'Night_Driving_8PM_5AM',

  Night_Driving_9PM_2AM = 'Night_Driving_9PM_2AM',
  Night_Driving_9PM_3AM = 'Night_Driving_9PM_3AM',
  Night_Driving_9PM_4AM = 'Night_Driving_9PM_4AM',
  Night_Driving_9PM_5AM = 'Night_Driving_9PM_5AM',

  Night_Driving_10PM_2AM = 'Night_Driving_10PM_2AM',
  Night_Driving_10PM_3AM = 'Night_Driving_10PM_3AM',
  Night_Driving_10PM_4AM = 'Night_Driving_10PM_4AM',
  Night_Driving_10PM_5AM = 'Night_Driving_10PM_5AM',

  Night_Driving_11PM_2AM = 'Night_Driving_11PM_2AM',
  Night_Driving_11PM_3AM = 'Night_Driving_11PM_3AM',
  Night_Driving_11PM_4AM = 'Night_Driving_11PM_4AM',
  Night_Driving_11PM_5AM = 'Night_Driving_11PM_5AM',
}

export enum GPSType {
  Ignition = 'Ignition',
  Stoppage = 'Stoppage',
  Genset = 'Genset',
  Door = 'Door',
}

export enum BooleanType {
  Both = 'Both',
  True = 'True',
  False = 'False',
}

export enum Is12AM {
  Yes = 'Yes',
  No = 'No',
}
