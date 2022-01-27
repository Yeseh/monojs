import { Router, RouterOptions } from 'express';
import { Entity } from './entity';
import { buildGetRoute } from '@yeseh/soar-core';

export function routerFromEntity(entity: Entity, opts?: RouterOptions): Router {
	const router = Router();

	router.get('/', buildGetRoute(entity.collection, entity.keyField));

	return router;
}
