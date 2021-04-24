import { Post, Route, Controller, Response, Body, Delete, Path  } from 'tsoa';

import * as controllers from './controllers';
import { Brand, LOB, Persona, AttachFeatureSetBody, ErrorResponse, SuccessResponse, ChangeLocationBody } from './types'

@Route('v1/locations')
export class LocationsRoute extends Controller {
  @Response<SuccessResponse>('201', 'Created')
  @Response<ErrorResponse>('400', 'Bad Request')
  @Response<ErrorResponse>('500', 'Internal Server Error')
  @Post('{sapid}/feature-sets/{featureSetName}')
  public async attachFeatureSetToLocation(
    @Path() sapid: string,
    @Path() featureSetName: string,
    @Body() body: AttachFeatureSetBody,
  ) {
    const result = await controllers.attachFeatureSet({sapid, featureSetName, ...body});
    if(result) {
        this.setStatus(201);
    }
    return result;
  };

  @Response<SuccessResponse>('200', 'Deleted')
  @Response<ErrorResponse>('400', 'Bad Request')
  @Response<ErrorResponse>('500', 'Internal Server Error')
  @Delete('{sapid}/feature-sets/{featureSetName}/brands/{brand}/personas/{persona}/lobs/{lob}')
  public async detachFeatureSetFromLocation(
    @Path() sapid: string,
    @Path() featureSetName: string,
    @Path() brand: Brand,
    @Path() persona: Persona,
    @Path() lob: LOB
  ) {
    const result = await controllers.detachFeatureSet({sapid, featureSetName, brand, lob, persona});
    if(result) {
        this.setStatus(200);
    }
    return result;
  };

  @Response<SuccessResponse>('201', 'Created')
  @Response<ErrorResponse>('400', 'Bad Request')
  @Response<ErrorResponse>('500', 'Internal Server Error')
  @Post('{sapid}/source-system/{sourceSystem}/change-locations}')
  public async changeLocations(
    @Path() sapid: string,
    @Path() sourceSystem: string,
    @Body() body: ChangeLocationBody,
  ) {
    const result = await controllers.changeLocations(sapid, sourceSystem, body);
    if(result) {
        this.setStatus(201);
    }
    return result;
  };
}