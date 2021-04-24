import { Get, Route } from 'tsoa';

import { LocationData } from '../users/types';
import { getAllHqs } from '../users/controllers';

@Route('v1/hq')
export class GetHqs {
  @Get('')
  public async getHqs(): Promise<LocationData[]> {
    return await getAllHqs();
  }
}
