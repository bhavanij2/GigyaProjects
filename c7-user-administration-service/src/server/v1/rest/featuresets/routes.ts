import { Post, Route, Controller, Response, Body, Delete, Path, Get, Query, Request } from 'tsoa';
import express from 'express';
import * as Joi from 'joi';

import * as controllers from './controllers';
import { CreateFeatureSetBody, ErrorResponse, SuccessResponse } from './types'
import { ErrorTypes, TypedError } from '../../../errors';

@Route('v1/feature-sets')
export class FeatureSetRoute extends Controller {
  @Response<SuccessResponse>('200', 'OK')
  @Response<ErrorResponse>('400', 'Bad Request')
  @Response<ErrorResponse>('500', 'Internal Server Error')
  @Get()
  public async getFeatureSet() {
    const result = await controllers.getFeatureSets();
    if (result) {
      this.setStatus(200);
    }
    return result;
  };

  @Response<SuccessResponse>('201', 'Created')
  @Response<ErrorResponse>('400', 'Bad Request')
  @Response<ErrorResponse>('500', 'Internal Server Error')
  @Post()
  public async createFeatureSet(@Body() body: CreateFeatureSetBody) {
    const result = await controllers.createFeatureSet(body);
    if(result) {
        this.setStatus(201);
    }
    return result;
  };

  @Response<SuccessResponse>('200', 'Deleted')
  @Response<ErrorResponse>('404', 'Bad Request')
  @Response<ErrorResponse>('500', 'Internal Server Error')
  @Delete('{name}')
  public async deleteFeatureSet(@Path() name: string) {
    await this.validateFeatureSetExists(name);
    const result = await controllers.deleteFeatureSet(name);
    if(result) {
      this.setStatus(200);
    }
    return result;
  }

  async validateFeatureSetExists(name){
    const featureSets =  await controllers.getFeatureSets();
    const schema = Joi.object({
      name: Joi.string().valid(featureSets.map(p => p.name)),
    });
    const validationResult = schema.validate({name})
    if(validationResult.error){
      throw new TypedError(
          ErrorTypes.INVALID_INPUT,
          validationResult.error.details[0].message,
          validationResult.error
      );
    }
  }
}
