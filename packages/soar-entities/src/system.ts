import { Entity, Relation, RelationType } from './entity'

/*
 * Holds the entity graph. Communicates with the database;
 */
class System {
	graph: {
		[key: string]: Entity
	}

	constructor() {
		this.graph = {};
	}

	addEntity(toAdd: Entity) {
		let keys = Object.keys(this.graph);
		let exists = keys.includes(toAdd.name);

		if (exists) {
			throw new Error(`Entity ${toAdd.name} already exists`);
		}

		this.graph[toAdd.name] = toAdd;
	}

	createRelation(keyA: string, keyB: string, type: RelationType) {
		let [entityA, fieldA] = this._splitRelation(keyA);
		let [entityB, fieldB] = this._splitRelation(keyB);

		let typeA: RelationType;
		let typeB: RelationType;

		switch (type) {
			case RelationType.MANY_TO_MANY:
			case RelationType.ONE_TO_ONE:
				typeA = typeB = type;
				break;

			case RelationType.MANY_TO_ONE:
				typeA = RelationType.MANY_TO_ONE;
				typeB = RelationType.ONE_TO_MANY;
				break;

			case RelationType.ONE_TO_MANY:
				typeA = RelationType.ONE_TO_MANY;
				typeB = RelationType.MANY_TO_ONE;
				break;
		}

		let relationA: Relation = {
			entity: entityB,
			source: fieldA,
			target: fieldB,
			type: typeA
		}

		let relationB: Relation = {
			entity: entityA,
			source: fieldB,
			target: fieldA,
			type: typeB
		}

		if (!Array.isArray(this.graph[entityA].relations)) {
			this.graph[entityA].relations = [];
		} 

		this.graph[entityA].relations!.push(relationA);
		
		if (!Array.isArray(this.graph[entityB].relations)) {
			this.graph[entityB].relations!.push(relationB);
		}

		this.graph[entityB].relations!.push(relationB);
	}

	_splitRelation(key: string): [string, string] {
		let split = key.split('.');
		return [split[0], split[1]];
	}
}

const system = new System();

export default system;