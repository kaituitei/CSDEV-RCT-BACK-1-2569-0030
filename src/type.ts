export type ENV = {
	Variables: {
		jwtPayload: {
			userId: string;
			username: string;
			expire: number;
		}
	}
}