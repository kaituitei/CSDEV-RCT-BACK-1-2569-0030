export type ENV = {
	Variables: {
		jwtPayload: {
			userId: string;
			userName: string;
			expire: number;
		}
	}
}