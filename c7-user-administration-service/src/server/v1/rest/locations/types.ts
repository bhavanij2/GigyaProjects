import { Brand, LOB, Persona } from '../types';
export { Brand, LOB, Persona, ErrorResponse, SuccessResponse } from '../types';

export interface AttachFeatureSetBody {
  brand: Brand;
  lob: LOB;
  persona: Persona;
  country: string;
  portal: string;
};

export interface ChangeLocationBody {
  newSapId: string;
  newSourceSystem: string;
};
