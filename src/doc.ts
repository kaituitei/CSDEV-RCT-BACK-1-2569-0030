const openApiDoc = {
	openapi: '3.0.0',
	info: {
		title: 'Lost & Found API Documentation',
		version: '1.0.0',
		description: 'Complete OpenAPI 3.0 specification for Lost & Found items service',
	},
	servers: [
		{
			url: 'http://localhost:3000',
			description: 'Local Server',
		},
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				description: 'Provide JWT token in the Authorization header: `Bearer <token>`',
			},
		},
		schemas: {
			NoticeItem: {
				type: 'object',
				properties: {
					id: { type: 'string', example: 'd3b07384-d113-4621-a185-3b9e523f6e10' },
					title: { type: 'string', example: 'Lost Blue Backpack' },
					userId: { type: 'string', example: 'usr_12345' },
					owner: { type: 'string', example: 'john_doe' },
					type: { type: 'string', enum: ['LOST', 'FOUND'], example: 'LOST' },
					description: { type: 'string', example: 'Contains laptop and notebooks.' },
					location: { type: 'string', example: 'Library 3rd Floor' },
					evenDate: { type: 'string', example: '2026-03-15' },
					image: { type: 'string', nullable: true, example: 'http://bucket.s3.region/uploads/uuid-photo.jpg' },
					createAt: { type: 'string', format: 'date-time' },
				},
			},
			ErrorResponse: {
				type: 'object',
				properties: {
					error: { type: 'string', example: 'Error message description' },
					status: { type: 'integer', example: 400 },
				},
			},
		},
	},
	paths: {
		'/api/auth/register': {
			post: {
				summary: 'Register a new user',
				tags: ['Auth'],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: ['userName', 'password'],
								properties: {
									userName: { type: 'string', example: 'john_doe' },
									password: { type: 'string', example: 'securePassword123' },
								},
							},
						},
					},
				},
				responses: {
					'201': { description: 'User registered successfully' },
					'400': { description: 'Username already taken or invalid parameters' },
				},
			},
		},
		'/api/auth/login': {
			post: {
				summary: 'Log in and obtain JWT',
				tags: ['Auth'],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: ['userName', 'password'],
								properties: {
									userName: { type: 'string', example: 'john_doe' },
									password: { type: 'string', example: 'securePassword123' },
								},
							},
						},
					},
				},
				responses: {
					'200': { description: 'Login successful, returns JWT token' },
					'401': { description: 'Invalid username or password' },
				},
			},
		},
		'/api/items': {
			get: {
				summary: 'List / Filter notice items',
				tags: ['Items'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{ name: 'pageSize', in: 'query', schema: { type: 'integer', default: 10 } },
					{ name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
					{ name: 'search', in: 'query', schema: { type: 'string' }, description: 'Full-text search query' },
				],
				responses: {
					'200': {
						description: 'Paginated list of notice items',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: { type: 'array', items: { $ref: '#/components/schemas/NoticeItem' } },
										total: { type: 'integer', example: 1 },
									},
								},
							},
						},
					},
					'401': { description: 'Unauthorized / Token expired' },
				},
			},
			post: {
				summary: 'Create a new notice item',
				tags: ['Items'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'multipart/form-data': {
							schema: {
								type: 'object',
								required: ['title', 'type', 'description', 'location', 'evenDate'],
								properties: {
									title: { type: 'string', example: 'Lost Blue Backpack' },
									type: { type: 'string', enum: ['LOST', 'FOUND'], example: 'LOST' },
									description: { type: 'string', example: 'Contains laptop and notebooks.' },
									location: { type: 'string', example: 'Library 3rd Floor' },
									evenDate: { type: 'string', example: '2026-03-15' },
									image: { type: 'string', format: 'binary', description: 'Optional image file (JPEG, PNG, WebP)' },
								},
							},
						},
					},
				},
				responses: {
					'201': { description: 'Notice item created successfully' },
					'400': { description: 'Validation error or file upload failure' },
					'401': { description: 'Unauthorized' },
				},
			},
		},
		'/api/items/{id}': {
			get: {
				summary: 'Get item details by ID',
				tags: ['Items'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{ name: 'id', in: 'path', required: true, schema: { type: 'string' } },
				],
				responses: {
					'200': { description: 'Item details' },
					'400': { description: 'Item ID does not exist' },
					'401': { description: 'Unauthorized' },
				},
			},
			patch: {
				summary: 'Update notice item (Owner only)',
				tags: ['Items'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{ name: 'id', in: 'path', required: true, schema: { type: 'string' } },
				],
				requestBody: {
					content: {
						'multipart/form-data': {
							schema: {
								type: 'object',
								properties: {
									title: { type: 'string' },
									type: { type: 'string', enum: ['LOST', 'FOUND'] },
									description: { type: 'string' },
									location: { type: 'string' },
									evenDate: { type: 'string' },
									image: { type: 'string', format: 'binary' },
								},
							},
						},
					},
				},
				responses: {
					'200': { description: 'Item updated successfully' },
					'400': { description: 'Item ID does not exist' },
					'403': { description: 'Forbidden (User does not own this item)' },
				},
			},
			delete: {
				summary: 'Delete notice item (Owner only)',
				tags: ['Items'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{ name: 'id', in: 'path', required: true, schema: { type: 'string' } },
				],
				responses: {
					'200': { description: 'Item deleted successfully' },
					'400': { description: 'Item ID does not exist' },
					'403': { description: 'Forbidden (User does not own this item)' },
				},
			},
		},
		'/api/items/{id}/image': {
			get: {
				summary: 'Get image URL of an item',
				tags: ['Items'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{ name: 'id', in: 'path', required: true, schema: { type: 'string' } },
				],
				responses: {
					'200': { description: 'Image URL retrieved' },
					'400': { description: 'Item ID does not exist' },
				},
			},
		},
		'/api/user/@me/items': {
			get: {
				summary: 'Get items created by currently authenticated user',
				tags: ['User'],
				security: [{ bearerAuth: [] }],
				responses: {
					'200': { description: 'List of user items' },
					'401': { description: 'Unauthorized' },
				},
			},
		},
	},
};

export default (openApiDoc);