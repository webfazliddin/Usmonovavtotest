export interface ISelectList {
  orderCode: string;
  text: string;
  value: number;
}

export interface IFilter {
  search: string;
  sortBy?: string;
  orderType: "asc" | "desc";
  page: number;
  pageSize: number;
  totalRows: number;
  statusIds?: any[];
}

export interface IFields {
  key: string;
  label: string;
  sort?: boolean;
  isAmount?: boolean;
  tableList?: any[];
  type?: "input" | "selector" | "checkbox";
  itemNameValue?: string | "value";
  itemName?: string | "text";

  tdRowSpan?: number | string;
  tdColSpan?: number | string;
  thRowSpan?: number | string;
  thColSpan?: number | string;

  thClass?: number | string;
  tdClass?: number | string;

  children?: IFields[];
  isRow?: boolean;
  visible?: boolean;
  removeChildParent?: boolean;
}

export interface innerFields {
  [key: string]: IFields[];
}

export interface IBreadCrumbs {
  text: string;
  disabled?: boolean;
  href: string;
}

export interface IBasicRequest {
  page: number;
  pageSize: number;
  total: number;
}

export interface IPagination {
  title: string;
  totalRows: number;
  firstNumber: number;
  lastNumber: number;
}

export interface ILanguageList {
  code: string;
  shortName: string;
  fullName: string;
  value: number;
  text: string;
  orderCode: string | null | number;
}

export interface ITableActions {
  isView?: boolean;
  isEdit?: boolean;
  isClone?: boolean;
  isDelete?: boolean;
  isHistory?: boolean;
  canAccept?: boolean;
  canCancel?: boolean;
  canDelete?: boolean;
  canApprove?: boolean;
  canSent?: boolean;
  canReject?: boolean;
  canRevoke?: boolean;
  canSentToAgree?: boolean;
  canSentToApprove?: boolean;
  canBackToRedirectStep?: boolean;
  canResentSMS?: boolean;
}

export interface IGetAuthInfo {
  fullName: string | null;
  organizationName: string | null;
  permissions: string[];
  shortName: string | null;
  userName: string | null;
}

export interface IPerson {
  id: number;
  photo?: string | null;
  state?: string | null;
  genderName?: string | null;
  nationalityName?: string | null;
  citizenshipName?: string | null;
  documentType?: string | null;
  birthDateAsString?: string | null;
  disabilityGroup?: number | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  shortName?: string | null;
  fullName?: string | null;
  nationalityId?: number | null;
  citizenshipId?: number | null;
  documentTypeId: number;
  pinfl?: string | null;
  docSeria?: string | null;
  docNumber?: string | null;
  birthOn?: string | null;
  docIssueOn?: string | null;
  docExpireOn?: string;
  docIssueOrganization?: string | null;
  genderId?: number | null;
  stateId?: number | null;
  nameOrder?: number | null;
  isDeath?: boolean | null;
  deathOn?: string | null;
  isDivorce?: boolean | null;
  hasSalary?: boolean | null;
  isMarried?: boolean | null;
  isKadastr?: boolean | null;
  hasDiploma?: boolean | null;
  isAliment?: boolean | null;
  isWomanNotebook?: boolean | null;
  hasDebt?: boolean | null;
  kinshipDegreeId?: number | null;
  kinshipDegree?: string | null;
  notComplete?: boolean | null;
  livingAddress?: IPersonLivingAddress | null;
  pension?: IPersonPension;
  pensions?: IPersonPension[];
  disabilityExtenal?: IPersonDisabilityExtenal;
  positionInfo?: IPersonPositionInfo;
  vtekInfo?: IPersonVtekInfo;
  hasEld: boolean;
  hasTed: boolean;
  hasReestr: boolean;
  hasProtection: boolean;
  hasYouth: boolean;
  hasNeuroLogic: boolean;
  inSxv: boolean;
  inMrv: boolean;
  ironNotebook: boolean;
  inVasilik: boolean;
  pnsTypeId: number | null;
  pnsType: string | null;
  protectionOrderInfo?: IProtectionOrder;
  sntDataInfoDto?: SntDataInfoDto | null;
}

export interface SntDataInfoDto {
  organization: string;
  approximateOn: string;
  orderNumber: number | null;
}
export interface IProtectionOrder {
  givenDate: string | null;
  endDate: string | null;
}
export interface IPersonDisabilityExtenal {
  id: number | null;
  name: string | null;
}

export interface IPersonLivingAddress {
  regionId?: number | null;
  region?: string | null;
  districtId?: number | null;
  district?: string | null;
  mfyId?: number | null;
  mfy?: string | null;
  address?: string | null;
}

export interface IPersonPension {
  amount?: number | null;
  experience?: string | null;
  pensionTypeId?: number | null;
  pensionType?: string | null;
  ownerId?: number | null;
  createdAt?: string | null;
  modifiedAt?: string | null;
  rows?: IPersonRow[] | null;
}

export interface IPersonRow {
  period?: string | null;
  monthIn?: string | null;
  amount?: number | null;
}

export interface IPersonPositionInfo {
  organization?: string | null;
  position?: string | null;
}

export interface IPersonVtekInfo {
  disabilityGroup?: number | null;
  nBlind?: number | null;
  disabilityExpireOn?: string | null;
}

export interface IBasicApi {
  page: number;
  pageSize: number;
  total: number;
}

export interface ILogList {
  id: 0;
  dateAt: string;
  userInfo: string;
  tableId: number | null;
  userId: number | null;
  statusId: number | null;
  table: string;
  status: string;
  applicationTypeStep: string;
  ipAddress: string;
  userAgent: string;
  message: string;
}

export interface ITranslates {
  language?: string;
  columnName: string;
  languageId: number;
  translateText: string;
}

export interface IModalProps {
  title: string;
  id: number | null;
  cb: string;
}
export interface DefaultGetData extends ITableActions {
  id: number;
}

export interface ISelectListHint extends ISelectList {
  hint: string | null;
}

export interface IFileConfigBody {
  tableId: number;
  docOn: string;
  code?: string;
}

export interface IFileConfig {
  id: number | null;
  columnName: string;
  shortName: string;
  fullName: string;
  maxSize: number;
  isRequired: boolean;
  isMultiple: boolean;
  tables: IFileConfigTables[];
}

export interface IFileConfigTables {
  id: number | null;
  fileTypeId: number;
  fileType: string;
  extension: string;
}

export interface IFileConfigUpdate {
  id: string;
  columnName: string;
  fileConfigId: number;
}

export interface IAddress {
  id: number;
  isTemporary: boolean | null;
  livingAddress: string | null;
  livingDistrict: string | null;
  livingDistrictId: number | null;
  livingMfy: string | number;
  livingMfyId: number | null;
  livingRegion: string | null;
  livingRegionId: number | null;
  temporaryAddress: string | null;
  temporaryDistrict: string | null;
  temporaryDistrictId: number | null;
  temporaryMfy: string | null;
  temporaryMfyId: number | null;
  temporaryRegion: string | null;
  temporaryRegionId: number | null;
  temporaryResidenceType: string | null;
  temporaryResidenceTypeId: number | null;
}
