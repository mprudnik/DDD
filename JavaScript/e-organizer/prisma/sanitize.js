const path = require('node:path');
const fsp = require('node:fs/promises');

const sanitizeEntity = (schema) => {
	if (!schema) return
	for (const property of Object.keys(schema.properties)) {
		const propertyKeys = Object.keys(schema.properties[property])
		const type = schema.properties[property]?.type
		if (type === 'object') sanitizeEntity(schema.properties[property])
		if (Array.isArray(type) && type.length === 2 && type.includes('null')) {
			schema.properties[property].type = type[0]
		}
		if (propertyKeys.includes('$ref')) delete schema.properties[property]
		if (propertyKeys.includes('anyOf')) delete schema.properties[property]
		if (type === 'array' && !schema.properties[property]?.items?.type) {
			delete schema.properties[property]
		}
	}
	return schema
}

const sanitizeSchema = (raw) => {
	const entities = {}
	for (const [entity, schema] of Object.entries(raw)) {
		const name = entity[0].toLowerCase() + entity.slice(1)
		entities[name] = sanitizeEntity(schema)
	}
	return entities
}

(async () => {	
	const pathToEntities = path.join(process.cwd(), 'prisma', 'json-schema.json')

	const src = await fsp.readFile(pathToEntities, 'utf-8')
	const { definitions } = JSON.parse(src)

	const entities = sanitizeSchema(definitions)

	await fsp.writeFile(pathToEntities, JSON.stringify(entities))
})();
